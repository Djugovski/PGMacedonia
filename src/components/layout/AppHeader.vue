<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import AppLogo from '@/components/layout/AppLogo.vue'
import LocaleFlags from '@/components/layout/LocaleFlags.vue'
import { useLocalizedNames } from '@/composables/useLocalizedNames'

const drawer = ref(false)
const scrolled = ref(false)

function updateScrolled() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  updateScrolled()
  window.addEventListener('scroll', updateScrolled, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', updateScrolled)
})
const { mdAndUp } = useDisplay()
const { t } = useI18n()
const { ln } = useLocalizedNames()

type NavChild = { name: string; labelKey: string }
type NavItem = { name: string; labelKey: string; children?: NavChild[] }

const nav: NavItem[] = [
  { name: 'home', labelKey: 'nav.home' },
  {
    name: 'tandem',
    labelKey: 'nav.tandem',
    children: [
      { name: 'tandem-ohrid', labelKey: 'nav.tandemOhrid' },
      { name: 'tandem-krusevo', labelKey: 'nav.tandemKrusevo' },
    ],
  },
  { name: 'guiding', labelKey: 'nav.guiding' },
  { name: 'gallery', labelKey: 'nav.gallery' },
  { name: 'faq', labelKey: 'nav.faq' },
  { name: 'contact', labelKey: 'nav.contact' },
]

/* ---- Animated paraglider that flies logo → first nav item ---- */
const gliderTrack = ref<HTMLElement | null>(null)
</script>

<template>
  <v-app-bar
    color="primary"
    :elevation="scrolled ? 0 : 1"
    density="comfortable"
    class="app-header-bar"
    :class="{ 'app-header-bar--scrolled': scrolled }"
  >
    <v-app-bar-nav-icon v-if="!mdAndUp" class="d-md-none" @click="drawer = true" />
    <v-toolbar-title class="d-flex align-center" style="overflow: visible; margin-inline-end: 0">
      <AppLogo />
    </v-toolbar-title>

    <!-- Desktop: glider flies between logo and nav -->
    <div v-if="mdAndUp" ref="gliderTrack" class="glider-track" aria-hidden="true">
      <svg class="glider-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" fill="white">
        <g transform="translate(120,0) scale(-1,1)">
          <path d="M16 38 C18 18,40 4,60 2 C80 0,104 14,108 34 C106 30,96 22,80 18 C68 14,48 18,30 28 C22 32,18 36,16 38Z"/>
          <line x1="24" y1="34" x2="56" y2="98" stroke="white" stroke-width="0.6" opacity="0.7"/>
          <line x1="32" y1="26" x2="58" y2="98" stroke="white" stroke-width="0.6" opacity="0.7"/>
          <line x1="42" y1="20" x2="60" y2="96" stroke="white" stroke-width="0.6" opacity="0.7"/>
          <line x1="54" y1="16" x2="62" y2="94" stroke="white" stroke-width="0.6" opacity="0.7"/>
          <line x1="70" y1="12" x2="64" y2="94" stroke="white" stroke-width="0.6" opacity="0.7"/>
          <line x1="82" y1="14" x2="66" y2="96" stroke="white" stroke-width="0.6" opacity="0.7"/>
          <line x1="92" y1="20" x2="66" y2="98" stroke="white" stroke-width="0.6" opacity="0.7"/>
          <line x1="100" y1="28" x2="68" y2="100" stroke="white" stroke-width="0.6" opacity="0.7"/>
          <line x1="60" y1="8" x2="62" y2="94" stroke="white" stroke-width="0.6" opacity="0.65"/>
          <ellipse cx="62" cy="104" rx="7" ry="5"/>
          <circle cx="62" cy="94" r="4"/>
          <path d="M57 108 Q54 118 50 126" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
          <path d="M67 108 Q70 118 72 126" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
          <path d="M55 100 Q48 96 44 98" stroke="white" stroke-width="1.6" stroke-linecap="round" fill="none"/>
          <path d="M69 100 Q76 96 80 98" stroke="white" stroke-width="1.6" stroke-linecap="round" fill="none"/>
        </g>
      </svg>
    </div>

    <v-spacer class="glider-spacer" />
    <nav v-if="mdAndUp" class="header-nav d-flex align-center ga-1 justify-end">
      <template v-for="item in nav" :key="item.name">
        <v-menu
          v-if="item.children"
          open-on-hover
          open-delay="60"
          close-delay="120"
          location="bottom"
          offset="4"
          transition="fade-transition"
        >
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              :to="{ name: ln(item.name) }"
              variant="text"
              class="text-white header-nav__btn header-nav__btn--has-menu"
            >
              {{ t(item.labelKey) }}
              <v-icon end size="x-small" class="header-nav__chevron">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list density="comfortable" class="header-nav__submenu" min-width="220">
            <v-list-item
              v-for="child in item.children"
              :key="child.name"
              :to="{ name: ln(child.name) }"
              :title="t(child.labelKey)"
            />
          </v-list>
        </v-menu>
        <v-btn
          v-else
          :to="{ name: ln(item.name) }"
          variant="text"
          class="text-white header-nav__btn"
        >
          {{ t(item.labelKey) }}
        </v-btn>
      </template>
      <LocaleFlags class="ms-1" />
    </nav>
    <template v-else>
      <LocaleFlags class="me-1" />
      <!-- Mobile/tablet: glider flies after the flags to the right edge -->
      <div class="glider-track glider-track--mobile" aria-hidden="true">
        <svg class="glider-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" fill="white">
          <g transform="translate(120,0) scale(-1,1)">
            <path d="M16 38 C18 18,40 4,60 2 C80 0,104 14,108 34 C106 30,96 22,80 18 C68 14,48 18,30 28 C22 32,18 36,16 38Z"/>
            <line x1="24" y1="34" x2="56" y2="98" stroke="white" stroke-width="0.6" opacity="0.7"/>
            <line x1="32" y1="26" x2="58" y2="98" stroke="white" stroke-width="0.6" opacity="0.7"/>
            <line x1="42" y1="20" x2="60" y2="96" stroke="white" stroke-width="0.6" opacity="0.7"/>
            <line x1="54" y1="16" x2="62" y2="94" stroke="white" stroke-width="0.6" opacity="0.7"/>
            <line x1="70" y1="12" x2="64" y2="94" stroke="white" stroke-width="0.6" opacity="0.7"/>
            <line x1="82" y1="14" x2="66" y2="96" stroke="white" stroke-width="0.6" opacity="0.7"/>
            <line x1="92" y1="20" x2="66" y2="98" stroke="white" stroke-width="0.6" opacity="0.7"/>
            <line x1="100" y1="28" x2="68" y2="100" stroke="white" stroke-width="0.6" opacity="0.7"/>
            <line x1="60" y1="8" x2="62" y2="94" stroke="white" stroke-width="0.6" opacity="0.65"/>
            <ellipse cx="62" cy="104" rx="7" ry="5"/>
            <circle cx="62" cy="94" r="4"/>
            <path d="M57 108 Q54 118 50 126" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
            <path d="M67 108 Q70 118 72 126" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
            <path d="M55 100 Q48 96 44 98" stroke="white" stroke-width="1.6" stroke-linecap="round" fill="none"/>
            <path d="M69 100 Q76 96 80 98" stroke="white" stroke-width="1.6" stroke-linecap="round" fill="none"/>
          </g>
        </svg>
      </div>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary location="start" width="280">
    <v-list nav density="comfortable">
      <template v-for="item in nav" :key="item.name">
        <v-list-item
          :to="{ name: ln(item.name) }"
          :title="t(item.labelKey)"
          link
          @click="drawer = false"
        />
        <v-list-item
          v-for="child in item.children"
          :key="child.name"
          :to="{ name: ln(child.name) }"
          :title="t(child.labelKey)"
          class="header-drawer__child"
          density="compact"
          link
          @click="drawer = false"
        />
      </template>
      <v-divider class="my-3" />
      <v-list-subheader>{{ t('nav.language') }}</v-list-subheader>
      <div class="px-3 pb-2">
        <LocaleFlags on-light />
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.app-header-bar {
  transition:
    background-color 0.28s ease,
    backdrop-filter 0.28s ease,
    border-color 0.28s ease;
}

