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
        <v-card
          class="gallery-card pg-surface-lift"
          elevation="2"
          :aria-label="item.alt"
          role="button"
          tabindex="0"
          @click="open(item)"
          @keydown.enter.prevent="open(item)"
          @keydown.space.prevent="open(item)"
        >
          <figure class="gallery-card__figure">
            <v-img
              :src="item.thumbResolved"
              :alt="item.alt"
              aspect-ratio="1.4"
              cover
              :eager="i < 3"
            >
              <template #placeholder>
                <div class="gallery-card__ph" />
              </template>
            </v-img>
            <figcaption class="sr-only">{{ item.alt }}</figcaption>
          </figure>
          <v-card-title class="text-body-2 py-2" :title="item.alt">{{ item.alt }}</v-card-title>
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
.gallery-card__figure {
  margin: 0;
}
.gallery-card__ph {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.08) 0%,
    rgba(var(--v-theme-primary), 0.02) 100%
  );
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
