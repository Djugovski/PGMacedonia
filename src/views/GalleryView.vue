<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import ImageGallery from '@/components/gallery/ImageGallery.vue'
import RevealOnView from '@/components/common/RevealOnView.vue'
import { galleryImages, resolveGallerySrc } from '@/content/gallery'
import { siteConfig } from '@/config/site'

const { t } = useI18n()

usePageMeta({
  title: () => t('meta.galleryTitle'),
  description: () => t('meta.galleryDesc'),
})

const galleryJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: t('meta.galleryTitle'),
  description: t('meta.galleryDesc'),
  url: `${siteConfig.siteUrl}/gallery`,
  image: galleryImages.map((img) => ({
    '@type': 'ImageObject',
    contentUrl: resolveGallerySrc(img),
    name: img.alt,
    description: img.alt,
    creditText: siteConfig.name,
    copyrightNotice: `© ${new Date().getFullYear()} ${siteConfig.legalName}`,
    license: siteConfig.siteUrl,
    acquireLicensePage: `${siteConfig.siteUrl}/contact`,
  })),
}))

useHead({
  script: [
    {
      key: 'jsonld-gallery',
      type: 'application/ld+json',
      textContent: () => JSON.stringify(galleryJsonLd.value),
    },
  ],
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
