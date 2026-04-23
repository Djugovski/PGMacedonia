import { siteConfig } from '@/config/site'

export interface GalleryImage {
  /**
   * Path or full URL. If it starts with http(s) or /, it is used as-is;
   * otherwise it is joined with `siteConfig.galleryBaseUrl`.
   */
  src: string
  alt: string
  /** Optional smaller image for the grid; same resolution rules as `src`. */
  thumb?: string
}

/**
 * Gallery photos are served straight from the site's `public/gallery/` folder.
 * This keeps the images on the same origin as the SPA (fast, cacheable,
 * no cross-origin issues, and survives any future WordPress migration).
 *
 * To add more images, drop them into `public/gallery/` and list them here.
 */
export const galleryImages: GalleryImage[] = [
  { src: '/gallery/01.jpg', alt: 'Tandem paragliding flight over Krushevo — PG Macedonia' },
  { src: '/gallery/02.jpg', alt: 'Tandem paragliding above Lake Ohrid — PG Macedonia' },
  { src: '/gallery/03.jpg', alt: 'Paragliding take-off near Krushevo, North Macedonia' },
  { src: '/gallery/04.jpg', alt: 'Paragliding passenger and pilot in flight — Macedonia' },
  { src: '/gallery/05.jpg', alt: 'Cross-country paragliding view over Macedonian landscape' },
  { src: '/gallery/06.jpg', alt: 'Paraglider soaring above mountains — PG Macedonia' },
  { src: '/gallery/07.JPG', alt: 'Ohrid tandem flight — Early Bird package' },
  { src: '/gallery/08.JPG', alt: 'Ohrid tandem flight — Experience package' },
  { src: '/gallery/09.JPG', alt: 'Ohrid cross-country tandem flight' },
]

export function resolveGallerySrc(item: GalleryImage): string {
  if (item.src.startsWith('http') || item.src.startsWith('/')) return item.src
  return `${siteConfig.galleryBaseUrl}/${item.src.replace(/^\//, '')}`
}

/** Home teaser strip: first N images in canonical gallery order. */
export const HOME_GALLERY_PREVIEW_LIMIT = 9 as const

export function galleryImagesForHomePreview(): GalleryImage[] {
  return galleryImages.slice(0, HOME_GALLERY_PREVIEW_LIMIT)
}
