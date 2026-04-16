import { siteConfig } from '@/config/site'

export interface GalleryImage {
  /** Path or full URL. If it starts with http(s) or /, used as-is; else joined with galleryBaseUrl. */
  src: string
  alt: string
  /** Optional smaller image for grid; same resolution rules as src */
  thumb?: string
}

/** WordPress media on pgmacedonia.mk (`wp-content/uploads/…`). Override base with `VITE_GALLERY_BASE_URL` for a CDN mirror. */
const U = 'https://pgmacedonia.mk/wp-content/uploads/2025/09'

export const galleryImages: GalleryImage[] = [
  {
    src: `${U}/G0046879_1693568584857-scaled.jpg`,
    thumb: `${U}/G0046879_1693568584857-845x684.jpg`,
    alt: 'Paragliding tandem over mountains — Macedonia',
  },
  {
    src: `${U}/G0035102_1693216240404-scaled.jpg`,
    thumb: `${U}/G0035102_1693216240404-845x684.jpg`,
    alt: 'Paragliding flight with lake view',
  },
  {
    src: `${U}/G0046876_1693568545509-scaled.jpg`,
    thumb: `${U}/G0046876_1693568545509-845x684.jpg`,
    alt: 'Tandem paragliding in flight',
  },
  {
    src: `${U}/GOPR0578_1754597210123-1.jpg`,
    thumb: `${U}/GOPR0578_1754597210123-1-845x684.jpg`,
    alt: 'Tandem passenger and pilot above Ohrid region',
  },
  {
    src: `${U}/G0012960_1720617817095-scaled.jpg`,
    thumb: `${U}/G0012960_1720617817095-845x684.jpg`,
    alt: 'Paragliding near Krushevo',
  },
  {
    src: `${U}/G0050900_1688739552039-scaled.jpg`,
    thumb: `${U}/G0050900_1688739552039-845x684.jpg`,
    alt: 'Paragliding take-off and valley',
  },
  {
    src: `${U}/G0014071_1756208560060_2-scaled.jpg`,
    thumb: `${U}/G0014071_1756208560060_2-845x684.jpg`,
    alt: 'Paragliding over Macedonian landscape',
  },
  {
    src: `${U}/G0044236_1756208401616_2-scaled.jpg`,
    thumb: `${U}/G0044236_1756208401616_2-845x684.jpg`,
    alt: 'In-flight view — tandem paragliding',
  },
]

export function resolveGallerySrc(item: GalleryImage): string {
  if (item.src.startsWith('http') || item.src.startsWith('/')) return item.src
  return `${siteConfig.galleryBaseUrl}/${item.src.replace(/^\//, '')}`
}

/** Home teaser strip: first N images in canonical gallery order (add more in `galleryImages` as needed). */
export const HOME_GALLERY_PREVIEW_LIMIT = 12 as const

export function galleryImagesForHomePreview(): GalleryImage[] {
  return galleryImages.slice(0, HOME_GALLERY_PREVIEW_LIMIT)
}
