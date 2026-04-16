<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import ContactForm from '@/components/forms/ContactForm.vue'
import { siteConfig } from '@/config/site'

const { t } = useI18n()

usePageMeta({
  title: () => t('meta.contactTitle'),
  description: () => t('meta.defaultDescription'),
})
</script>

<template>
  <div>
    <PageHero :title="t('contact.heroTitle')" :subtitle="t('contact.heroSubtitle')" />
    <v-container class="py-10">
      <v-row>
        <v-col cols="12" md="5">
          <v-list lines="two" class="bg-transparent">
            <v-list-item :href="`tel:${siteConfig.phoneTel}`" :title="siteConfig.phone" :subtitle="t('contact.phone')">
              <template #prepend>
                <v-icon color="primary">mdi-phone</v-icon>
              </template>
            </v-list-item>
            <v-list-item :title="siteConfig.email" :subtitle="t('contact.email')">
              <template #prepend>
                <v-icon color="primary">mdi-email</v-icon>
              </template>
            </v-list-item>
            <v-list-item :title="'WhatsApp'" :subtitle="t('contact.whatsapp')">
              <template #prepend>
                <v-icon color="primary">mdi-whatsapp</v-icon>
              </template>
              <template #append>
                <v-btn :href="siteConfig.whatsappUrl" target="_blank" rel="noopener" variant="text">
                  {{ t('contact.whatsappOpen') }}
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-card variant="outlined" class="mt-4 pa-2">
            <v-card-text class="text-body-2">
              <a
                :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.mapQuery)}`"
                target="_blank"
                rel="noopener"
              >
                {{ t('contact.map') }}
              </a>
              {{ t('contact.mapNote') }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="7">
          <v-card elevation="2" class="pa-4">
            <h2 class="text-h6 mb-4">{{ t('contact.formHeading') }}</h2>
            <ContactForm kind="general" :submit-label="t('forms.send')" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
