<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  question: string
  modelValue: string
  invalid?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  refresh: []
}>()

const { t } = useI18n()

function onInput(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="pg-math-captcha">
    <v-text-field
      :model-value="props.modelValue"
      :label="t('forms.captchaLabel', { question: props.question })"
      :hint="t('forms.captchaHint')"
      :error="!!props.invalid"
      :error-messages="props.invalid ? [t('forms.captchaWrong')] : []"
      type="number"
      inputmode="numeric"
      autocomplete="off"
      density="comfortable"
      required
      @update:model-value="onInput"
    >
      <template #append>
        <v-btn
          icon
          size="small"
          variant="text"
          :aria-label="t('forms.captchaRefresh')"
          :title="t('forms.captchaRefresh')"
          @click="emit('refresh')"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<style scoped>
.pg-math-captcha {
  margin-block: 0.25rem 0.25rem;
}
</style>
