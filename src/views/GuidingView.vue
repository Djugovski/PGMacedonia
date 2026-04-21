<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import RevealOnView from '@/components/common/RevealOnView.vue'
import ContactForm from '@/components/forms/ContactForm.vue'
import MonthCalendar from '@/components/calendar/MonthCalendar.vue'
import CalendarReservationForm from '@/components/calendar/CalendarReservationForm.vue'
import { siteConfig } from '@/config/site'

const { t } = useI18n()

usePageMeta({
  title: () => t('meta.guidingTitle'),
  description: () => t('meta.guidingDesc'),
})

const range = ref<{ start: string | null; end: string | null }>({ start: null, end: null })
const snack = ref({ show: false, text: '', color: 'warning' })

function onInvalidRange() {
  snack.value = { show: true, text: t('calendar.overlapError'), color: 'warning' }
}

function scrollToCalendar() {
  const el = document.getElementById('calendar')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToEnquire() {
  const el = document.getElementById('enquire')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Reasons to fly in Krushevo — renders as feature cards. */
const whyBullets = [
  { icon: 'mdi-weather-partly-cloudy', key: 'guiding.bullet1' },
  { icon: 'mdi-shield-check', key: 'guiding.bullet2' },
  { icon: 'mdi-map-marker-path', key: 'guiding.bullet3' },
] as const

const VILLA_MARIJA_FB = 'https://www.facebook.com/vilamarijakrushevo'

const whereSites = [
  { icon: 'mdi-flag', key: 'guiding.where1' },
  { icon: 'mdi-mountain', key: 'guiding.where2' },
  { icon: 'mdi-pine-tree', key: 'guiding.where3' },
  { icon: 'mdi-waves', key: 'guiding.where4' },
] as const

const needItems = [
  { icon: 'mdi-parachute', key: 'guiding.need1' },
  { icon: 'mdi-hospital-box', key: 'guiding.need2' },
  { icon: 'mdi-radio-handheld', key: 'guiding.need3' },
] as const

const priceFacts = [
  { icon: 'mdi-calendar-range', value: 'guiding.priceDuration', label: 'guiding.priceDurationLabel' },
  { icon: 'mdi-currency-eur', value: 'guiding.pricePrice', label: 'guiding.pricePriceLabel' },
  { icon: 'mdi-account-group', value: 'guiding.priceGroup', label: 'guiding.priceGroupLabel' },
] as const

const afterItems = [
  { icon: 'mdi-silverware-fork-knife', key: 'guiding.afterFood' },
  { icon: 'mdi-coffee', key: 'guiding.afterCafe' },
  { icon: 'mdi-castle', key: 'guiding.afterCulture' },
] as const
</script>

<template>
  <div>
    <PageHero :title="t('meta.guidingTitle')" :subtitle="t('guiding.heroSubtitle')" />

    <v-container class="py-10">
      <!-- Why Krushevo -->
      <RevealOnView>
        <div class="mx-auto text-center" style="max-width: 54rem">
          <h2 class="text-h4 font-weight-bold mb-2 pg-reveal-item" style="--reveal-delay: 0ms">
            {{ t('guiding.whyTitle') }}
          </h2>
          <p class="text-body-1 mb-3 pg-reveal-item" style="--reveal-delay: 60ms">
            {{ t('guiding.whyLead') }}
          </p>
          <p class="text-body-1 text-medium-emphasis pg-reveal-item" style="--reveal-delay: 120ms">
            {{ t('guiding.whyBody') }}
          </p>
        </div>

        <v-row class="mt-6">
          <v-col
            v-for="(b, i) in whyBullets"
            :key="b.key"
            cols="12"
            md="4"
            class="pg-reveal-item"
            :style="{ '--reveal-delay': `${180 + i * 80}ms` }"
          >
            <v-card class="h-100 pa-5 d-flex flex-column align-start pg-surface-lift" elevation="1" rounded="lg">
              <v-icon :icon="b.icon" size="32" class="mb-3 text-primary" />
              <p class="text-body-1 font-weight-medium mb-0">{{ t(b.key) }}</p>
            </v-card>
          </v-col>
        </v-row>

        <div
          class="d-flex flex-wrap justify-center ga-3 mt-6 pg-reveal-item"
          style="--reveal-delay: 420ms"
        >
          <v-btn color="primary" size="large" @click="scrollToCalendar">
            <v-icon start>mdi-calendar-check</v-icon>
            {{ t('guiding.calendarBtn') }}
          </v-btn>
          <v-btn variant="outlined" color="primary" size="large" @click="scrollToEnquire">
            <v-icon start>mdi-email-outline</v-icon>
            {{ t('guiding.enquireBtn') }}
          </v-btn>
        </div>
      </RevealOnView>

      <!-- Where we fly -->
      <RevealOnView class="mt-14">
        <h2 class="text-h5 font-weight-bold mb-2 pg-reveal-item" style="--reveal-delay: 0ms">
          {{ t('guiding.whereTitle') }}
        </h2>
        <p class="text-body-1 text-medium-emphasis mb-4 pg-reveal-item" style="--reveal-delay: 60ms">
          {{ t('guiding.whereLead') }}
        </p>
        <v-row>
          <v-col
            v-for="(s, i) in whereSites"
            :key="s.key"
            cols="12"
            sm="6"
            md="3"
            class="pg-reveal-item"
            :style="{ '--reveal-delay': `${120 + i * 60}ms` }"
          >
            <div class="guiding-site pg-surface-lift">
              <v-icon :icon="s.icon" size="28" class="text-primary mb-2" />
              <p class="text-body-2 mb-0">{{ t(s.key) }}</p>
            </div>
          </v-col>
        </v-row>
      </RevealOnView>

      <!-- Includes + Need side-by-side -->
      <RevealOnView class="mt-14">
        <v-row>
          <v-col cols="12" md="6" class="pg-reveal-item" style="--reveal-delay: 0ms">
            <v-card class="h-100 pa-5" elevation="1" rounded="lg">
              <h3 class="text-h6 mb-4 d-flex align-center">
                <v-icon start class="text-primary">mdi-check-circle</v-icon>
                {{ t('guiding.includesTitle') }}
              </h3>
              <v-list density="compact" class="pa-0 bg-transparent">
                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon icon="mdi-bed" size="20" class="text-primary me-2" />
                  </template>
                  <v-list-item-title class="text-body-2 text-wrap">
                    {{ t('guiding.includes1') }}
                    <a
                      :href="VILLA_MARIJA_FB"
                      target="_blank"
                      rel="noopener"
                      class="guiding-villa-link"
                    >
                      <v-icon size="16" class="me-1">mdi-facebook</v-icon>{{ t('guiding.villaFbLabel') }}
                    </a>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" class="pg-reveal-item" style="--reveal-delay: 120ms">
            <v-card class="h-100 pa-5" elevation="1" rounded="lg">
              <h3 class="text-h6 mb-4 d-flex align-center">
                <v-icon start class="text-primary">mdi-bag-personal</v-icon>
                {{ t('guiding.needTitle') }}
              </h3>
              <v-list density="compact" class="pa-0 bg-transparent">
                <v-list-item v-for="n in needItems" :key="n.key" class="px-0">
                  <template #prepend>
                    <v-icon :icon="n.icon" size="20" class="text-primary me-2" />
                  </template>
                  <v-list-item-title class="text-body-2 text-wrap">{{ t(n.key) }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </RevealOnView>

      <!-- Package at a glance -->
      <RevealOnView class="mt-14">
        <div class="guiding-price">
          <h2 class="text-h5 font-weight-bold text-white mb-4 pg-reveal-item" style="--reveal-delay: 0ms">
            {{ t('guiding.priceTitle') }}
          </h2>
          <div class="guiding-price__grid">
            <div
              v-for="(f, i) in priceFacts"
              :key="f.value"
              class="guiding-price__fact pg-reveal-item"
              :style="{ '--reveal-delay': `${80 + i * 80}ms` }"
            >
              <v-icon :icon="f.icon" size="28" class="text-white mb-2" />
              <div class="guiding-price__value">{{ t(f.value) }}</div>
              <div class="guiding-price__label">{{ t(f.label) }}</div>
            </div>
          </div>
          <p class="text-body-2 text-white mt-4 mb-0 pg-reveal-item" style="--reveal-delay: 360ms; opacity: 0.85">
            {{ t('guiding.priceNote') }}
          </p>
        </div>
      </RevealOnView>

      <!-- Beyond the sky — Krushevo as a holiday destination -->
      <RevealOnView class="mt-14">
        <div class="mx-auto text-center" style="max-width: 54rem">
          <h2 class="text-h4 font-weight-bold mb-2 pg-reveal-item" style="--reveal-delay: 0ms">
            {{ t('guiding.afterTitle') }}
          </h2>
          <p class="text-body-1 text-medium-emphasis pg-reveal-item" style="--reveal-delay: 60ms">
            {{ t('guiding.afterLead') }}
          </p>
        </div>
        <v-row class="mt-6">
          <v-col
            v-for="(a, i) in afterItems"
            :key="a.key"
            cols="12"
            md="4"
            class="pg-reveal-item"
            :style="{ '--reveal-delay': `${120 + i * 80}ms` }"
          >
            <v-card class="h-100 pa-5 d-flex flex-column align-start pg-surface-lift" elevation="1" rounded="lg">
              <v-icon :icon="a.icon" size="32" class="mb-3 text-primary" />
              <p class="text-body-1 font-weight-medium mb-0">{{ t(a.key) }}</p>
            </v-card>
          </v-col>
        </v-row>
      </RevealOnView>
    </v-container>

    <!-- Calendar + reservation + pay/call (anchor target) -->
    <section id="calendar" class="guiding-book">
      <v-container class="py-12">
        <RevealOnView>
          <div class="text-center mx-auto mb-8" style="max-width: 48rem">
            <h2 class="text-h4 font-weight-bold mb-2 pg-reveal-item" style="--reveal-delay: 0ms">
              {{ t('guiding.bookTitle') }}
            </h2>
            <p class="text-body-1 text-medium-emphasis pg-reveal-item" style="--reveal-delay: 60ms">
              {{ t('guiding.bookLead') }}
            </p>
          </div>

          <v-row>
            <v-col cols="12" lg="7" class="pg-reveal-item" style="--reveal-delay: 120ms">
              <v-card elevation="2" class="pa-4 h-100" rounded="lg">
                <MonthCalendar v-model="range" @invalid-range="onInvalidRange" />
              </v-card>
            </v-col>

            <v-col cols="12" lg="5" class="pg-reveal-item" style="--reveal-delay: 200ms">
              <v-card elevation="2" class="pa-4" rounded="lg">
                <h3 class="text-h6 mb-2">{{ t('calendar.formTitle') }}</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ t('calendar.formLead') }}
                </p>
                <CalendarReservationForm :start="range.start" :end="range.end" />
              </v-card>

              <v-card elevation="1" class="pa-4 mt-4" rounded="lg">
                <h3 class="text-h6 mb-2 d-flex align-center">
                  <v-icon start class="text-primary">mdi-phone-outline</v-icon>
                  {{ t('calendar.phoneTitle') }}
                </h3>
                <v-btn :href="`tel:${siteConfig.phoneTel}`" variant="outlined" size="large" block>
                  {{ siteConfig.phone }}
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </RevealOnView>
      </v-container>
    </section>

    <!-- Enquire form (fallback for users who want to ask first) -->
    <v-container id="enquire" class="py-12 guiding-enquire">
      <RevealOnView>
        <div class="text-center mx-auto mb-6" style="max-width: 42rem">
          <h2 class="text-h5 font-weight-bold mb-2 pg-reveal-item" style="--reveal-delay: 0ms">
            {{ t('guiding.enquireTitle') }}
          </h2>
          <p class="text-body-2 text-medium-emphasis pg-reveal-item" style="--reveal-delay: 60ms">
            {{ t('guiding.enquireLead') }}
          </p>
        </div>
        <div class="mx-auto pg-reveal-item" style="max-width: 48rem; --reveal-delay: 120ms">
          <v-card elevation="2" class="pa-5" rounded="lg">
            <ContactForm kind="guiding" :submit-label="t('forms.sendEnquiry')" />
          </v-card>
        </div>
        <div class="text-center mt-6 pg-reveal-item" style="--reveal-delay: 200ms">
          <v-btn :href="`tel:${siteConfig.phoneTel}`" variant="outlined" size="large">
            <v-icon start>mdi-phone</v-icon>
            {{ t('guiding.call') }} {{ siteConfig.phone }}
          </v-btn>
        </div>
      </RevealOnView>
    </v-container>

    <v-snackbar v-model="snack.show" :color="snack.color" timeout="5000">
      {{ snack.text }}
    </v-snackbar>
  </div>
</template>

<style scoped>
/* Small square tile for a flying site */
.guiding-site {
  height: 100%;
  padding: 1rem 1.1rem;
  border-radius: 0.9rem;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-primary), 0.16);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}
