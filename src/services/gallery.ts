/**
 * Talks to the Node API's `GET /api/gallery` endpoint. The server reads a
 * Nextcloud public share (configured via `NEXTCLOUD_SHARE_URL`) and returns
 * a cached list of media items with direct anonymous download / preview URLs.
 *
 * Adding photos or videos to that Nextcloud folder makes them appear on the
 * live site within ~5 minutes (cache TTL), no redeploy required.
 *
 * If the API is unreachable, or the share isn't configured, or the listing
 * is empty, the caller falls back to the bundled images in `public/gallery/`
 * so the site never displays an empty gallery.
 */
export interface RemoteGalleryItem {
  name: string
  path: string
  type: 'image' | 'video'
  mime: string
  size: number
  /** Direct download of the original (for <video> playback and "view full-size"). */
  url: string
  /** ~800px preview, good for grid thumbnails. */
  thumb: string
  /** ~2000px preview, good for the lightbox. */
  large: string
  /** Human-readable caption — derived from filename unless overridden via captions.json in the share. */
  alt: string
}

function apiBase(): string {
  return import.meta.env.VITE_API_URL?.trim()?.replace(/\/$/, '') ?? ''
}

export async function fetchRemoteGallery(): Promise<RemoteGalleryItem[]> {
  try {
    const res = await fetch(`${apiBase()}/api/gallery`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return []
    const data = (await res.json().catch(() => null)) as { items?: RemoteGalleryItem[] } | null
    return Array.isArray(data?.items) ? data!.items : []
  } catch {
    return []
  }
}
