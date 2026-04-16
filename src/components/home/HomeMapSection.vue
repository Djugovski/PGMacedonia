<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLogo from '@/components/layout/AppLogo.vue'
import RevealOnView from '@/components/common/RevealOnView.vue'
import { siteConfig } from '@/config/site'

const { t, locale } = useI18n()

const mapEmbedSrc = computed(() => {
  const q = encodeURIComponent(siteConfig.mapQuery)
  const hl = locale.value === 'mk' ? 'mk' : 'en'
  return `https://maps.google.com/maps?q=${q}&z=16&hl=${hl}&output=embed`
})

const googleMapsHref = computed(
  () =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.mapQuery)}`,
)
</script>

<template>
  <section class="home-map-section">
    <v-container class="py-14 py-md-16">
      <RevealOnView>
        <h2
          class="text-h4 font-weight-bold mb-3 pg-reveal-item text-center text-md-start"
          style="--reveal-delay: 0ms"
        >
          {{ t('home.mapTitle') }}
        </h2>
        <p
          class="text-body-1 text-medium-emphasis mb-10 pg-reveal-item mx-auto mx-md-0"
          style="max-width: 36rem; --reveal-delay: 55ms"
        >
          {{ t('home.mapLead') }}
        </p>

        <!-- No ga-* on row: flex gap + 5/7 cols exceeds 100% and forces wrap on desktop -->
        <v-row align="stretch" class="home-map-section__row">
          <v-col cols="12" md="5" class="d-flex pg-reveal-item" style="--reveal-delay: 100ms">
            <div class="home-map-section__panel pa-6 pa-md-8 rounded-xl w-100 d-flex flex-column flex-grow-1">
              <div class="mb-6">
                <AppLogo />
              </div>

              <address class="home-map-section__address text-body-1 mb-6">
                <span class="d-block text-subtitle-1 font-weight-medium mb-1">
                  {{ t('home.mapAddressLine1') }}
                </span>
                <span class="d-block mb-3">{{ t('home.mapAddressLine2') }}</span>
                <span class="d-block text-caption text-medium-emphasis">
                  {{ t('home.mapCoordsLabel') }}: {{ siteConfig.mapQuery.replace(',', ', ') }}
                </span>
              </address>

              <div class="d-flex flex-column ga-3 mt-auto">
                <a
                  :href="`tel:${siteConfig.phoneTel}`"
                  class="d-inline-flex align-center text-decoration-none text-body-1 pg-footer-link"
                >
                  <v-icon size="small" color="primary" class="me-3">mdi-phone</v-icon>
                  {{ siteConfig.phone }}
                </a>
                <a
                  :href="`mailto:${siteConfig.email}`"
                  class="d-inline-flex align-center text-decoration-none text-body-1 pg-footer-link"
                >
                  <v-icon size="small" color="primary" class="me-3">mdi-email</v-icon>
                  {{ siteConfig.email }}
                </a>
                <v-btn
                  :href="googleMapsHref"
                  target="_blank"
                  rel="noopener"
                  color="primary"
                  variant="tonal"
                  class="align-self-start mt-2"
                  prepend-icon="mdi-map-search-outline"
                >
                  {{ t('home.mapOpenExternal') }}
                </v-btn>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="7" class="d-flex ps-md-6 pg-reveal-item" style="--reveal-delay: 160ms">
            <div class="home-map-section__map rounded-xl overflow-hidden elevation-4 w-100 d-flex flex-column">
              <iframe
                class="home-map-section__iframe"
                :src="mapEmbedSrc"
                :title="t('home.mapIframeTitle')"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
              />
            </div>
          </v-col>
        </v-row>
      </RevealOnView>
    </v-container>
  </section>
</template>

<style scoped>
.home-map-section {
  background: linear-gradient(
    168deg,
    rgba(var(--v-theme-primary), 0.14) 0%,
    rgb(var(--v-theme-surface)) 42%,
    rgba(var(--v-theme-secondary), 0.1) 100%
  );
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.home-map-section__panel {
  background: rgba(var(--v-theme-surface), 0.72);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@media (prefers-reduced-motion: reduce) {
  .home-map-section__panel {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

.home-map-section__address {
  font-style: normal;
}

/* Keep one row on md+ (gap utilities on v-row were causing wrap) */
.home-map-section__row {
  flex-wrap: wrap;
}

@media (min-width: 960px) {
  .home-map-section__row {
    flex-wrap: nowrap;
  }
}

.home-map-section__map {
  min-height: 280px;
  background: rgb(var(--v-theme-surface-variant));
}

.home-map-section__iframe {
  display: block;
  width: 100%;
  min-height: 280px;
  border: 0;
}

/* md+: same row, equal column stretch — map fills remaining height */
@media (min-width: 960px) {
  .home-map-section__map {
    height: 100%;
    min-height: 420px;
  }

  .home-map-section__iframe {
    flex: 1 1 auto;
    min-height: 0;
  }
}
</style>
