<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { baseRouteName, mkRouteName, localeFromRouteName } from '@/i18n/route-utils'
/** MIT — https://github.com/lipis/flag-icons */
import flagGb from 'flag-icons/flags/4x3/gb.svg?url'
import flagMk from 'flag-icons/flags/4x3/mk.svg?url'

const props = withDefaults(
  defineProps<{
    /** Use on drawer / light surfaces (default: dark app bar). */
    onLight?: boolean
  }>(),
  { onLight: false },
)

const route = useRoute()
const router = useRouter()

const isEn = computed(() => localeFromRouteName(route.name) === 'en')

const ariaLabel = computed(() =>
  isEn.value
    ? 'Language: English. Switch to Macedonian.'
    : 'Language: Macedonian. Switch to English.',
)

function toggleLocale() {
  const n = route.name?.toString()
  if (!n) return
  if (isEn.value) {
    router.push({ name: mkRouteName(n), query: route.query, hash: route.hash })
  } else {
    router.push({ name: baseRouteName(n), query: route.query, hash: route.hash })
  }
}
</script>

<template>
  <div
    class="locale-flags"
    :class="{ 'locale-flags--light': props.onLight }"
  >
    <v-btn
      variant="text"
      :class="['locale-flags__btn', props.onLight ? 'text-primary' : 'text-white']"
      min-width="48"
      height="44"
      :aria-label="ariaLabel"
      @click="toggleLocale"
    >
      <span class="locale-flags__icon" aria-hidden="true">
        <img
          class="locale-flags__img"
          :src="isEn ? flagGb : flagMk"
          width="36"
          height="27"
          alt=""
          decoding="async"
        />
      </span>
    </v-btn>
  </div>
</template>

<style scoped>
.locale-flags__icon {
  display: flex;
  width: 36px;
  height: 27px;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.35);
}
.locale-flags__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
.locale-flags--light .locale-flags__icon {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
}
.locale-flags__btn:hover .locale-flags__icon {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.75);
}
.locale-flags--light .locale-flags__btn:hover .locale-flags__icon {
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary));
}
</style>
