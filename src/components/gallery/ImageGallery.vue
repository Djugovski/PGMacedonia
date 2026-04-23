<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { useDisplay } from 'vuetify'
import { galleryImages, resolveGallerySrc } from '@/content/gallery'
import { fetchRemoteGallery, type RemoteGalleryItem } from '@/services/gallery'
import GalleryLightbox, {
  type GalleryLightboxItem,
} from '@/components/gallery/GalleryLightbox.vue'

interface DisplayItem extends GalleryLightboxItem {
  alt: string
  thumbResolved: string
}

const remote = ref<RemoteGalleryItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    remote.value = await fetchRemoteGallery()
  } finally {
    loading.value = false
  }
})

const items = computed<DisplayItem[]>(() => {
  if (remote.value.length) {
    return remote.value.map((r) => ({
      type: r.type,
      resolved: r.large,
      downloadUrl: r.url,
      mime: r.mime,
      thumbResolved: r.thumb,
      alt: r.alt,
    }))
  }
  return galleryImages.map((img) => ({
    type: 'image' as const,
    resolved: resolveGallerySrc(img),
    downloadUrl: resolveGallerySrc(img),
    thumbResolved: img.thumb
      ? img.thumb.startsWith('http')
        ? img.thumb
        : resolveGallerySrc({ ...img, src: img.thumb })
      : resolveGallerySrc(img),
    alt: img.alt,
  }))
})

/* --- Pagination ---------------------------------------------------- */
const { smAndUp, mdAndUp } = useDisplay()
const pageSize = computed(() => {
  // Desktop / large tablets: 3 × 7 = 21 photos per page.
  // Tablets in 2-col: 2 × 8 = 16 photos per page.
  // Mobile (1-col): 12 per page — scroll is short and "Next" is just a tap.
  if (mdAndUp.value) return 21
  if (smAndUp.value) return 16
  return 12
})

const currentPage = ref(1)
const pageCount = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize.value)))

// Clamp the current page whenever the source set or page size changes.
watch([items, pageSize], () => {
  if (currentPage.value > pageCount.value) currentPage.value = pageCount.value
})

const pagedItems = computed<DisplayItem[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return items.value.slice(start, start + pageSize.value)
})

const pagedRange = computed(() => {
  if (!items.value.length) return { from: 0, to: 0, total: 0 }
  const from = (currentPage.value - 1) * pageSize.value + 1
  const to = Math.min(currentPage.value * pageSize.value, items.value.length)
  return { from, to, total: items.value.length }
})

const galleryTop = ref<HTMLElement | null>(null)
async function onPageChange(n: number) {
  currentPage.value = n
  await nextTick()
  galleryTop.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* --- Lightbox ------------------------------------------------------ */
const dialog = ref(false)
const lightboxStart = ref(0)

function open(pagedIndex: number) {
  // Convert page-local index → global index so lightbox navigation works
  // across pages (arrow keys keep going past the visible 21).
  lightboxStart.value = (currentPage.value - 1) * pageSize.value + pagedIndex
  dialog.value = true
}
</script>

<template>
  <v-container>
    <div ref="galleryTop" class="gallery-top-anchor" aria-hidden="true"></div>
    <p v-if="loading && !items.length" class="text-medium-emphasis">
      {{ $t('gallery.loading') }}
    </p>
    <p v-else-if="!items.length" class="text-medium-emphasis">{{ $t('gallery.empty') }}</p>
    <template v-else>
      <v-row>
        <v-col v-for="(item, i) in pagedItems" :key="currentPage + '-' + i" cols="12" sm="6" md="4">
          <v-card
            class="gallery-card pg-surface-lift"
            elevation="2"
            :aria-label="item.alt"
            role="button"
            tabindex="0"
            @click="open(i)"
            @keydown.enter.prevent="open(i)"
            @keydown.space.prevent="open(i)"
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
              <div v-if="item.type === 'video'" class="gallery-card__play" aria-hidden="true">
                <v-icon size="48" color="white">mdi-play-circle</v-icon>
              </div>
            </figure>
            <v-card-title class="text-body-2 py-2" :title="item.alt">{{ item.alt }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>

      <div v-if="pageCount > 1" class="gallery-pager d-flex flex-column align-center gap-2 mt-6">
        <v-pagination
          :model-value="currentPage"
          :length="pageCount"
          :total-visible="5"
          density="comfortable"
          rounded="lg"
          aria-label="Gallery pagination"
          @update:model-value="onPageChange"
        />
        <div class="text-caption text-medium-emphasis">
          {{
            $t('gallery.rangeLabel', {
              from: pagedRange.from,
              to: pagedRange.to,
              total: pagedRange.total,
            })
          }}
        </div>
      </div>
    </template>

    <GalleryLightbox v-model="dialog" :items="items" :start-index="lightboxStart" />
  </v-container>
</template>

<style scoped>
.gallery-top-anchor {
  height: 0;
  width: 0;
  margin-top: -16px;
}
.gallery-card {
  cursor: pointer;
}
.gallery-card__figure {
  margin: 0;
  position: relative;
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
.gallery-card__play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.18);
  pointer-events: none;
  transition: background 0.2s ease;
}
.gallery-card:hover .gallery-card__play {
  background: rgba(0, 0, 0, 0.32);
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
.gallery-pager {
  gap: 4px;
}
</style>
