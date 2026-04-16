<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import TandemBookingForm from '@/components/forms/TandemBookingForm.vue'

const { t } = useI18n()
const route = useRoute()

usePageMeta({
  title: () => t('meta.bookingTandemTitle'),
  description: () => t('meta.defaultDescription'),
})

const defaultProgram = computed(() => {
  const key = typeof route.query.program === 'string' ? route.query.program : ''
  const map: Record<string, string> = {
    early: 'Ohrid — Early Bird (65 €)',
    experience: 'Ohrid — Experience (85 €)',
    xc: 'Ohrid — Cross country (from 95 €)',
    krusevo: 'Krushevo — Standard (79 €)',
  }
  return map[key] ?? 'Ohrid — Experience (85 €)'
})
</script>

<template>
  <div>
    <PageHero :title="t('bookingTandem.heroTitle')" :subtitle="t('bookingTandem.heroSubtitle')" />
    <v-container class="py-10" style="max-width: 560px">
      <TandemBookingForm :key="defaultProgram" :default-program="defaultProgram" />
    </v-container>
  </div>
</template>
