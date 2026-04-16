<script setup lang="ts">
import RevealOnView from '@/components/common/RevealOnView.vue'

defineProps<{
  title: string
  subtitle?: string
  image?: string
}>()
</script>

<template>
  <section class="hero text-white">
    <v-parallax
      v-if="image"
      :src="image"
      height="320"
      class="rounded-b-xl"
    >
      <div class="hero__overlay d-flex flex-column justify-center align-center text-center pa-6">
        <RevealOnView class="d-flex flex-column align-center w-100">
          <h1 class="text-h4 text-md-h3 font-weight-bold pg-reveal-item" style="--reveal-delay: 0ms">{{ title }}</h1>
          <p
            v-if="subtitle"
            class="text-body-1 mt-2 max-width-600 pg-reveal-item"
            style="--reveal-delay: 75ms"
          >
            {{ subtitle }}
          </p>
        </RevealOnView>
      </div>
    </v-parallax>
    <div v-else class="hero__gradient pa-10 text-center rounded-b-xl">
      <RevealOnView>
        <h1 class="text-h4 text-md-h3 font-weight-bold pg-reveal-item" style="--reveal-delay: 0ms">{{ title }}</h1>
        <p
          v-if="subtitle"
          class="text-body-1 mt-2 mx-auto pg-reveal-item"
          style="max-width: 40rem; --reveal-delay: 75ms"
        >
          {{ subtitle }}
        </p>
      </RevealOnView>
    </div>
  </section>
</template>

<style scoped>
.hero__gradient {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
}
.hero__overlay {
  min-height: 320px;
  background: rgba(0, 0, 0, 0.45);
}
</style>
