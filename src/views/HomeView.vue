<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import HomeHero from '@/components/home/HomeHero.vue'
import OfferCards from '@/components/home/OfferCards.vue'
import HomeTeam from '@/components/home/HomeTeam.vue'
import FaqPanel from '@/components/home/FaqPanel.vue'
import HomeMapSection from '@/components/home/HomeMapSection.vue'
import RevealOnView from '@/components/common/RevealOnView.vue'
import { useLocalizedNames } from '@/composables/useLocalizedNames'

const { t } = useI18n()
const { ln } = useLocalizedNames()

usePageMeta({
  title: () => t('meta.homeTitle'),
  description: () => t('meta.defaultDescription'),
})
</script>

<template>
  <div>
    <HomeHero />
    <OfferCards />
    <HomeTeam />
    <v-container class="py-12 pb-16" tag="section">
      <RevealOnView>
        <h2
          class="text-h4 font-weight-bold text-center mb-2 pg-reveal-item"
          style="--reveal-delay: 0ms"
        >
          {{ t('faq.sectionTitle') }}
        </h2>
        <p
          class="text-body-1 text-medium-emphasis text-center mb-8 mx-auto pg-reveal-item"
          style="max-width: 40rem; --reveal-delay: 70ms"
        >
          {{ t('faq.sectionLead') }}
        </p>
        <div class="pg-reveal-item" style="max-width: 800px; margin: 0 auto; --reveal-delay: 130ms">
          <FaqPanel :limit="4" />
          <div class="text-center mt-6">
            <v-btn :to="{ name: ln('faq') }" color="primary" variant="tonal">{{ t('faq.viewAll') }}</v-btn>
          </div>
        </div>
      </RevealOnView>
    </v-container>
    <HomeMapSection />
    <v-container class="pt-0 pb-14">
      <div class="text-center">
        <v-btn :to="{ name: ln('paragliding-macedonia') }" variant="text" color="primary">
          {{ t('home.paraglidingMacedoniaLink') }}
        </v-btn>
      </div>
    </v-container>
  </div>
</template>
