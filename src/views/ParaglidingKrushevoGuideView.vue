<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { usePageMeta } from '@/composables/usePageMeta'
import { useFaqPageJsonLd, type FaqItem } from '@/composables/useStructuredData'
import { siteConfig } from '@/config/site'
import { useLocalizedNames } from '@/composables/useLocalizedNames'
import PageHero from '@/components/layout/PageHero.vue'

const { t, tm, rt } = useI18n()
const { ln } = useLocalizedNames()

usePageMeta({
  title: () => t('meta.paraglidingKrushevoTitle'),
  description: () => t('meta.paraglidingKrushevoDesc'),
})

useHead({
  script: [
    {
      key: 'jsonld-breadcrumb-paragliding-krusevo',
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${siteConfig.siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Paragliding in Macedonia',
            item: `${siteConfig.siteUrl}/paragliding-macedonia`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Paragliding in Krushevo',
            item: `${siteConfig.siteUrl}/paragliding-krusevo`,
          },
        ],
      }),
    },
    {
      key: 'jsonld-paragliding-krusevo-guide',
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Paragliding in Krushevo',
        areaServed: 'Krushevo, North Macedonia',
        provider: {
          '@type': 'SportsActivityLocation',
          name: siteConfig.legalName,
          url: siteConfig.siteUrl,
        },
        url: `${siteConfig.siteUrl}/paragliding-krusevo`,
        offers: {
          '@type': 'OfferCatalog',
          itemListElement: [
            {
              '@type': 'Offer',
              url: `${siteConfig.siteUrl}/tandem-krusevo`,
            },
            {
              '@type': 'Offer',
              url: `${siteConfig.siteUrl}/guiding`,
            },
          ],
        },
      }),
    },
  ],
})

const faqItems = computed(() => {
  const raw = tm('seoKrushevo.faq') as unknown
  if (!Array.isArray(raw)) return [] as FaqItem[]
  return raw.map((item) => ({
    q: rt((item as { q: string }).q as never),
    a: rt((item as { a: string }).a as never),
  }))
})

useFaqPageJsonLd(() => faqItems.value)
</script>

<template>
  <div>
    <PageHero :title="t('seoKrushevo.title')" :subtitle="t('seoKrushevo.lead')" />
    <v-container class="py-10">
      <v-row>
        <v-col cols="12" md="8">
          <h2 class="text-h5 font-weight-bold mb-3">{{ t('seoKrushevo.whyTitle') }}</h2>
          <p class="text-body-1 mb-4">{{ t('seoKrushevo.p1') }}</p>
          <p class="text-body-1 mb-6">{{ t('seoKrushevo.p2') }}</p>

          <h3 class="text-h6 mb-2">{{ t('seoKrushevo.expectTitle') }}</h3>
          <ul class="text-body-1 mb-6">
            <li>{{ t('seoKrushevo.expect1') }}</li>
            <li>{{ t('seoKrushevo.expect2') }}</li>
            <li>{{ t('seoKrushevo.expect3') }}</li>
          </ul>

          <div class="d-flex flex-wrap ga-3">
            <v-btn :to="{ name: ln('tandem-krusevo') }" color="primary">{{ t('seoKrushevo.ctaPrimary') }}</v-btn>
            <v-btn :to="{ name: ln('guiding') }" variant="outlined" color="primary">{{ t('seoKrushevo.ctaGuiding') }}</v-btn>
            <v-btn :to="{ name: ln('paragliding-ohrid') }" variant="text" color="primary">{{ t('seoKrushevo.ctaOhrid') }}</v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-4" elevation="2" rounded="lg">
            <h3 class="text-h6 mb-2">{{ t('seoKrushevo.tipTitle') }}</h3>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ t('seoKrushevo.tipText') }}</p>
          </v-card>
        </v-col>
      </v-row>

      <h3 class="text-h6 mt-10 mb-3">{{ t('seoKrushevo.faqTitle') }}</h3>
      <v-expansion-panels variant="accordion">
        <v-expansion-panel v-for="(item, i) in faqItems" :key="i">
          <v-expansion-panel-title>{{ item.q }}</v-expansion-panel-title>
          <v-expansion-panel-text>{{ item.a }}</v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </div>
</template>
