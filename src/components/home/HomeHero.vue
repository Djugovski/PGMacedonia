<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useLocalizedNames } from '@/composables/useLocalizedNames'

interface HeroSlide {
  title: string
  lead: string
  alt: string
}

const { t, tm, rt } = useI18n()
const { ln } = useLocalizedNames()

const slideImages = [
  '/gallery/Slider/Slide1.jpg',
  '/gallery/Slider/Slide2.png',
  '/gallery/Slider/Slide3.png',
  '/gallery/Slider/Slide4.jpg',
  '/gallery/Slider/Slide5.png',
] as const

const slides = computed(() => {
  const raw = tm('home.slides') as unknown as HeroSlide[] | undefined
  const content = Array.isArray(raw) ? raw : []
  return slideImages.map((src, i) => {
    const entry = content[i] ?? content[0] ?? ({} as HeroSlide)
    return {
      src,
      title: entry.title ? rt(entry.title) : t('home.title'),
      lead: entry.lead ? rt(entry.lead) : t('home.lead'),
      alt: entry.alt ? rt(entry.alt) : t('home.title'),
    }
  })
})

// Preload the LCP (first slide) image for better Core Web Vitals / SEO
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: slideImages[0],
      fetchpriority: 'high',
    },
  ],
})
</script>

<template>
  <section class="home-hero-carousel text-white">
    <v-carousel
      cycle
      :continuous="true"
      :interval="10_000"
      :transition-duration="1200"
      height="calc(100dvh - var(--v-layout-top, 56px))"
      show-arrows="hover"
      class="home-hero-carousel__root"
      hide-delimiter-background
    >
      <v-carousel-item v-for="(slide, i) in slides" :key="i">
        <div class="home-hero-carousel__slide">
          <v-img
            class="home-hero-carousel__bg"
            :src="slide.src"
            :alt="slide.alt"
            :eager="i === 0"
            cover
          />
          <div class="home-hero-carousel__scrim" />
          <div class="home-hero-carousel__content pa-5 pa-sm-8 pa-md-16 pg-hero-rise">
            <p class="text-overline text-white text-opacity-90 mb-2">{{ t('home.kicker') }}</p>
            <component
              :is="i === 0 ? 'h1' : 'p'"
              class="text-h3 text-md-h2 font-weight-bold mb-4"
            >
              {{ slide.title }}
            </component>
            <p class="text-h6 text-md-h5 font-weight-regular mb-8 home-hero-carousel__lead">
              {{ slide.lead }}
            </p>
            <div class="d-flex flex-column flex-sm-row flex-wrap ga-3">
              <v-btn :to="{ name: ln('tandem') }" color="accent" size="large" variant="flat">
                {{ t('home.ctaTandem') }}
              </v-btn>
              <v-btn :to="{ name: ln('guiding') }" color="white" size="large" variant="outlined">
                {{ t('home.ctaGuiding') }}
              </v-btn>
              <v-btn :to="{ name: ln('contact') }" color="white" size="large" variant="text">
                {{ t('home.ctaContact') }}
              </v-btn>
            </div>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
  </section>
</template>

<style scoped>
.home-hero-carousel__root {
  border-radius: 0;
  min-height: calc(100dvh - var(--v-layout-top, 56px));
}

/* Above scrim/content so prev/next and delimiters stay clickable */
.home-hero-carousel__root :deep(.v-window__controls) {
  z-index: 8;
}

.home-hero-carousel__root :deep(.v-carousel__controls) {
  z-index: 8;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.2));
}

/* Delimiters: inactive = soft light dots; active = light gray fill + dark gray ring (hide default icon). */
.home-hero-carousel__root :deep(.v-carousel__controls__item:not(.v-btn--active) .v-icon) {
  opacity: 0.4 !important;
  color: rgba(255, 255, 255, 0.95) !important;
}

.home-hero-carousel__root :deep(.v-carousel__controls__item.v-btn--active) {
  position: relative;
}

.home-hero-carousel__root :deep(.v-carousel__controls__item.v-btn--active .v-icon) {
  opacity: 0 !important;
  width: 0 !important;
  min-width: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}

.home-hero-carousel__root :deep(.v-carousel__controls__item.v-btn--active::after) {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e8e8e8;
  box-shadow: 0 0 0 2px #3a3a3a;
  pointer-events: none;
}

