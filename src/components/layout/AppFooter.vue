<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { siteConfig } from '@/config/site'
import { useLocalizedNames } from '@/composables/useLocalizedNames'

const { t } = useI18n()
const { ln } = useLocalizedNames()
</script>

<template>
  <v-footer color="surface" class="border-t mt-auto">
    <v-container class="py-8">
      <v-row>
        <v-col cols="12" md="4">
          <div class="text-h6 font-weight-bold mb-2">{{ siteConfig.name }}</div>
          <p class="text-body-2 text-medium-emphasis">
            {{ t('footer.tagline') }}
          </p>
        </v-col>
        <v-col cols="12" md="4">
          <div class="text-subtitle-1 font-weight-medium mb-2">{{ t('footer.contact') }}</div>
          <div class="d-flex flex-column ga-1 text-body-2">
            <a :href="`tel:${siteConfig.phoneTel}`" class="text-decoration-none pg-footer-link">{{ siteConfig.phone }}</a>
            <a :href="`mailto:${siteConfig.email}`" class="text-decoration-none pg-footer-link">{{ siteConfig.email }}</a>
            <a
              :href="siteConfig.whatsappUrl"
              target="_blank"
              rel="noopener"
              class="text-decoration-none pg-footer-link"
            >
              WhatsApp
            </a>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <div class="text-subtitle-1 font-weight-medium mb-2">{{ t('footer.follow') }}</div>
          <div class="d-flex ga-2 mb-3">
            <v-btn :href="siteConfig.facebookUrl" target="_blank" rel="noopener" variant="outlined" size="small">
              Facebook
            </v-btn>
            <v-btn :to="{ name: ln('contact') }" variant="flat" color="primary" size="small">{{
              t('nav.contact')
            }}</v-btn>
          </div>
          <div class="d-flex flex-column ga-1 text-body-2">
            <router-link :to="{ name: ln('paragliding-macedonia') }" class="text-decoration-none pg-footer-link">
              {{ t('footer.paraglidingMacedonia') }}
            </router-link>
            <router-link :to="{ name: ln('paragliding-ohrid') }" class="text-decoration-none pg-footer-link">
              {{ t('footer.paraglidingOhrid') }}
            </router-link>
            <router-link :to="{ name: ln('paragliding-krusevo') }" class="text-decoration-none pg-footer-link">
              {{ t('footer.paraglidingKrushevo') }}
            </router-link>
            <router-link :to="{ name: ln('paragliding-season-macedonia') }" class="text-decoration-none pg-footer-link">
              {{ t('footer.paraglidingSeason') }}
            </router-link>
            <router-link :to="{ name: ln('tandem') }" class="text-decoration-none pg-footer-link">
              {{ t('nav.tandem') }}
            </router-link>
            <router-link :to="{ name: ln('guiding') }" class="text-decoration-none pg-footer-link">
              {{ t('nav.guiding') }}
            </router-link>
          </div>
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <div class="text-caption text-medium-emphasis text-center pg-footer-copyright">
        <div>
          © {{ new Date().getFullYear() }} {{ siteConfig.name }}. {{ t('footer.rights') }}
        </div>
        <div class="mt-1">
          {{ t('footer.legal', { name: siteConfig.legalName }) }}
        </div>
        <div class="mt-1">
          {{ t('footer.imageryCredit', { name: siteConfig.name }) }}
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
.pg-footer-copyright {
  line-height: 1.55;
}
</style>
