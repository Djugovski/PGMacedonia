<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import { siteConfig } from '@/config/site'
import { useLocalizedNames } from '@/composables/useLocalizedNames'

const { t } = useI18n()
const { ln } = useLocalizedNames()

usePageMeta({
  title: () => t('meta.tandemOhridTitle'),
  description: () => t('meta.tandemOhridDesc'),
})

const tiers = computed(() => [
  {
    name: t('tandemOhrid.earlyName'),
    price: t('tandemOhrid.earlyPrice'),
    note: t('tandemOhrid.earlyNote'),
    booking: { name: ln('booking-tandem'), query: { program: 'early' } },
  },
  {
    name: t('tandemOhrid.expName'),
    price: t('tandemOhrid.expPrice'),
    note: t('tandemOhrid.expNote'),
    booking: { name: ln('booking-tandem'), query: { program: 'experience' } },
  },
  {
    name: t('tandemOhrid.xcName'),
    price: t('tandemOhrid.xcPrice'),
    note: t('tandemOhrid.xcNote'),
    booking: { name: ln('booking-tandem'), query: { program: 'xc' } },
  },
])
</script>

<template>
  <div>
    <PageHero :title="t('tandemOhrid.heroTitle')" :subtitle="t('tandemOhrid.heroSubtitle')" />
    <v-container class="py-10">
      <p class="text-body-1 mb-8" style="max-width: 48rem">
        {{ t('tandemOhrid.intro') }}
      </p>
      <v-row>
        <v-col v-for="tier in tiers" :key="tier.name" cols="12" md="4">
          <v-card class="h-100 d-flex flex-column" elevation="2">
            <v-card-title class="text-h6">{{ tier.name }}</v-card-title>
            <v-card-subtitle class="text-h6 text-primary">{{ tier.price }}</v-card-subtitle>
            <v-card-text class="flex-grow-1 text-body-2">{{ tier.note }}</v-card-text>
            <v-card-actions>
              <v-btn :to="tier.booking" color="primary" block>{{ t('tandemOhrid.bookEnquire') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <p class="text-caption text-medium-emphasis mt-6">
        {{ t('tandemOhrid.meeting') }}
        <a href="https://maps.app.goo.gl/gu7TNSGnaKNSuykZ9" target="_blank" rel="noopener">Voena plaza</a>
      </p>
      <div class="d-flex flex-wrap ga-3 mt-6">
        <v-btn :href="siteConfig.whatsappUrl" target="_blank" rel="noopener" color="secondary" variant="flat">
          WhatsApp
        </v-btn>
        <v-btn href="https://www.facebook.com/HeliXCParagliding" target="_blank" rel="noopener" variant="outlined">
          Facebook
        </v-btn>
      </div>
    </v-container>
  </div>
</template>
