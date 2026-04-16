import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Adds `visible` when the root element enters the viewport — for subtle
 * motion only (content stays in the DOM for crawlers; pair with CSS that
 * prefers transform over hiding text when possible).
 */
export function useRevealInView() {
  const rootRef = ref<HTMLElement | null>(null)
  const visible = ref(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  let io: IntersectionObserver | null = null

  onMounted(() => {
    if (typeof window === 'undefined') {
      visible.value = true
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      visible.value = true
      return
    }

    const el = rootRef.value
    if (!el) {
      visible.value = true
      return
    }

    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          visible.value = true
          io?.disconnect()
          io = null
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    if (io.takeRecords().some((e) => e.isIntersecting && e.target === el)) {
      visible.value = true
      io.disconnect()
      io = null
    }
  })

  onUnmounted(() => {
    io?.disconnect()
    io = null
  })

  return { rootRef, visible }
}
