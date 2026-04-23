<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MathCaptcha from '@/components/forms/MathCaptcha.vue'
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

const { question, answer, isValid, regenerate, asPayload } = useMathCaptcha()
const captchaTouched = ref(false)
const captchaShowError = computed(() => captchaTouched.value && !isValid.value && answer.value.trim() !== '')

const loading = ref(false)
const snack = ref({ show: false, text: '', color: 'success' })

const canSubmit = computed(
  () =>
    !!props.start &&
    !!props.end &&
    firstName.value.trim().length > 0 &&
    email.value.trim().length > 0,
)

async function onSubmit() {
  if (!props.start || !props.end) return
  captchaTouched.value = true
  if (!isValid.value || !asPayload.value) {
    snack.value = { show: true, text: t('forms.captchaWrong'), color: 'error' }
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
      ...asPayload.value,
    })
    snack.value = { show: true, text: t('calendar.calendarSuccess'), color: 'success' }
    firstName.value = ''
    lastName.value = ''
    email.value = ''
    phone.value = ''
    message.value = ''
    captchaTouched.value = false
    regenerate()
  } catch (e) {
    snack.value = {
      show: true,
      text: e instanceof Error ? e.message : t('calendar.calendarError'),
      color: 'error',
    }
    regenerate()
    captchaTouched.value = false
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
    <v-text-field v-model="firstName" :label="t('forms.firstName')" required autocomplete="given-name" maxlength="100" />
    <v-text-field v-model="lastName" :label="t('forms.lastName')" autocomplete="family-name" maxlength="100" />
    <v-text-field v-model="email" :label="t('forms.email')" type="email" required autocomplete="email" maxlength="320" />
    <v-text-field v-model="phone" :label="t('forms.phone')" autocomplete="tel" maxlength="40" />
    <v-textarea v-model="message" :label="t('forms.messageOptional')" rows="3" maxlength="2000" counter />
    <MathCaptcha
      v-model="answer"
      :question="question"
      :invalid="captchaShowError"
      @refresh="regenerate"
    />
    <v-btn type="submit" color="primary" size="large" block :loading="loading" :disabled="!canSubmit">
      {{ t('calendar.submitCalendar') }}
    </v-btn>
  </v-form>
  <v-snackbar v-model="snack.show" :color="snack.color" timeout="8000">
    {{ snack.text }}
  </v-snackbar>
</template>
