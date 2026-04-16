<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import ContactForm from '@/components/forms/ContactForm.vue'
import { siteConfig } from '@/config/site'
import { useLocalizedNames } from '@/composables/useLocalizedNames'

const { t } = useI18n()
const { ln } = useLocalizedNames()

usePageMeta({
  title: () => t('meta.guidingTitle'),
  description: () => t('meta.guidingDesc'),
})
</script>

<template>
  <div>
    <PageHero :title="t('meta.guidingTitle')" :subtitle="t('guiding.whyLead')" />
    <v-container class="py-10">
      <v-row>
        <v-col cols="12" md="7">
          <h2 class="text-h5 mb-4">{{ t('guiding.whyTitle') }}</h2>
          <p class="text-body-1 mb-4">
            {{ t('guiding.whyLead') }}
          </p>
          <p class="text-body-1 mb-4">
            {{ t('guiding.whyBody') }}
          </p>
          <ul class="text-body-1 mb-6">
            <li>{{ t('guiding.bullet1') }}</li>
            <li>{{ t('guiding.bullet2') }}</li>
            <li>{{ t('guiding.bullet3') }}</li>
          </ul>
          <h3 class="text-h6 mb-2">{{ t('guiding.includesTitle') }}</h3>
          <ul class="text-body-1 mb-4">
            <li>{{ t('guiding.includes1') }}</li>
            <li>{{ t('guiding.includes2') }}</li>
            <li>{{ t('guiding.includes3') }}</li>
            <li>{{ t('guiding.includes4') }}</li>
            <li>{{ t('guiding.includes5') }}</li>
          </ul>
          <p class="text-body-2 text-medium-emphasis">
            {{ t('guiding.finePrint') }}
          </p>
          <div class="d-flex flex-wrap ga-3 mt-6">
            <v-btn :to="{ name: ln('calendar') }" color="primary">{{ t('guiding.calendarBtn') }}</v-btn>
            <v-btn :href="`tel:${siteConfig.phoneTel}`" variant="outlined"
              >{{ t('guiding.call') }} {{ siteConfig.phone }}</v-btn
            >
          </div>
        </v-col>
        <v-col cols="12" md="5">
          <v-card elevation="2" class="pa-4">
            <h3 class="text-h6 mb-4">{{ t('guiding.enquireTitle') }}</h3>
            <ContactForm kind="guiding" :submit-label="t('forms.sendEnquiry')" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
