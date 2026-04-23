<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/layout/PageHero.vue'
import ImageGallery from '@/components/gallery/ImageGallery.vue'
import RevealOnView from '@/components/common/RevealOnView.vue'
import { galleryImages, resolveGallerySrc } from '@/content/gallery'
import { fetchRemoteGallery, type RemoteGalleryItem } from '@/services/gallery'
import { siteConfig } from '@/config/site'

const { t } = useI18n()

usePageMeta({
  title: () => t('meta.galleryTitle'),
  description: () => t('meta.galleryDesc'),
})

const remote = ref<RemoteGalleryItem[]>([])

onMounted(async () => {
  remote.value = await fetchRemoteGallery()
})

const galleryJsonLd = computed(() => {
  const year = new Date().getFullYear()
  // Prefer the remote gallery (Nextcloud) when present — so JSON-LD reflects
  // what the crawler actually sees in the rendered DOM.
  const imageList = remote.value.length
    ? remote.value
        .filter((r) => r.type === 'image')
        .map((r) => ({
          '@type': 'ImageObject',
          contentUrl: r.url,
          thumbnailUrl: r.thumb,
          name: r.alt,
          description: r.alt,
          creditText: siteConfig.name,
          copyrightNotice: `© ${year} ${siteConfig.legalName}`,
          license: siteConfig.siteUrl,
          acquireLicensePage: `${siteConfig.siteUrl}/contact`,
        }))
    : galleryImages.map((img) => ({
        '@type': 'ImageObject',
        contentUrl: resolveGallerySrc(img),
        name: img.alt,
        description: img.alt,
        creditText: siteConfig.name,
        copyrightNotice: `© ${year} ${siteConfig.legalName}`,
        license: siteConfig.siteUrl,
        acquireLicensePage: `${siteConfig.siteUrl}/contact`,
      }))

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: t('meta.galleryTitle'),
    description: t('meta.galleryDesc'),
    url: `${siteConfig.siteUrl}/gallery`,
    image: imageList,
  }
})

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
