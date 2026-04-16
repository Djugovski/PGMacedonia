/**
 * Central contact & social data. Swap for CMS-driven values later without touching components.
 */
export const siteConfig = {
  name: 'PG Macedonia',
  /** Used for canonical & hreflang in production builds */
  siteUrl: 'https://pgmacedonia.mk',
  legalName: 'Helix Paragliding / PG Macedonia',
  phone: '+389 71 261 398',
  phoneTel: '+38971261398',
  email: 'contact@pgmacedonia.com',
  whatsappUrl: 'https://wa.link/79jqg7',
  facebookUrl: 'https://www.facebook.com/HeliXCParagliding',
  /** WGS84 for Google Maps links & embeds (Krushevo base) */
  mapQuery: '41.364271,21.248225',
  stripePayUrl: 'https://buy.stripe.com/aEUaFSc8mfUmctG28b',
  defaultLocale: 'en',
  /** Base for gallery images if you host on WP uploads or a CDN */
  galleryBaseUrl:
    import.meta.env.VITE_GALLERY_BASE_URL?.replace(/\/$/, '') ??
    'https://pgmacedonia.mk/wp-content/uploads',
  /** Optional absolute image URL for og:image + JSON-LD (set VITE_OG_IMAGE_URL in .env) */
  defaultOgImage: import.meta.env.VITE_OG_IMAGE_URL?.trim() || '',
} as const
