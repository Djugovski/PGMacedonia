<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import { siteConfig } from '@/config/site'
import { useLocalizedNames } from '@/composables/useLocalizedNames'

const { t } = useI18n()
const { ln } = useLocalizedNames()
const router = useRouter()

function goTo(target: { name: string; query?: Record<string, string> }) {
  router.push(target)
}

usePageMeta({
  title: () => t('meta.tandemOhridTitle'),
  description: () => t('meta.tandemOhridDesc'),
})

const tiers = computed(() => [
  {
    name: t('tandemOhrid.earlyName'),
    price: t('tandemOhrid.earlyPrice'),
    note: t('tandemOhrid.earlyNote'),
    image: '/gallery/07.JPG',
    booking: { name: ln('booking-tandem'), query: { program: 'early' } },
  },
  {
    name: t('tandemOhrid.expName'),
    price: t('tandemOhrid.expPrice'),
    note: t('tandemOhrid.expNote'),
    image: '/gallery/08.JPG',
    booking: { name: ln('booking-tandem'), query: { program: 'experience' } },
  },
  {
    name: t('tandemOhrid.xcName'),
    price: t('tandemOhrid.xcPrice'),
    note: t('tandemOhrid.xcNote'),
    image: '/gallery/09.JPG',
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
            <v-img
              :src="tier.image"
              :alt="tier.name"
              height="180"
              cover
              class="tandem-tier__img"
              role="link"
              tabindex="0"
              :aria-label="tier.name"
              @click="goTo(tier.booking)"
              @keydown.enter.prevent="goTo(tier.booking)"
              @keydown.space.prevent="goTo(tier.booking)"
            />
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

<style scoped>
.tandem-tier__img {
  cursor: pointer;
  transition: transform 0.4s ease, filter 0.3s ease;
}
.tandem-tier__img:hover {
  transform: scale(1.03);
  filter: brightness(1.05);
}
.tandem-tier__img:focus-visible {
  outline: 3px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
</style>
