import { useHead } from '@unhead/vue'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { siteConfig } from '@/config/site'
import { baseRouteName, mkRouteName } from '@/i18n/route-utils'

export function usePageMeta(opts: {
  title: MaybeRefOrGetter<string>
  description?: MaybeRefOrGetter<string>
}) {
  const route = useRoute()
  const router = useRouter()
  const { t, locale } = useI18n()

  const title = computed(() => toValue(opts.title))
  const description = computed(
    () => toValue(opts.description) ?? t('meta.defaultDescription'),
  )
  const fullTitle = computed(() => `${title.value} | ${siteConfig.name}`)
  const ogLocale = computed(() => (locale.value === 'mk' ? 'mk_MK' : 'en_GB'))

  const origin = computed(() => {
    if (typeof window === 'undefined') return siteConfig.siteUrl.replace(/\/$/, '')
    return import.meta.env.PROD ? siteConfig.siteUrl.replace(/\/$/, '') : window.location.origin
  })

  const canonicalPath = computed(() => route.path)

  const enPath = computed(() => {
    try {
      return router.resolve({ name: baseRouteName(route.name) }).path
    } catch {
      return '/'
    }
  })

  const mkPath = computed(() => {
    try {
      return router.resolve({ name: mkRouteName(route.name) }).path
    } catch {
      return '/mk'
    }
  })

  const canonicalHref = computed(() => `${origin.value}${canonicalPath.value}`)

  const link = computed(() => {
    const o = origin.value
    const c = canonicalHref.value
    const en = `${o}${enPath.value}`
    const mk = `${o}${mkPath.value}`
    return [
      { rel: 'canonical', href: c },
      { rel: 'alternate', hreflang: 'en', href: en },
      { rel: 'alternate', hreflang: 'mk', href: mk },
      { rel: 'alternate', hreflang: 'x-default', href: en },
    ]
  })

  const metaEntries = computed(() => {
    const list: { name?: string; property?: string; content: string }[] = [
      { name: 'description', content: description.value },
      { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' },
      { property: 'og:title', content: fullTitle.value },
      { property: 'og:description', content: description.value },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonicalHref.value },
      { property: 'og:site_name', content: siteConfig.name },
      { property: 'og:locale', content: ogLocale.value },
      { property: 'og:locale:alternate', content: ogLocale.value === 'mk_MK' ? 'en_GB' : 'mk_MK' },
      { name: 'twitter:title', content: fullTitle.value },
      { name: 'twitter:description', content: description.value },
    ]
    if (siteConfig.defaultOgImage) {
      list.push(
        { property: 'og:image', content: siteConfig.defaultOgImage },
        { property: 'og:image:alt', content: `${siteConfig.name} — Paragliding in Macedonia` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: siteConfig.defaultOgImage },
      )
    } else {
      list.push({ name: 'twitter:card', content: 'summary' })
    }
    return list
  })

  const scriptEntries = computed(() => [
    {
      key: 'jsonld-webpage',
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${canonicalHref.value}#webpage`,
        url: canonicalHref.value,
        name: fullTitle.value,
        description: description.value,
        inLanguage: locale.value === 'mk' ? 'mk' : 'en',
        isPartOf: { '@id': `${origin.value}/#website` },
        about: [
          { '@type': 'Thing', name: 'Paragliding in Macedonia' },
          { '@type': 'Thing', name: 'Tandem paragliding' },
          { '@type': 'Thing', name: 'XC guiding' },
        ],
      }),
    },
  ])

  useHead({
    title: fullTitle,
    htmlAttrs: {
      lang: computed(() => locale.value),
    },
    meta: metaEntries,
    link,
    script: scriptEntries,
  })
}
