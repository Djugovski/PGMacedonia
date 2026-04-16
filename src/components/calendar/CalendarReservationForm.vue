<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMathCaptcha } from '@/composables/useMathCaptcha'
import { submitCalendarRequest } from '@/services/calendar'

const { t } = useI18n()

const props = defineProps<{
  start: string | null
  end: string | null
}>()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const message = ref('')
const captchaInput = ref<number | null>(null)
const loading = ref(false)
const snack = ref({ show: false, text: '', color: 'success' })

const { refresh: refreshCaptcha, question, expected } = useMathCaptcha()

const canSubmit = computed(() => props.start && props.end && firstName.value.trim() && email.value.trim())

async function onSubmit() {
  if (!props.start || !props.end) return
  const expectedVal = expected()
  if (captchaInput.value !== expectedVal) {
    snack.value = { show: true, text: t('forms.captchaWrong'), color: 'error' }
    refreshCaptcha()
    captchaInput.value = null
    return
  }

  loading.value = true
  try {
    await submitCalendarRequest({
      start: props.start,
      end: props.end,
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim() || undefined,
      email: email.value.trim(),
      phone: phone.value.trim() || undefined,
      message: message.value.trim() || undefined,
      captchaAnswer: captchaInput.value ?? -1,
      captchaExpected: expectedVal,
    })
    snack.value = { show: true, text: t('calendar.calendarSuccess'), color: 'success' }
    firstName.value = ''
    lastName.value = ''
    email.value = ''
    phone.value = ''
    message.value = ''
    captchaInput.value = null
    refreshCaptcha()
  } catch (e) {
    snack.value = {
      show: true,
      text: e instanceof Error ? e.message : t('calendar.calendarError'),
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-alert v-if="!start || !end" type="info" variant="tonal" density="comfortable" class="mb-4">
      {{ t('calendar.instruction') }}
    </v-alert>
    <v-text-field v-model="firstName" :label="t('forms.firstName')" required autocomplete="given-name" />
    <v-text-field v-model="lastName" :label="t('forms.lastName')" autocomplete="family-name" />
    <v-text-field v-model="email" :label="t('forms.email')" type="email" required autocomplete="email" />
    <v-text-field v-model="phone" :label="t('forms.phone')" autocomplete="tel" />
    <v-textarea v-model="message" :label="t('forms.messageOptional')" rows="3" />
    <v-text-field
      v-model.number="captchaInput"
      :label="question()"
      type="number"
      required
      class="mb-2"
    />
    <v-btn type="submit" color="primary" size="large" block :loading="loading" :disabled="!canSubmit">
      {{ t('calendar.submitCalendar') }}
    </v-btn>
  </v-form>
  <v-snackbar v-model="snack.show" :color="snack.color" timeout="8000">
    {{ snack.text }}
  </v-snackbar>
</template>
