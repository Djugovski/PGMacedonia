import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Minimal, dependency-free .env loader. Reads the first existing file from
 * the list, and populates `process.env` for any key that is not already set
 * (so real environment variables always win over the file).
 */
function loadEnvFile(path: string): void {
  if (!existsSync(path)) return
  const raw = readFileSync(path, 'utf8')
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    if (!key || key in process.env) continue
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

const cwd = process.cwd()
loadEnvFile(resolve(cwd, '.env.local'))
loadEnvFile(resolve(cwd, '.env'))
