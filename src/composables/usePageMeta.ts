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
      { property: 'og:title', content: fullTitle.value },
      { property: 'og:description', content: description.value },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonicalHref.value },
      { property: 'og:site_name', content: siteConfig.name },
      { property: 'og:locale', content: ogLocale.value },
    ]
    if (siteConfig.defaultOgImage) {
      list.push(
        { property: 'og:image', content: siteConfig.defaultOgImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: siteConfig.defaultOgImage },
      )
    } else {
      list.push({ name: 'twitter:card', content: 'summary' })
    }
    return list
  })

  useHead({
    title: fullTitle,
    htmlAttrs: {
      lang: computed(() => locale.value),
    },
    meta: metaEntries,
    link,
  })
}
