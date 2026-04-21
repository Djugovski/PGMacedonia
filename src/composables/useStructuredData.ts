import { useHead } from '@unhead/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { siteConfig } from '@/config/site'

function absUrl(path: string) {
  const base = siteConfig.siteUrl.replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Site-wide LocalBusiness-style + WebSite JSON-LD (local / rich-result SEO).
 * Call once from App.vue; updates when locale changes.
 */
export function useSiteWideJsonLd() {
  const { t, locale } = useI18n()

  useHead({
    script: computed(() => {
      const desc = t('meta.defaultDescription')
      const sameAs = [siteConfig.facebookUrl, siteConfig.whatsappUrl].filter(Boolean)

      const business: Record<string, unknown> = {
        '@type': 'SportsActivityLocation',
        '@id': `${absUrl('/')}#business`,
        name: siteConfig.legalName,
        description: desc,
        url: siteConfig.siteUrl,
        telephone: siteConfig.phoneTel,
        email: siteConfig.email,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'MK',
          addressLocality: 'Krushevo',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 41.3642714,
          longitude: 21.2482252,
        },
        sameAs,
        priceRange: '€€',
        areaServed: [
          { '@type': 'Country', name: 'North Macedonia' },
          { '@type': 'AdministrativeArea', name: 'Ohrid' },
          { '@type': 'AdministrativeArea', name: 'Krushevo' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Paragliding services in Macedonia',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Tandem paragliding Ohrid',
                areaServed: 'Ohrid, North Macedonia',
                url: absUrl('/tandem-ohrid'),
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Tandem paragliding Krushevo',
                areaServed: 'Krushevo, North Macedonia',
                url: absUrl('/tandem-krusevo'),
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'XC guiding in Krushevo',
                areaServed: 'Krushevo, North Macedonia',
                url: absUrl('/guiding'),
              },
            },
          ],
        },
      }
      if (siteConfig.defaultOgImage) {
        business.image = siteConfig.defaultOgImage
      }

      const graph = [
        business,
        {
          '@type': 'WebSite',
          '@id': `${absUrl('/')}#website`,
          url: siteConfig.siteUrl,
          name: siteConfig.name,
          description: desc,
          inLanguage: [locale.value === 'mk' ? 'mk' : 'en'],
          publisher: { '@id': `${absUrl('/')}#business` },
        },
      ]

      return [
        {
          key: 'jsonld-site',
          type: 'application/ld+json',
          textContent: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': graph,
          }),
        },
      ]
    }),
  })
}

export type FaqItem = { q: string; a: string }

export function useFaqPageJsonLd(items: () => FaqItem[]) {
  useHead({
    script: computed(() => {
      const list = items()
      if (!list.length) return []
      const mainEntity = list.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      }))
      return [
        {
          key: 'jsonld-faq',
          type: 'application/ld+json',
          textContent: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity,
          }),
        },
      ]
    }),
  })
}
