/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_API_URL?: string
  /** If the SPA is hosted separately from the API, set full origin e.g. https://api.pgmacedonia.mk */
  readonly VITE_API_URL?: string
  readonly VITE_GALLERY_BASE_URL?: string
  /** Absolute URL to a hero or logo image for Open Graph / structured data */
  readonly VITE_OG_IMAGE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
