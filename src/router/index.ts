import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'
import { MK_SUFFIX } from '@/i18n/route-utils'

const pages: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/guiding',
    name: 'guiding',
    component: () => import('@/views/GuidingView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/tandem',
    name: 'tandem',
    component: () => import('@/views/TandemView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/tandem-ohrid',
    name: 'tandem-ohrid',
    component: () => import('@/views/TandemOhridView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/tandem-krusevo',
    name: 'tandem-krusevo',
    component: () => import('@/views/TandemKrusevoView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/paragliding-macedonia',
    name: 'paragliding-macedonia',
    component: () => import('@/views/ParaglidingMacedoniaView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/paragliding-ohrid',
    name: 'paragliding-ohrid',
    component: () => import('@/views/ParaglidingOhridGuideView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/paragliding-krusevo',
    name: 'paragliding-krusevo',
    component: () => import('@/views/ParaglidingKrushevoGuideView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/paragliding-season-macedonia',
    name: 'paragliding-season-macedonia',
    component: () => import('@/views/ParaglidingSeasonMacedoniaView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('@/views/GalleryView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/booking/tandem',
    name: 'booking-tandem',
    component: () => import('@/views/BookingTandemView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/booking/guiding',
    name: 'booking-guiding',
    component: () => import('@/views/BookingGuidingView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/calendar',
    name: 'calendar',
    redirect: (to) => ({
      name: to.meta.locale === 'mk' ? `guiding${MK_SUFFIX}` : 'guiding',
      hash: '#calendar',
    }),
    meta: { locale: 'en' },
  },
  {
    path: '/calendar/confirm',
    name: 'calendar-confirm',
    component: () => import('@/views/CalendarConfirmView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { locale: 'en' },
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/views/FaqView.vue'),
    meta: { locale: 'en' },
  },
]

function withMk(r: RouteRecordRaw): RouteRecordRaw {
  const name = String(r.name)
  return {
    ...r,
    path: r.path === '/' ? '/mk' : `/mk${r.path}`,
    name: `${name}${MK_SUFFIX}`,
    meta: { ...r.meta, locale: 'mk' },
  }
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...pages, ...pages.map(withMk)],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, top: 80, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const loc = to.meta.locale === 'mk' ? 'mk' : 'en'
  i18n.global.locale.value = loc
})
