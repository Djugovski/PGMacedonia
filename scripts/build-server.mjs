#!/usr/bin/env node
/**
 * Bundles the Node API (`server/**`) into a single CommonJS file at
 * `dist-server/index.cjs`. Run with: npm run build:server
 *
 * Why esbuild + CJS:
 *   - No ESM extension dance (server imports like `./env` work fine).
 *   - Works identically under cPanel Passenger, Render, Fly, Docker, or bare
 *     `node dist-server/index.cjs`.
 *   - Fast: a full bundle takes ~100ms.
 */
import { build } from 'esbuild'
import { rm, mkdir, copyFile, access } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const outdir = resolve(root, 'dist-server')
const outfile = resolve(outdir, 'index.cjs')

await rm(outdir, { recursive: true, force: true })
await mkdir(outdir, { recursive: true })

const result = await build({
  entryPoints: [resolve(root, 'server/index.ts')],
  outfile,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  bundle: true,
  // Keep third-party deps external so node_modules install at the deploy
  // target provides them (smaller bundle, easier patching).
  packages: 'external',
  sourcemap: false,
  minify: false,
  logLevel: 'info',
  banner: {
    // Ensure the emitted bundle can be `node`d directly even without `"type"` in package.json.
    js: '#!/usr/bin/env node',
  },
})

if (result.errors.length) {
  console.error(result.errors)
  process.exit(1)
}

// Copy persistent state seed if present so the built artifact is self-contained.
const maybeCopies = ['server/calendar.json']
for (const rel of maybeCopies) {
  const src = resolve(root, rel)
  try {
    await access(src)
    await copyFile(src, resolve(outdir, rel.replace(/^server\//, '')))
  } catch {
    // Missing is fine — the API will create state files on first write.
  }
}

console.info(`[build:server] wrote ${outfile}`)
