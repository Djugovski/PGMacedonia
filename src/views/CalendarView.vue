<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import MonthCalendar from '@/components/calendar/MonthCalendar.vue'
import CalendarReservationForm from '@/components/calendar/CalendarReservationForm.vue'
import { siteConfig } from '@/config/site'

const { t } = useI18n()

usePageMeta({
  title: () => t('meta.calendarTitle'),
  description: () => t('meta.calendarDesc'),
})

const range = ref<{ start: string | null; end: string | null }>({ start: null, end: null })
const snack = ref({ show: false, text: '', color: 'warning' })

function onInvalidRange() {
  snack.value = { show: true, text: t('calendar.overlapError'), color: 'warning' }
}
</script>

<template>
  <div>
    <PageHero :title="t('calendar.heroTitle')" :subtitle="t('calendar.heroSubtitle')" />
    <v-container class="py-10">
      <v-row>
        <v-col cols="12" lg="7">
          <v-card elevation="2" class="pa-4">
            <MonthCalendar v-model="range" @invalid-range="onInvalidRange" />
          </v-card>
        </v-col>
        <v-col cols="12" lg="5">
          <v-card elevation="2" class="pa-4">
            <h2 class="text-h6 mb-2">{{ t('calendar.formTitle') }}</h2>
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{ t('calendar.formLead') }}
            </p>
            <CalendarReservationForm :start="range.start" :end="range.end" />
          </v-card>
          <v-divider class="my-8" />
          <h2 class="text-h6 mb-2">{{ t('calendar.payTitle') }}</h2>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ t('calendar.payText') }}
          </p>
          <v-btn :href="siteConfig.stripePayUrl" target="_blank" rel="noopener" color="primary" size="large" block>
            {{ t('calendar.payBtn') }}
          </v-btn>
          <v-divider class="my-8" />
          <h2 class="text-h6 mb-2">{{ t('calendar.phoneTitle') }}</h2>
          <v-btn :href="`tel:${siteConfig.phoneTel}`" variant="outlined" size="large" block>{{
            siteConfig.phone
          }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snack.show" :color="snack.color" timeout="5000">
      {{ snack.text }}
    </v-snackbar>
  </div>
</template>
