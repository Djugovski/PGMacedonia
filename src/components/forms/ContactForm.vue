<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MathCaptcha from '@/components/forms/MathCaptcha.vue'
import { useMathCaptcha } from '@/composables/useMathCaptcha'
import { submitContact, type InquiryKind } from '@/services/contact'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    kind?: InquiryKind
    submitLabel?: string
  }>(),
  {
    kind: 'general',
  },
)

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const numberOfPeople = ref<number | null>(null)
const needAccommodation = ref<string | null>(null)
const arrivalDate = ref('')
const departureDate = ref('')

const { question, answer, isValid, regenerate, asPayload } = useMathCaptcha()
const captchaTouched = ref(false)
const captchaShowError = computed(() => captchaTouched.value && !isValid.value && answer.value.trim() !== '')

const loading = ref(false)
const snack = ref<{ show: boolean; text: string; color: string }>({
  show: false,
  text: '',
  color: 'success',
})

const showGuidingExtras = computed(() => props.kind === 'guiding')
const personItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15]
const accommodationItems = computed(() => [
  { title: t('forms.accommodationYes'), value: 'yes' },
  { title: t('forms.accommodationNo'), value: 'no' },
])

const labelSubmit = computed(() => props.submitLabel ?? t('forms.send'))

async function onSubmit() {
  captchaTouched.value = true
  if (!isValid.value || !asPayload.value) {
    snack.value = { show: true, text: t('forms.captchaWrong'), color: 'error' }
    return
  }

  const meta: Record<string, string | number | undefined> = {}
  if (showGuidingExtras.value) {
    if (numberOfPeople.value != null) meta.numberOfPeople = numberOfPeople.value
    if (needAccommodation.value) meta.needAccommodation = needAccommodation.value
    if (arrivalDate.value) meta.arrivalDate = arrivalDate.value
    if (departureDate.value) meta.departureDate = departureDate.value
  }

  loading.value = true
  try {
    await submitContact({
      kind: props.kind,
      name: name.value.trim(),
      email: email.value.trim(),
      subject: subject.value.trim() || undefined,
      message: message.value.trim(),
      ...asPayload.value,
      meta: Object.keys(meta).length ? meta : undefined,
    })
    snack.value = {
      show: true,
      text: t('forms.thanks'),
      color: 'success',
    }
    name.value = ''
    email.value = ''
    subject.value = ''
    message.value = ''
    numberOfPeople.value = null
    needAccommodation.value = null
    arrivalDate.value = ''
    departureDate.value = ''
    captchaTouched.value = false
    regenerate()
  } catch (e) {
    snack.value = {
      show: true,
      text: e instanceof Error ? e.message : t('forms.errorGeneric'),
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
    <v-text-field v-model="name" :label="t('forms.name')" required autocomplete="name" maxlength="200" counter />
    <v-text-field v-model="email" :label="t('forms.email')" type="email" required autocomplete="email" maxlength="320" />
    <v-text-field v-model="subject" :label="t('forms.subject')" required maxlength="300" />
    <template v-if="showGuidingExtras">
      <v-select
        v-model="numberOfPeople"
        :items="personItems"
        :label="t('forms.numberOfPeople')"
        clearable
      />
      <v-select
        v-model="needAccommodation"
        :items="accommodationItems"
        item-title="title"
        item-value="value"
        :label="t('forms.needAccommodation')"
        clearable
      />
      <v-text-field v-model="arrivalDate" :label="t('forms.arrivalDate')" type="date" />
      <v-text-field v-model="departureDate" :label="t('forms.departureDate')" type="date" />
    </template>
    <v-textarea v-model="message" :label="t('forms.message')" rows="4" required maxlength="5000" counter />
    <MathCaptcha
      v-model="answer"
      :question="question"
      :invalid="captchaShowError"
      @refresh="regenerate"
    />
    <v-btn type="submit" color="primary" size="large" :loading="loading" block>
      {{ labelSubmit }}
    </v-btn>
  </v-form>
  <v-snackbar v-model="snack.show" :color="snack.color" timeout="6000">
    {{ snack.text }}
  </v-snackbar>
</template>
