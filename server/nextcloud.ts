import { Buffer } from 'node:buffer'

/**
 * Reads a Nextcloud public share (images + videos) and exposes it as a
 * static-looking list of media items with direct, anonymous URLs. See:
 *
 *   https://docs.nextcloud.com/server/latest/developer_manual/client_apis/WebDAV/basic.html
 *
 * Configure with a single env var:
 *   NEXTCLOUD_SHARE_URL=https://cloud.pgmacedonia.mk/index.php/s/XXXXXXXXXXXXXX
 *
 * The list is cached in memory for 5 minutes so hitting `/api/gallery` is
 * effectively free, and a single fetch never fans out into parallel requests
 * to Nextcloud (inflight promise is shared).
 */

export interface SharedMediaItem {
  name: string
  path: string
  type: 'image' | 'video'
  mime: string
  size: number
  /** Direct anonymous download URL (original resolution — good for <video> and full-res images). */
  url: string
  /** Anonymous publicpreview resized to ~800px, cropped. Good for grid thumbnails. */
  thumb: string
  /** Anonymous publicpreview resized to ~2000px, fit (not cropped). Good for the lightbox. */
  large: string
  /** Human-readable caption derived from the filename (overridable via captions.json). */
  alt: string
}

interface ShareConfig {
  baseUrl: string
  token: string
  password: string
}

function parseShareUrl(raw: string | undefined): ShareConfig | null {
  if (!raw) return null
  const m = /^(https?:\/\/[^/]+).*?\/s\/([A-Za-z0-9]+)/.exec(raw.trim())
  if (!m) return null
  return {
    baseUrl: m[1]!.replace(/\/$/, ''),
    token: m[2]!,
    password: process.env.NEXTCLOUD_SHARE_PASSWORD?.trim() ?? '',
  }
}

const IMAGE_MIME = /^image\/(?!svg)/i
const VIDEO_MIME = /^video\//i

interface WebdavFileRow {
  name: string
  mime: string
  size: number
}

