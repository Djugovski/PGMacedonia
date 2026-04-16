<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import HomeGalleryPreview from '@/components/home/HomeGalleryPreview.vue'
import RevealOnView from '@/components/common/RevealOnView.vue'
import { useLocalizedNames } from '@/composables/useLocalizedNames'

const { t } = useI18n()
const { ln } = useLocalizedNames()

const cards = computed(() => [
  {
    title: t('home.cardOhridTitle'),
    text: t('home.cardOhridText'),
    to: { name: ln('tandem-ohrid') },
    cta: t('home.cardCta'),
  },
  {
    title: t('home.cardKrusevoTitle'),
    text: t('home.cardKrusevoText'),
    to: { name: ln('tandem-krusevo') },
    cta: t('home.cardCta'),
  },
  {
    title: t('home.cardGuidingTitle'),
    text: t('home.cardGuidingText'),
    to: { name: ln('guiding') },
    cta: t('home.cardGuidingCta'),
  },
])
</script>

<template>
  <v-container class="py-12">
    <RevealOnView>
      <h2
        class="text-h4 font-weight-bold text-center mb-2 pg-reveal-item"
        style="--reveal-delay: 0ms"
      >
        {{ t('home.sectionTitle') }}
      </h2>
      <p
        class="text-body-1 text-medium-emphasis text-center mb-10 mx-auto pg-reveal-item"
        style="max-width: 40rem; --reveal-delay: 65ms"
      >
        {{ t('home.sectionLead') }}
      </p>
      <v-row>
      <v-col v-for="(card, i) in cards" :key="i" cols="12" md="4" class="pg-reveal-item" :style="{ '--reveal-delay': `${120 + i * 75}ms` }">
        <v-card class="h-100 d-flex flex-column pg-surface-lift" elevation="2" rounded="lg">
          <v-card-title class="text-h6">{{ card.title }}</v-card-title>
          <v-card-text class="text-body-2 flex-grow-1">{{ card.text }}</v-card-text>
          <v-card-actions>
            <v-btn :to="card.to" color="primary" variant="text">{{ card.cta }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      </v-row>
      <div class="home-offer-gallery mt-12 mt-md-14 pg-reveal-item" style="--reveal-delay: 360ms">
        <div class="home-offer-gallery__inner">
          <HomeGalleryPreview class="mb-8" />
          <div class="text-center">
            <v-btn :to="{ name: ln('gallery') }" variant="outlined" color="primary" size="large">{{
              t('home.galleryBtn')
            }}</v-btn>
          </div>
        </div>
      </div>
    </RevealOnView>
  </v-container>
</template>

<style scoped>
/* Full-bleed band so the strip reads larger; soft sky wash from theme */
.home-offer-gallery {
  width: 100vw;
  max-width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: clamp(1.5rem, 4vw, 2.75rem) clamp(0.75rem, 3.5vw, 2.5rem);
  border-radius: 1rem;
  border: 1px solid rgba(var(--v-theme-primary), 0.14);
  background: linear-gradient(
    165deg,
    rgba(var(--v-theme-primary), 0.14) 0%,
    rgba(var(--v-theme-secondary), 0.07) 42%,
    rgba(var(--v-theme-primary), 0.1) 100%
  );
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.home-offer-gallery__inner {
  max-width: min(1320px, 100%);
  margin: 0 auto;
}
</style>
