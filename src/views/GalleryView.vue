<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import ImageGallery from '@/components/gallery/ImageGallery.vue'
import RevealOnView from '@/components/common/RevealOnView.vue'

const { t } = useI18n()

usePageMeta({
  title: () => t('meta.galleryTitle'),
  description: () => t('meta.galleryDesc'),
})
</script>

<template>
  <div>
    <PageHero :title="t('meta.galleryTitle')" />
    <RevealOnView>
      <div class="pg-reveal-item" style="--reveal-delay: 0ms">
        <ImageGallery />
      </div>
    </RevealOnView>
  </div>
</template>
