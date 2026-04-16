<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { galleryImagesForHomePreview, resolveGallerySrc } from '@/content/gallery'
import GalleryLightbox from '@/components/gallery/GalleryLightbox.vue'

const { t } = useI18n()

const items = computed(() =>
  galleryImagesForHomePreview().map((img) => ({
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

const stripRef = ref<HTMLElement | null>(null)
const canPrev = ref(false)
const canNext = ref(false)

function readScrollState() {
  const el = stripRef.value
  if (!el) {
    canPrev.value = false
    canNext.value = false
    return
  }
  const max = el.scrollWidth - el.clientWidth
  const x = el.scrollLeft
  canPrev.value = x > 2
  canNext.value = max > 2 && x < max - 2
}

function scrollStepPx(): number {
  const el = stripRef.value
  const first = el?.querySelector('.home-gallery-preview__card') as HTMLElement | null
  if (!first || !el) return 296
  const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || '16') || 16
  return first.offsetWidth + gap
}

function scrollNext() {
  const el = stripRef.value
  if (!el) return
  el.scrollBy({ left: scrollStepPx(), behavior: 'smooth' })
}

function scrollPrev() {
  const el = stripRef.value
  if (!el) return
  el.scrollBy({ left: -scrollStepPx(), behavior: 'smooth' })
}

function open(item: (typeof items.value)[0]) {
  const idx = items.value.indexOf(item)
  lightboxStart.value = idx >= 0 ? idx : 0
  dialog.value = true
}

let ro: ResizeObserver | null = null

onMounted(() => {
  const el = stripRef.value
  if (!el) return
  el.addEventListener('scroll', readScrollState, { passive: true })
  ro = new ResizeObserver(() => readScrollState())
  ro.observe(el)
  requestAnimationFrame(() => readScrollState())
})

onUnmounted(() => {
  stripRef.value?.removeEventListener('scroll', readScrollState)
  ro?.disconnect()
  ro = null
})
</script>

<template>
  <div v-if="items.length" class="home-gallery-preview">
    <div class="home-gallery-preview__frame">
      <v-btn
        class="home-gallery-preview__arrow"
        icon
        variant="tonal"
        color="primary"
        density="comfortable"
        :disabled="!canPrev"
        :aria-label="t('gallery.stripScrollPrev')"
        @click="scrollPrev"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <div ref="stripRef" class="home-gallery-preview__strip" role="region" aria-label="Gallery preview">
        <v-card
          v-for="(item, i) in items"
          :key="i"
          class="home-gallery-preview__card pg-surface-lift"
          elevation="3"
          rounded="lg"
          role="button"
          tabindex="0"
          @click="open(item)"
          @keydown.enter.prevent="open(item)"
        >
          <v-img class="home-gallery-preview__img" :src="item.thumbResolved" :alt="item.alt" cover />
        </v-card>
      </div>

      <v-btn
        class="home-gallery-preview__arrow"
        icon
        variant="tonal"
        color="primary"
        density="comfortable"
        :disabled="!canNext"
        :aria-label="t('gallery.stripScrollNext')"
        @click="scrollNext"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <GalleryLightbox v-model="dialog" :items="items" :start-index="lightboxStart" />
  </div>
</template>

<style scoped>
.home-gallery-preview__frame {
  display: flex;
  align-items: stretch;
  gap: 8px;
}

.home-gallery-preview__arrow {
  flex-shrink: 0;
  align-self: center;
}

.home-gallery-preview__strip {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: row;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding-block: 4px;
  -webkit-overflow-scrolling: touch;
  /* Hide scrollbar; arrows + touch/drag still scroll */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.home-gallery-preview__strip::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

/* Mobile: one card width (strip scrolls one “page” per arrow = one card) */
.home-gallery-preview__card {
  flex: 0 0 min(340px, calc(100% - 8px));
  scroll-snap-align: start;
  cursor: pointer;
  overflow: hidden;
}

.home-gallery-preview__img {
  height: 196px;
}

/* Tablet+: three across */
@media (min-width: 600px) {
  .home-gallery-preview__card {
    flex: 0 0 calc((100% - 2 * 16px) / 3);
    min-width: 0;
  }

  .home-gallery-preview__img {
    height: 212px;
  }
}

/* Desktop wide: four across */
@media (min-width: 1280px) {
  .home-gallery-preview__card {
    flex: 0 0 calc((100% - 3 * 16px) / 4);
  }

  .home-gallery-preview__img {
    height: 228px;
  }
}
</style>
