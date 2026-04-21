<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { usePageMeta } from '@/composables/usePageMeta'
import { siteConfig } from '@/config/site'
import { useLocalizedNames } from '@/composables/useLocalizedNames'
import PageHero from '@/components/layout/PageHero.vue'

const { t } = useI18n()
const { ln } = useLocalizedNames()

usePageMeta({
  title: () => t('meta.paraglidingMacedoniaTitle'),
  description: () => t('meta.paraglidingMacedoniaDesc'),
})

useHead({
  script: [
    {
      key: 'jsonld-breadcrumb-paragliding-macedonia',
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
        ],
      }),
    },
    {
      key: 'jsonld-paragliding-macedonia',
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Paragliding services in North Macedonia',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'Service',
              name: 'Tandem paragliding in Ohrid',
              url: `${siteConfig.siteUrl}/tandem-ohrid`,
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@type': 'Service',
              name: 'Tandem paragliding in Krushevo',
              url: `${siteConfig.siteUrl}/tandem-krusevo`,
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@type': 'Service',
              name: 'XC guiding in Krushevo',
              url: `${siteConfig.siteUrl}/guiding`,
            },
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <div>
    <PageHero :title="t('seoLanding.title')" :subtitle="t('seoLanding.lead')" />

    <v-container class="py-10">
      <v-row>
        <v-col cols="12" md="8">
          <h2 class="text-h5 font-weight-bold mb-3">{{ t('seoLanding.whyTitle') }}</h2>
          <p class="text-body-1 mb-4">{{ t('seoLanding.p1') }}</p>
          <p class="text-body-1 mb-6">{{ t('seoLanding.p2') }}</p>

          <h3 class="text-h6 mb-2">{{ t('seoLanding.locationsTitle') }}</h3>
          <ul class="text-body-1 mb-6">
            <li>{{ t('seoLanding.location1') }}</li>
            <li>{{ t('seoLanding.location2') }}</li>
            <li>{{ t('seoLanding.location3') }}</li>
          </ul>

          <h3 class="text-h6 mb-2">{{ t('seoLanding.guidesTitle') }}</h3>
          <div class="d-flex flex-wrap ga-2 mb-6">
            <v-chip :to="{ name: ln('paragliding-ohrid') }" color="primary" variant="tonal" link>
              {{ t('seoLanding.guideOhrid') }}
            </v-chip>
            <v-chip :to="{ name: ln('paragliding-krusevo') }" color="primary" variant="tonal" link>
              {{ t('seoLanding.guideKrushevo') }}
            </v-chip>
            <v-chip :to="{ name: ln('paragliding-season-macedonia') }" color="primary" variant="tonal" link>
              {{ t('seoLanding.guideSeason') }}
            </v-chip>
          </div>

          <div class="d-flex flex-wrap ga-3">
            <v-btn :to="{ name: ln('tandem') }" color="primary">{{ t('seoLanding.ctaTandem') }}</v-btn>
            <v-btn :to="{ name: ln('guiding') }" variant="outlined" color="primary">{{ t('seoLanding.ctaGuiding') }}</v-btn>
            <v-btn :to="{ name: ln('contact') }" variant="tonal" color="primary">{{ t('seoLanding.ctaContact') }}</v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="4">
          <v-card elevation="2" rounded="lg" class="pa-4">
            <h3 class="text-h6 mb-3">{{ t('seoLanding.factsTitle') }}</h3>
            <v-list density="compact" class="pa-0 bg-transparent">
              <v-list-item class="px-0">
                <template #prepend><v-icon class="me-2 text-primary">mdi-weather-sunny</v-icon></template>
                <v-list-item-title>{{ t('seoLanding.fact1') }}</v-list-item-title>
              </v-list-item>
              <v-list-item class="px-0">
                <template #prepend><v-icon class="me-2 text-primary">mdi-mountain</v-icon></template>
                <v-list-item-title>{{ t('seoLanding.fact2') }}</v-list-item-title>
              </v-list-item>
              <v-list-item class="px-0">
                <template #prepend><v-icon class="me-2 text-primary">mdi-shield-check</v-icon></template>
                <v-list-item-title>{{ t('seoLanding.fact3') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
