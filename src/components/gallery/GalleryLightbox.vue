<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

export type GalleryLightboxItem = {
  resolved: string
  alt: string
}

const props = defineProps<{
  modelValue: boolean
  items: GalleryLightboxItem[]
  startIndex: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { t } = useI18n()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

const currentIndex = ref(0)

function syncIndex() {
  if (!props.items.length) return
  currentIndex.value = Math.min(
    Math.max(0, props.startIndex),
    props.items.length - 1,
  )
}

const current = computed(() => props.items[currentIndex.value] ?? null)

function step(delta: number) {
  const n = props.items.length
  if (n <= 0) return
  currentIndex.value = (currentIndex.value + delta + n) % n
}

function onKeydown(e: KeyboardEvent) {
  if (!props.modelValue) return
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    step(-1)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    step(1)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    emit('update:modelValue', false)
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      syncIndex()
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
)

watch(
  () => [props.modelValue, props.startIndex, props.items.length] as const,
  () => {
    if (props.modelValue && props.items.length) syncIndex()
  },
  { immediate: true },
)

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

const counter = computed(() =>
  props.items.length
    ? t('gallery.lightboxCounter', { n: currentIndex.value + 1, total: props.items.length })
    : '',
)
</script>

<template>
  <v-dialog
    v-model="isOpen"
    fullscreen
    transition="fade-transition"
    scrim-opacity="0.88"
    class="gallery-lightbox-dialog"
  >
    <v-card
      v-if="current"
      flat
      rounded="0"
      class="gallery-lightbox fill-height d-flex flex-column text-white"
      color="transparent"
    >
      <div
        class="gallery-lightbox__toolbar d-flex align-center justify-space-between px-2 py-1"
        @click.self="isOpen = false"
      >
        <span class="text-caption text-medium-emphasis ps-2">{{ counter }}</span>
        <v-btn
          icon
          variant="text"
          color="white"
          density="comfortable"
          :aria-label="t('gallery.close')"
          @click.stop="isOpen = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="gallery-lightbox__stage flex-grow-1 position-relative d-flex align-center justify-center">
        <div
          class="gallery-lightbox__bg"
          aria-hidden="true"
          role="presentation"
          @click="isOpen = false"
        />

        <div class="gallery-lightbox__side gallery-lightbox__side--left" aria-hidden="true" />
        <div class="gallery-lightbox__side gallery-lightbox__side--right" aria-hidden="true" />

        <v-btn
          class="gallery-lightbox__nav gallery-lightbox__nav--prev text-white"
          icon
          size="x-large"
          variant="flat"
          :aria-label="t('gallery.lightboxPrev')"
          @click.stop="step(-1)"
        >
          <v-icon size="42">mdi-chevron-left</v-icon>
        </v-btn>

        <v-img
          :key="currentIndex"
          class="gallery-lightbox__img mx-auto"
          :src="current.resolved"
          :alt="current.alt"
          max-height="calc(100vh - 120px)"
          max-width="min(96vw, 1100px)"
          contain
          @click.stop
        />

        <v-btn
          class="gallery-lightbox__nav gallery-lightbox__nav--next text-white"
          icon
          size="x-large"
          variant="flat"
          :aria-label="t('gallery.lightboxNext')"
          @click.stop="step(1)"
        >
          <v-icon size="42">mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <div
        class="gallery-lightbox__caption text-body-2 text-center px-4 pb-4 text-medium-emphasis"
        @click.self="isOpen = false"
      >
        {{ current.alt }}
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.gallery-lightbox {
  background: radial-gradient(ellipse 120% 80% at 50% 45%, #075985 0%, #0c4a6e 52%, #082f49 100%);
  min-height: 100dvh;
}

.gallery-lightbox__toolbar {
  flex-shrink: 0;
  z-index: 4;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, transparent 100%);
}

.gallery-lightbox__stage {
  min-height: 0;
  z-index: 1;
}

.gallery-lightbox__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  cursor: pointer;
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.04) 0%, transparent 55%);
}

.gallery-lightbox__side {
  position: absolute;
  top: 0;
  bottom: 0;
  width: min(22vw, 140px);
  z-index: 1;
  pointer-events: none;
}

.gallery-lightbox__side--left {
  left: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.12) 70%, transparent 100%);
}

.gallery-lightbox__side--right {
  right: 0;
  background: linear-gradient(270deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.12) 70%, transparent 100%);
}

.gallery-lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  color: rgba(255, 255, 255, 0.95) !important;
  background: rgba(8, 47, 73, 0.55) !important;
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.gallery-lightbox__nav:hover {
  background: rgba(12, 74, 110, 0.72) !important;
}

.gallery-lightbox__nav--prev {
  left: max(8px, env(safe-area-inset-left, 0px));
}

.gallery-lightbox__nav--next {
  right: max(8px, env(safe-area-inset-right, 0px));
}

.gallery-lightbox__img {
  position: relative;
  z-index: 2;
}

.gallery-lightbox__caption {
  flex-shrink: 0;
  max-width: 52rem;
  margin: 0 auto;
  z-index: 2;
}

@media (prefers-reduced-motion: reduce) {
  .gallery-lightbox__nav {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
</style>
