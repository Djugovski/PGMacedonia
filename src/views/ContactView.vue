<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import ContactForm from '@/components/forms/ContactForm.vue'
import { siteConfig } from '@/config/site'

const { t, locale } = useI18n()

usePageMeta({
  title: () => t('meta.contactTitle'),
  description: () => t('meta.defaultDescription'),
})

const mapEmbedSrc = computed(() => {
  const q = encodeURIComponent(siteConfig.mapQuery)
  const hl = locale.value === 'mk' ? 'mk' : 'en'
  return `https://maps.google.com/maps?q=${q}&z=16&hl=${hl}&output=embed`
})

const googleMapsHref = computed(
  () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.mapQuery)}`,
)
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
              <a :href="googleMapsHref" target="_blank" rel="noopener" class="contact-map__link">
                {{ t('contact.map') }}
              </a>
            </v-card-text>
            <div class="px-2 pb-2">
              <iframe
                class="contact-map__iframe"
                :src="mapEmbedSrc"
                :title="t('home.mapIframeTitle')"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
              />
            </div>
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

<style scoped>
.contact-map__iframe {
  display: block;
  width: 100%;
  height: 300px;
  border: 0;
  border-radius: 10px;
}

.contact-map__link {
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.68rem;
  border-radius: 999px;
  background: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.contact-map__link:hover {
  background: rgba(var(--v-theme-primary), 0.2);
}
</style>