.home-hero-carousel__root :deep(.v-carousel__controls__item:hover:not(.v-btn--active) .v-icon) {
  opacity: 0.58 !important;
}

.home-hero-carousel__root :deep(.v-carousel__controls__item.v-btn--active:hover::after) {
  background: #f0f0f0;
  box-shadow: 0 0 0 2px #2a2a2a;
}

.home-hero-carousel__root :deep(.v-btn--icon) {
  color: white;
  background: rgba(0, 0, 0, 0.25);
}

/* Slide / crossfade: slower + gentler easing than Vuetify defaults */
.home-hero-carousel__root :deep(.v-window-x-transition-enter-active),
.home-hero-carousel__root :deep(.v-window-x-transition-leave-active),
.home-hero-carousel__root :deep(.v-window-x-reverse-transition-enter-active),
.home-hero-carousel__root :deep(.v-window-x-reverse-transition-leave-active),
.home-hero-carousel__root :deep(.v-window-y-transition-enter-active),
.home-hero-carousel__root :deep(.v-window-y-transition-leave-active),
.home-hero-carousel__root :deep(.v-window-y-reverse-transition-enter-active),
.home-hero-carousel__root :deep(.v-window-y-reverse-transition-leave-active),
.home-hero-carousel__root :deep(.v-window-crossfade-transition-enter-active),
.home-hero-carousel__root :deep(.v-window-crossfade-transition-leave-active) {
  transition-duration: var(--v-window-transition-duration, 900ms) !important;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1) !important;
}

@media (prefers-reduced-motion: reduce) {
  .home-hero-carousel__root :deep(.v-window-x-transition-enter-active),
  .home-hero-carousel__root :deep(.v-window-x-transition-leave-active),
  .home-hero-carousel__root :deep(.v-window-x-reverse-transition-enter-active),
  .home-hero-carousel__root :deep(.v-window-x-reverse-transition-leave-active),
  .home-hero-carousel__root :deep(.v-window-y-transition-enter-active),
  .home-hero-carousel__root :deep(.v-window-y-transition-leave-active),
  .home-hero-carousel__root :deep(.v-window-y-reverse-transition-enter-active),
  .home-hero-carousel__root :deep(.v-window-y-reverse-transition-leave-active),
  .home-hero-carousel__root :deep(.v-window-crossfade-transition-enter-active),
  .home-hero-carousel__root :deep(.v-window-crossfade-transition-leave-active) {
    transition-duration: 0.01ms !important;
  }
}

.home-hero-carousel__slide {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  height: 100%;
  min-height: 0;
  /* Let wheel scroll reach the page; only the text column captures pointers */
  pointer-events: none;
}

.home-hero-carousel__bg {
  position: absolute !important;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.home-hero-carousel__scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  /* Softer than before: photos show through; faint lift at top, muted brand tint */
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 42%),
    linear-gradient(
      120deg,
      rgba(3, 105, 161, 0.14) 0%,
      rgba(12, 74, 110, 0.1) 48%,
      rgba(14, 116, 179, 0.12) 100%
    );
}

.home-hero-carousel__content {
  position: relative;
  z-index: 2;
  pointer-events: auto;
  flex: 0 1 auto;
  align-self: center;
  width: 100%;
  max-width: 1200px;
  max-height: 100%;
  /* Avoid a scroll port here — it trapped wheel events and blocked page scroll */
  overflow-y: visible;
  overscroll-behavior: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  padding-bottom: max(1rem, env(safe-area-inset-bottom, 0px));
}

@media (max-height: 520px) {
  .home-hero-carousel__content {
    max-height: 100%;
    overflow-y: auto;
  }
}

.home-hero-carousel__lead {
  max-width: 36rem;
}

@media (prefers-reduced-motion: no-preference) {
  .pg-hero-rise > * {
    animation: pg-hero-rise-in 1.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .pg-hero-rise > *:nth-child(1) {
    animation-delay: 0.08s;
  }

  .pg-hero-rise > *:nth-child(2) {
    animation-delay: 0.18s;
  }

  .pg-hero-rise > *:nth-child(3) {
    animation-delay: 0.28s;
  }

  .pg-hero-rise > *:nth-child(4) {
    animation-delay: 0.38s;
  }
}

@keyframes pg-hero-rise-in {
  from {
    transform: translate3d(0, 18px, 0);
    opacity: 0.65;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pg-hero-rise > * {
    animation: none !important;
  }
}
</style>