async function webdavList(cfg: ShareConfig): Promise<WebdavFileRow[]> {
  // NC 29+ public endpoint first, then the legacy one — whichever answers.
  const endpoints = [
    `${cfg.baseUrl}/public.php/dav/files/${cfg.token}/`,
    `${cfg.baseUrl}/public.php/webdav/`,
  ]
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns">
  <d:prop>
    <d:displayname/>
    <d:getcontenttype/>
    <d:getcontentlength/>
    <d:resourcetype/>
  </d:prop>
</d:propfind>`

  // Auth: share token as user, optional password (empty for an open share).
  const authUser = cfg.password ? 'anonymous' : cfg.token
  const authPass = cfg.password
  const auth = Buffer.from(`${authUser}:${authPass}`).toString('base64')

  let lastErr: Error | null = null
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'PROPFIND',
        headers: {
          Depth: '1',
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/xml; charset=utf-8',
        },
        body,
      })
      if (!res.ok) {
        lastErr = new Error(`${url} → HTTP ${res.status}`)
        continue
      }
      const xml = await res.text()
      const rows = parseWebdavResponse(xml)
      if (rows.length > 0 || res.status === 207) return rows
    } catch (e) {
      lastErr = e as Error
    }
  }
  throw lastErr ?? new Error('Could not contact Nextcloud WebDAV endpoint')
}

function parseWebdavResponse(xml: string): WebdavFileRow[] {
  // Namespace-prefix-agnostic regex parse. WebDAV multistatus is regular
  // enough that this is reliable and avoids a new runtime dep.
  const out: WebdavFileRow[] = []
  const respRe = /<([a-z0-9]+:)?response[^>]*>([\s\S]*?)<\/\1?response>/gi
  let m: RegExpExecArray | null
  while ((m = respRe.exec(xml))) {
    const chunk = m[2]!
    // Skip folders (collection resourcetype).
    if (/<([a-z0-9]+:)?collection\b[^>]*\/?>/i.test(chunk)) continue
    const href = /<([a-z0-9]+:)?href>([^<]+)<\/\1?href>/i.exec(chunk)?.[2]?.trim()
    if (!href) continue
    const mime = /<([a-z0-9]+:)?getcontenttype>([^<]*)<\/\1?getcontenttype>/i.exec(chunk)?.[2]?.trim() ?? ''
    const size = Number(/<([a-z0-9]+:)?getcontentlength>(\d+)<\/\1?getcontentlength>/i.exec(chunk)?.[2] ?? '0')
    const decoded = decodeURIComponent(href)
    const parts = decoded.split('/').filter(Boolean)
    const name = parts.pop()
    if (!name) continue
    if (!IMAGE_MIME.test(mime) && !VIDEO_MIME.test(mime)) continue
    out.push({ name, mime, size })
  }
  return out
}

/** Optional: the user can drop a `captions.json` file at the share root to override alt text. */
async function fetchCaptions(cfg: ShareConfig): Promise<Record<string, string>> {
  const url = `${cfg.baseUrl}/index.php/s/${cfg.token}/download?path=%2F&files=captions.json`
  try {
    const res = await fetch(url, { redirect: 'follow' })
    if (!res.ok) return {}
    const data = (await res.json().catch(() => null)) as unknown
    if (!data || typeof data !== 'object') return {}
    const out: Record<string, string> = {}
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      if (typeof v === 'string' && v.trim()) out[k] = v.trim()
    }
    return out
  } catch {
    return {}
  }
}

function prettifyFilename(name: string): string {
  const base = name.replace(/\.[^.]+$/, '')
  return base
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// ------------ cache -------------
let cache: { at: number; items: SharedMediaItem[] } | null = null
let inflight: Promise<SharedMediaItem[]> | null = null
const TTL_MS = 5 * 60 * 1000

export function invalidateGalleryCache(): void {
  cache = null
}

export async function getSharedMedia(): Promise<SharedMediaItem[]> {
  const cfg = parseShareUrl(process.env.NEXTCLOUD_SHARE_URL)
  if (!cfg) return []

  if (cache && Date.now() - cache.at < TTL_MS) return cache.items
  if (inflight) return inflight

  inflight = (async () => {
    try {
      const [rows, captions] = await Promise.all([webdavList(cfg), fetchCaptions(cfg)])
      // Always prefix user-facing URLs with `/index.php/...` — it works on
      // every Nextcloud setup (pretty-URL rewrites or not). `/s/...` without
      // `index.php/` 404s on installs where mod_rewrite isn't active.
      const items: SharedMediaItem[] = rows
        .filter((r) => r.name.toLowerCase() !== 'captions.json')
        .map((r) => {
          const type: 'image' | 'video' = VIDEO_MIME.test(r.mime) ? 'video' : 'image'
          const enc = encodeURIComponent(r.name)
          const fileParam = encodeURIComponent('/' + r.name)
          return {
            name: r.name,
            path: '/' + r.name,
            type,
            mime: r.mime,
            size: r.size,
            url: `${cfg.baseUrl}/index.php/s/${cfg.token}/download?path=%2F&files=${enc}`,
            thumb: `${cfg.baseUrl}/index.php/apps/files_sharing/publicpreview/${cfg.token}?file=${fileParam}&x=800&y=800&a=false`,
            large: `${cfg.baseUrl}/index.php/apps/files_sharing/publicpreview/${cfg.token}?file=${fileParam}&x=2000&y=2000&a=true`,
            alt: captions[r.name] ?? prettifyFilename(r.name),
          }
        })
      items.sort((a, b) => a.name.localeCompare(b.name))
      cache = { at: Date.now(), items }
      return items
    } finally {
      inflight = null
    }
  })()

  return inflight
}

export function logNextcloudStatus(): void {
  const cfg = parseShareUrl(process.env.NEXTCLOUD_SHARE_URL)
  if (!cfg) {
    console.info(
      '[gallery] NEXTCLOUD_SHARE_URL not set — the /api/gallery endpoint will return [] and the SPA falls back to public/gallery/.',
    )
    return
  }
  console.info(`[gallery] Nextcloud share: ${cfg.baseUrl}/s/${cfg.token} (listed lazily, cached ${TTL_MS / 1000 / 60}min)`)
}
