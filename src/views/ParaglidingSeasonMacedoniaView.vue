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
  title: () => t('meta.paraglidingSeasonTitle'),
  description: () => t('meta.paraglidingSeasonDesc'),
})

useHead({
  script: [
    {
      key: 'jsonld-breadcrumb-paragliding-season',
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
            name: 'Paragliding season in Macedonia',
            item: `${siteConfig.siteUrl}/paragliding-season-macedonia`,
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <div>
    <PageHero :title="t('seoSeason.title')" :subtitle="t('seoSeason.lead')" />
    <v-container class="py-10">
      <v-row>
        <v-col cols="12" md="8">
          <h2 class="text-h5 font-weight-bold mb-3">{{ t('seoSeason.whenTitle') }}</h2>
          <p class="text-body-1 mb-4">{{ t('seoSeason.p1') }}</p>
          <p class="text-body-1 mb-6">{{ t('seoSeason.p2') }}</p>

          <h3 class="text-h6 mb-2">{{ t('seoSeason.monthsTitle') }}</h3>
          <ul class="text-body-1 mb-6">
            <li>{{ t('seoSeason.month1') }}</li>
            <li>{{ t('seoSeason.month2') }}</li>
            <li>{{ t('seoSeason.month3') }}</li>
            <li>{{ t('seoSeason.month4') }}</li>
          </ul>

          <div class="d-flex flex-wrap ga-3">
            <v-btn :to="{ name: ln('tandem') }" color="primary">{{ t('seoSeason.ctaTandem') }}</v-btn>
            <v-btn :to="{ name: ln('guiding') }" variant="outlined" color="primary">{{ t('seoSeason.ctaGuiding') }}</v-btn>
            <v-btn :to="{ name: ln('contact') }" variant="tonal" color="primary">{{ t('seoSeason.ctaContact') }}</v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-4" elevation="2" rounded="lg">
            <h3 class="text-h6 mb-2">{{ t('seoSeason.tipTitle') }}</h3>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ t('seoSeason.tipText') }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
