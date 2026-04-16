<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import ContactForm from '@/components/forms/ContactForm.vue'

const { t } = useI18n()

usePageMeta({
  title: () => t('meta.bookingGuidingTitle'),
  description: () => t('meta.guidingDesc'),
})
</script>

<template>
  <div>
    <PageHero :title="t('bookingGuiding.heroTitle')" :subtitle="t('bookingGuiding.heroSubtitle')" />
    <v-container class="py-10" style="max-width: 560px">
      <ContactForm kind="guiding" :submit-label="t('forms.sendEnquiry')" />
    </v-container>
  </div>
</template>
