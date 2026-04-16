<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useLocalizedNames } from '@/composables/useLocalizedNames'

const { ln } = useLocalizedNames()
</script>

<template>
  <RouterLink
    :to="{ name: ln('home') }"
    class="app-logo d-inline-flex align-center text-decoration-none"
    aria-label="PG Macedonia — Home"
  >
    <img
      class="app-logo__img"
      src="/logo.png"
      width="180"
      height="48"
      alt=""
      decoding="async"
      fetchpriority="high"
    />
  </RouterLink>
</template>

<style scoped>
.app-logo {
  line-height: 0;
}
.app-logo__img {
  display: block;
  height: 40px;
  width: auto;
  max-width: min(200px, 52vw);
  object-fit: contain;
  object-position: left center;
}
@media (min-width: 960px) {
  .app-logo__img {
    height: 44px;
    max-width: 220px;
  }
}
</style>
