<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import FloatingSocial from '@/components/layout/FloatingSocial.vue'
import { useSiteWideJsonLd } from '@/composables/useStructuredData'

useSiteWideJsonLd()
const route = useRoute()
</script>

<template>
  <v-app>
    <AppHeader />
    <v-main class="d-flex flex-column flex-grow-1">
      <RouterView v-slot="{ Component }">
        <Transition name="pg-page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </v-main>
    <AppFooter />
    <FloatingSocial />
  </v-app>
</template>
