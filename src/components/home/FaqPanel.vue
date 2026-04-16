<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export type FaqPair = { q: string; a: string }

const props = withDefaults(
  defineProps<{
    /** If set, only the first N entries are shown (e.g. home teaser). */
    limit?: number
  }>(),
  {},
)

const { tm } = useI18n()

const items = computed((): FaqPair[] => {
  const raw = tm('faq.items') as unknown
  const list = Array.isArray(raw) ? (raw as FaqPair[]) : []
  if (props.limit != null) return list.slice(0, props.limit)
  return list
})
</script>

<template>
  <v-expansion-panels v-if="items.length" variant="accordion" class="faq-panels">
    <v-expansion-panel v-for="(item, i) in items" :key="i">
      <v-expansion-panel-title>{{ item.q }}</v-expansion-panel-title>
      <v-expansion-panel-text>{{ item.a }}</v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
.faq-panels :deep(.v-expansion-panel-title) {
  font-weight: 600;
  line-height: 1.35;
  min-height: 52px;
}
.faq-panels :deep(.v-expansion-panel-text) {
  line-height: 1.55;
}
</style>
