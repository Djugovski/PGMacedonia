<script setup lang="ts">
import { useRevealInView } from '@/composables/useRevealInView'

const { rootRef, visible } = useRevealInView()
</script>

<template>
  <div
    ref="rootRef"
    class="pg-reveal-scope"
    :class="{ 'pg-reveal-scope--visible': visible }"
  >
    <slot />
  </div>
</template>
