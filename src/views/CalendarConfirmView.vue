<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '@/composables/usePageMeta'
import { confirmCalendarToken } from '@/services/calendar'
import { useLocalizedNames } from '@/composables/useLocalizedNames'

const { t } = useI18n()
const route = useRoute()
const { ln } = useLocalizedNames()

usePageMeta({
  title: () => t('meta.confirmTitle'),
  description: () => t('meta.calendarDesc'),
})

const status = ref<'idle' | 'ok' | 'err'>('idle')
const message = ref('')

onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : ''
  if (!token) {
    status.value = 'err'
    message.value = t('confirm.missing')
    return
  }
  try {
    const res = await confirmCalendarToken(token)
    status.value = 'ok'
    message.value = res.message ?? t('confirm.success')
  } catch {
    status.value = 'err'
    message.value = t('confirm.fail')
  }
})
</script>

<template>
  <v-container class="py-16" style="max-width: 560px">
    <h1 class="text-h5 mb-4">{{ t('confirm.title') }}</h1>
    <v-progress-circular v-if="status === 'idle'" indeterminate color="primary" class="mb-4" />
    <v-alert v-else-if="status === 'ok'" type="success" variant="tonal">{{ message }}</v-alert>
    <v-alert v-else type="error" variant="tonal">{{ message }}</v-alert>
    <v-btn class="mt-6" :to="{ name: ln('home') }" color="primary" variant="flat">{{ t('confirm.home') }}</v-btn>
  </v-container>
</template>
