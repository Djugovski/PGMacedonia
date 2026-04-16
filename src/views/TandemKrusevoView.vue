<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import { useLocalizedNames } from '@/composables/useLocalizedNames'

const { t } = useI18n()
const { ln } = useLocalizedNames()

usePageMeta({
  title: () => t('meta.tandemKrusevoTitle'),
  description: () => t('meta.tandemKrusevoDesc'),
})
</script>

<template>
  <div>
    <PageHero :title="t('tandemKrusevo.heroTitle')" :subtitle="t('tandemKrusevo.heroSubtitle')" />
    <v-container class="py-10">
      <v-row>
        <v-col cols="12" md="8">
          <p class="text-body-1 mb-4">
            {{ t('tandemKrusevo.p1') }}
          </p>
          <p class="text-body-1 mb-4">
            {{ t('tandemKrusevo.p2') }}
          </p>
          <p class="text-body-2 text-medium-emphasis mb-6">
            {{ t('tandemKrusevo.p3') }}
          </p>
          <v-alert type="info" variant="tonal" density="comfortable" class="mb-6">
            {{ t('tandemKrusevo.alert') }}
          </v-alert>
          <v-btn :to="{ name: ln('booking-tandem'), query: { program: 'krusevo' } }" color="primary" size="large">
            {{ t('tandemKrusevo.bookBtn') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