.guiding-site:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--v-theme-primary), 0.32);
  box-shadow: 0 6px 18px rgba(12, 74, 110, 0.1);
}

/* Price band — reuses primary → secondary gradient as a highlight */
.guiding-price {
  border-radius: 1rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );
  color: #fff;
  box-shadow: 0 8px 24px rgba(12, 74, 110, 0.18);
}

.guiding-price__grid {
  display: grid;
  gap: clamp(0.75rem, 2vw, 1.25rem);
  grid-template-columns: 1fr;
}
@media (min-width: 720px) {
  .guiding-price__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.guiding-price__fact {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0.8rem;
  padding: 1rem 1.1rem;
  text-align: center;
}

.guiding-price__value {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.1;
}

.guiding-price__label {
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.85;
  margin-top: 0.2rem;
}

/* Booking band: soft sky wash to separate from the rest of the page */
.guiding-enquire {
  scroll-margin-top: 80px;
}

.guiding-villa-link {
  display: inline-flex;
  align-items: center;
  margin-left: 0.4rem;
  padding: 0.12rem 0.55rem;
  border-radius: 999px;
  background: rgba(24, 119, 242, 0.12);
  color: #1877f2;
  font-weight: 600;
  font-size: 0.8rem;
  text-decoration: none;
  transition: background-color 0.2s ease;
}
.guiding-villa-link:hover {
  background: rgba(24, 119, 242, 0.2);
}

.guiding-book {
  scroll-margin-top: 80px;
  background: linear-gradient(
    180deg,
    rgba(var(--v-theme-primary), 0.08) 0%,
    rgba(var(--v-theme-primary), 0) 100%
  );
  border-top: 1px solid rgba(var(--v-theme-primary), 0.12);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.12);
}
</style>
