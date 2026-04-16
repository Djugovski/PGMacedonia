<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import { useFaqPageJsonLd, type FaqItem } from '@/composables/useStructuredData'
import PageHero from '@/components/layout/PageHero.vue'
import FaqPanel from '@/components/home/FaqPanel.vue'

const { t, tm } = useI18n()

usePageMeta({
  title: () => t('meta.faqTitle'),
  description: () => t('meta.faqDesc'),
})

useFaqPageJsonLd(() => {
  const raw = tm('faq.items') as unknown
  return Array.isArray(raw) ? (raw as FaqItem[]) : []
})
</script>

<template>
  <div>
    <PageHero :title="t('meta.faqTitle')" :subtitle="t('faq.sectionLead')" />
    <v-container class="py-10" style="max-width: 800px">
      <FaqPanel />
    </v-container>
  </div>
</template>