.app-header-bar--scrolled {
  background-color: rgba(var(--v-theme-primary), 0.52) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.14) !important;
}

/* Let toolbar title shrink-wrap to logo width instead of
   Vuetify's min-width:0 which starves the glider track */
.app-header-bar :deep(.v-toolbar-title) {
  flex: 0 0 auto;
  min-width: auto;
}

/* ── Nav bar: prevent wrapping on medium screens ── */
.header-nav {
  flex-wrap: nowrap !important;
  white-space: nowrap;
}

.header-nav__btn {
  padding-inline: 10px !important;
  min-width: 0 !important;
  font-size: 0.82rem;
}

@media (min-width: 1280px) {
  .header-nav__btn {
    padding-inline: 14px !important;
    font-size: 0.875rem;
  }
}

/* Subtle chevron on items that expand on hover */
.header-nav__btn--has-menu .header-nav__chevron {
  margin-inline-start: 2px;
  opacity: 0.82;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.header-nav__btn--has-menu:hover .header-nav__chevron,
.header-nav__btn--has-menu[aria-expanded='true'] .header-nav__chevron {
  opacity: 1;
  transform: translateY(1px);
}

/* Submenu panel — light surface with a soft lift */
:global(.header-nav__submenu) {
  border-radius: 12px !important;
  box-shadow:
    0 10px 28px rgba(12, 74, 110, 0.18),
    0 2px 6px rgba(12, 74, 110, 0.08) !important;
  overflow: hidden;
}

/* Drawer sub-item indent */
.header-drawer__child {
  padding-inline-start: 32px !important;
}
.header-drawer__child :deep(.v-list-item-title) {
  font-size: 0.92rem;
}

/* ── Paraglider flight animation ── */
.glider-track {
  position: relative;
  flex: 1 1 0;
  min-width: 40px;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  margin-inline: 0;
}

.glider-track--mobile {
  min-width: 24px;
  flex: 1 1 0;
  margin-inline-start: 0;
}

.glider-spacer {
  flex: 0 0 4px !important;
}

.glider-svg {
  position: absolute;
  top: 50%;
  width: 28px;
  height: auto;
  transform: translateY(-50%);
  opacity: 0;
  animation: glider-fly 15s ease-in-out infinite;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.22));
}

/* Slightly larger on desktop where there's more room */
@media (min-width: 960px) {
  .glider-svg {
    width: 34px;
  }
}

@keyframes glider-fly {
  0% {
    left: -34px;
    opacity: 0;
    transform: translateY(-50%) rotate(-2deg);
  }
  5% {
    opacity: 0.94;
  }
  20% {
    transform: translateY(calc(-50% - 3px)) rotate(1deg);
  }
  40% {
    transform: translateY(calc(-50% + 2px)) rotate(-1.5deg);
  }
  60% {
    transform: translateY(calc(-50% - 2px)) rotate(1deg);
  }
  80% {
    transform: translateY(calc(-50% + 1px)) rotate(-0.8deg);
  }
  93% {
    opacity: 0.94;
  }
  100% {
    left: calc(100% + 8px);
    opacity: 0;
    transform: translateY(-50%) rotate(1.5deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .glider-svg {
    animation: none !important;
    display: none;
  }
}
</style>
