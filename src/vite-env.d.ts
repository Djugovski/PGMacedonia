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

/** Injected by Vite at build time — current package.json version. */
declare const __APP_VERSION__: string
/** Injected by Vite at build time — ISO timestamp of the build. */
declare const __APP_BUILD_TIME__: string
