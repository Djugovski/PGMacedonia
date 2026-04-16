<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMathCaptcha } from '@/composables/useMathCaptcha'
import { submitContact } from '@/services/contact'

const { t, locale } = useI18n()

const props = defineProps<{
  defaultProgram?: string
}>()

const programsEn = [
  'Ohrid — Early Bird (65 €)',
  'Ohrid — Experience (85 €)',
  'Ohrid — Cross country (from 95 €)',
  'Krushevo — Standard (79 €)',
]

const programsMk = [
  'Охрид — Early Bird (65 €)',
  'Охрид — Experience (85 €)',
  'Охрид — Cross country (од 95 €)',
  'Крушево — стандарден (79 €)',
]

const programs = computed(() => (locale.value === 'mk' ? programsMk : programsEn))

const programItems = computed(() =>
  programs.value.map((title, value) => ({ title, value })),
)

const programIndex = ref(1)

watch(
  () => props.defaultProgram,
  (v) => {
    if (!v) return
    const i = programsEn.findIndex((p) => p === v)
    if (i >= 0) programIndex.value = i
  },
  { immediate: true },
)

const name = ref('')
const email = ref('')
const phone = ref('')
const preferredDate = ref('')
const persons = ref<number | null>(1)
const residence = ref('')
const message = ref('')
const travelStart = ref('')
const travelEnd = ref('')
const captchaInput = ref<number | null>(null)
const loading = ref(false)
const snack = ref({ show: false, text: '', color: 'success' })

const personOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const { refresh: refreshCaptcha, question, expected } = useMathCaptcha()

const selectedProgramLabel = computed(() => programs.value[programIndex.value] ?? programsEn[1]!)

async function onSubmit() {
  const expectedVal = expected()
  if (captchaInput.value !== expectedVal) {
    snack.value = { show: true, text: t('forms.captchaWrong'), color: 'error' }
    refreshCaptcha()
    captchaInput.value = null
    return
  }

  loading.value = true
  try {
    await submitContact({
      kind: 'tandem',
      name: name.value.trim(),
      email: email.value.trim(),
      subject: `Tandem booking — ${selectedProgramLabel.value}`,
      message: message.value.trim() || '—',
      captchaAnswer: captchaInput.value ?? -1,
      captchaExpected: expectedVal,
      meta: {
        phone: phone.value.trim(),
        program: selectedProgramLabel.value,
        preferredDate: preferredDate.value,
        persons: persons.value ?? undefined,
        residence: residence.value.trim() || undefined,
        travelStart: travelStart.value || undefined,
        travelEnd: travelEnd.value || undefined,
      },
    })
    snack.value = {
      show: true,
      text: t('forms.thanksBooking'),
      color: 'success',
    }
    captchaInput.value = null
    refreshCaptcha()
  } catch (e) {
    snack.value = {
      show: true,
      text: e instanceof Error ? e.message : t('forms.errorGeneric'),
      color: 'error',
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field v-model="name" :label="t('forms.name')" required autocomplete="name" />
    <v-text-field v-model="email" :label="t('forms.email')" type="email" required autocomplete="email" />
    <v-text-field v-model="phone" :label="t('forms.phone')" required autocomplete="tel" />
    <v-select
      v-model="programIndex"
      :items="programItems"
      item-title="title"
      item-value="value"
      :label="t('forms.program')"
      required
    />
    <v-text-field v-model="preferredDate" :label="t('forms.preferredDate')" type="date" required />
    <v-select v-model="persons" :items="personOptions" :label="t('forms.persons')" required />
    <v-text-field v-model="residence" :label="t('forms.residence')" />
    <v-text-field v-model="travelStart" :label="t('forms.travelStart')" type="date" />
    <v-text-field v-model="travelEnd" :label="t('forms.travelEnd')" type="date" />
    <v-textarea v-model="message" :label="t('forms.messageOptional')" rows="3" />
    <v-text-field v-model.number="captchaInput" :label="question()" type="number" required class="mb-2" />
    <v-btn type="submit" color="primary" size="large" :loading="loading" block>
      {{ t('forms.sendBooking') }}
    </v-btn>
  </v-form>
  <v-snackbar v-model="snack.show" :color="snack.color" timeout="7000">
    {{ snack.text }}
  </v-snackbar>
</template>
