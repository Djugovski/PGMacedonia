<script setup lang="ts">
import { computed, ref } from 'vue'
import { galleryImages, resolveGallerySrc } from '@/content/gallery'
import GalleryLightbox from '@/components/gallery/GalleryLightbox.vue'

const items = computed(() =>
  galleryImages.map((img) => ({
    ...img,
    resolved: resolveGallerySrc(img),
    thumbResolved: img.thumb
      ? img.thumb.startsWith('http')
        ? img.thumb
        : resolveGallerySrc({ ...img, src: img.thumb })
      : resolveGallerySrc(img),
  })),
)

const dialog = ref(false)
const lightboxStart = ref(0)

function open(item: (typeof items.value)[0]) {
  const idx = items.value.indexOf(item)
  lightboxStart.value = idx >= 0 ? idx : 0
  dialog.value = true
}
</script>

<template>
  <v-container>
    <p v-if="items.length === 0" class="text-medium-emphasis">{{ $t('gallery.empty') }}</p>
    <v-row v-else>
      <v-col v-for="(item, i) in items" :key="i" cols="12" sm="6" md="4">
        <v-card class="gallery-card pg-surface-lift" elevation="2" @click="open(item)">
          <v-img :src="item.thumbResolved" :alt="item.alt" aspect-ratio="1.4" cover />
          <v-card-title class="text-body-2 py-2">{{ item.alt }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <GalleryLightbox v-model="dialog" :items="items" :start-index="lightboxStart" />
  </v-container>
</template>

<style scoped>
.gallery-card {
  cursor: pointer;
}
</style>
