<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import RevealOnView from '@/components/common/RevealOnView.vue'
import { useLocalizedNames } from '@/composables/useLocalizedNames'

const { t, tm, rt } = useI18n()
const { ln } = useLocalizedNames()

usePageMeta({
  title: () => t('meta.tandemTitle'),
  description: () => t('meta.tandemDesc'),
})

/** Highlight bullets surfaced above the destination cards. */
const highlights = computed(() => {
  const raw = tm('tandem.highlights') as unknown
  if (!Array.isArray(raw)) return [] as string[]
  return raw.map((m) => rt(m as never))
})

/** Two destination cards wired to the existing tandem-ohrid / tandem-krusevo routes. */
const destinations = computed(() => [
  {
    key: 'ohrid',
    title: t('tandem.ohridTitle'),
    kicker: t('tandem.ohridKicker'),
    text: t('tandem.ohridText'),
    price: t('tandem.ohridPrice'),
    image: '/gallery/02.jpg',
    to: { name: ln('tandem-ohrid') },
    cta: t('tandem.exploreCta'),
  },
  {
    key: 'krusevo',
    title: t('tandem.krusevoTitle'),
    kicker: t('tandem.krusevoKicker'),
    text: t('tandem.krusevoText'),
    price: t('tandem.krusevoPrice'),
    image: '/gallery/01.jpg',
    to: { name: ln('tandem-krusevo') },
    cta: t('tandem.exploreCta'),
  },
])
</script>

<template>
  <div>
    <PageHero :title="t('tandem.heroTitle')" :subtitle="t('tandem.heroSubtitle')" />

    <v-container class="py-10">
      <!-- Lead / intro paragraphs -->
      <RevealOnView>
        <div class="mx-auto" style="max-width: 56rem">
          <p class="text-body-1 mb-4 pg-reveal-item" style="--reveal-delay: 0ms">
            {{ t('tandem.p1') }}
          </p>
          <p class="text-body-1 mb-4 pg-reveal-item" style="--reveal-delay: 60ms">
            {{ t('tandem.p2') }}
          </p>
          <p class="text-body-1 mb-2 pg-reveal-item" style="--reveal-delay: 120ms">
            {{ t('tandem.p3') }}
          </p>
        </div>
      </RevealOnView>

      <!-- Highlight chips -->
      <RevealOnView v-if="highlights.length" class="mt-6">
        <div class="d-flex flex-wrap justify-center ga-2">
          <v-chip
            v-for="(h, i) in highlights"
            :key="i"
            color="primary"
            variant="tonal"
            size="small"
            class="pg-reveal-item"
            :style="{ '--reveal-delay': `${i * 40}ms` }"
          >
            {{ h }}
          </v-chip>
        </div>
      </RevealOnView>

      <!-- Destination chooser -->
      <RevealOnView class="mt-12">
        <h2
          class="text-h4 font-weight-bold text-center mb-2 pg-reveal-item"
          style="--reveal-delay: 0ms"
        >
          {{ t('tandem.chooseTitle') }}
        </h2>
        <p
          class="text-body-1 text-medium-emphasis text-center mb-8 mx-auto pg-reveal-item"
          style="max-width: 40rem; --reveal-delay: 60ms"
        >
          {{ t('tandem.chooseLead') }}
        </p>

        <div class="tandem-destinations">
          <router-link
            v-for="(d, i) in destinations"
            :key="d.key"
            :to="d.to"
            class="tandem-destination pg-reveal-item"
            :style="{ '--reveal-delay': `${120 + i * 90}ms` }"
            :aria-label="`${d.title} — ${d.cta}`"
          >
            <div class="tandem-destination__media">
              <v-img :src="d.image" :alt="d.title" cover height="100%" />
              <div class="tandem-destination__scrim" />
            </div>

            <div class="tandem-destination__body">
              <div class="tandem-destination__kicker">{{ d.kicker }}</div>
              <h3 class="tandem-destination__title">{{ d.title }}</h3>
              <p class="tandem-destination__text">{{ d.text }}</p>

              <div class="tandem-destination__footer">
                <span class="tandem-destination__price">{{ d.price }}</span>
                <span class="tandem-destination__cta">
                  {{ d.cta }}
                  <v-icon size="small" class="ms-1">mdi-arrow-right</v-icon>
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </RevealOnView>

      <!-- Final note / footer-style CTA row -->
      <RevealOnView class="mt-10">
        <p class="text-caption text-medium-emphasis text-center mx-auto pg-reveal-item" style="max-width: 42rem; --reveal-delay: 0ms">
          {{ t('tandem.footnote') }}
        </p>
      </RevealOnView>
    </v-container>
  </div>
</template>

<style scoped>
.tandem-destinations {
  display: grid;
  gap: clamp(1rem, 2.5vw, 1.5rem);
  grid-template-columns: 1fr;
}

@media (min-width: 900px) {
  .tandem-destinations {
    grid-template-columns: 1fr 1fr;
  }
}

.tandem-destination {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 1rem;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-primary), 0.16);
  text-decoration: none;
  color: inherit;
  box-shadow: 0 1px 2px rgba(12, 74, 110, 0.06), 0 4px 16px rgba(12, 74, 110, 0.05);
  transition:
    transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1),
    box-shadow 0.35s ease,
    border-color 0.35s ease;
  isolation: isolate;
}

.tandem-destination:hover,
.tandem-destination:focus-visible {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(12, 74, 110, 0.14), 0 2px 6px rgba(12, 74, 110, 0.08);
  border-color: rgba(var(--v-theme-primary), 0.36);
  outline: none;
}

.tandem-destination__media {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.tandem-destination__media :deep(.v-img) {
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.tandem-destination:hover .tandem-destination__media :deep(.v-img),
.tandem-destination:focus-visible .tandem-destination__media :deep(.v-img) {
  transform: scale(1.04);
}

.tandem-destination__scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(3, 105, 161, 0) 45%,
    rgba(12, 74, 110, 0.28) 100%
  );
}

.tandem-destination__body {
  padding: 1.1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tandem-destination__kicker {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
}

.tandem-destination__title {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
  color: rgb(var(--v-theme-secondary));
}

.tandem-destination__text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.72);
}

.tandem-destination__footer {
  margin-top: 0.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.tandem-destination__price {
  font-weight: 700;
  color: rgb(var(--v-theme-accent));
}

.tandem-destination__cta {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  transition: transform 0.3s ease;
}

.tandem-destination:hover .tandem-destination__cta,
.tandem-destination:focus-visible .tandem-destination__cta {
  transform: translateX(3px);
}
</style>
