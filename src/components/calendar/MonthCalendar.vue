<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchCalendarMonth, type DayState } from '@/services/calendar'

const { t } = useI18n()

const props = defineProps<{
  modelValue: { start: string | null; end: string | null }
}>()

const emit = defineEmits<{
  'update:modelValue': [v: { start: string | null; end: string | null }]
  'invalid-range': []
}>()

const now = new Date()
const year = ref(now.getUTCFullYear())
const month = ref(now.getUTCMonth() + 1)
const days = ref<Record<string, DayState>>({})
const loading = ref(true)
const loadError = ref(false)
const loadedOk = ref(false)

async function load() {
  loading.value = true
  loadError.value = false
  loadedOk.value = false
  try {
    const res = await fetchCalendarMonth(year.value, month.value)
    days.value = res.days
    loadedOk.value = true
  } catch {
    loadError.value = true
    days.value = {}
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch([year, month], () => {
  emit('update:modelValue', { start: null, end: null })
  load()
})

const monthLabel = computed(() =>
  new Date(Date.UTC(year.value, month.value - 1, 1)).toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  }),
)

const weekdayLabels = computed(() => {
  const base = new Date(Date.UTC(2024, 0, 1))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base)
    d.setUTCDate(base.getUTCDate() + i)
    return d.toLocaleString(undefined, { weekday: 'short' })
  })
})

/** ISO dates (YYYY-MM-DD) in this month in grid order (leading blanks as null) */
const gridCells = computed(() => {
  const first = new Date(Date.UTC(year.value, month.value - 1, 1))
  const startPad = (first.getUTCDay() + 6) % 7
  const dim = new Date(Date.UTC(year.value, month.value, 0)).getUTCDate()
  const cells: ({ date: string; state: DayState } | null)[] = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  const locked = loading.value || !loadedOk.value || loadError.value
  for (let d = 1; d <= dim; d++) {
    const iso = new Date(Date.UTC(year.value, month.value - 1, d)).toISOString().slice(0, 10)
    const state: DayState = locked ? 'unavailable' : (days.value[iso] ?? 'available')
    cells.push({ date: iso, state })
  }
  return cells
})

const selection = computed(() => props.modelValue)

function inSelectedRange(iso: string): boolean {
  const { start, end } = selection.value
  if (!start) return false
  if (!end) return iso === start
  const lo = start <= end ? start : end
  const hi = start <= end ? end : start
  return iso >= lo && iso <= hi
}

function onPick(iso: string, state: DayState) {
  if (!loadedOk.value || state !== 'available') return
  const { start, end } = selection.value
  if (!start || (start && end)) {
    emit('update:modelValue', { start: iso, end: null })
    return
  }
  let a = start
  let b = iso
  if (b < a) [a, b] = [b, a]
  const ok = rangeIsSelectable(a, b)
  if (!ok) {
    emit('invalid-range')
    emit('update:modelValue', { start: iso, end: null })
    return
  }
  emit('update:modelValue', { start: a, end: b })
}

function rangeIsSelectable(a: string, b: string): boolean {
  const cur = new Date(`${a}T00:00:00.000Z`)
  const end = new Date(`${b}T00:00:00.000Z`)
  while (cur <= end) {
    const iso = cur.toISOString().slice(0, 10)
    const st = days.value[iso]
    if (st && st !== 'available') return false
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  return true
}

function prevMonth() {
  if (month.value === 1) {
    month.value = 12
    year.value -= 1
  } else month.value -= 1
}

function nextMonth() {
  if (month.value === 12) {
    month.value = 1
    year.value += 1
  } else month.value += 1
}

function clearSel() {
  emit('update:modelValue', { start: null, end: null })
}

function chipColor(state: DayState) {
  if (state === 'booked') return 'error'
  if (state === 'unavailable') return 'grey'
  return 'success'
}
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <v-btn icon="mdi-chevron-left" variant="text" :aria-label="t('calendar.prevMonth')" @click="prevMonth" />
      <div class="text-subtitle-1 font-weight-medium">{{ monthLabel }}</div>
      <v-btn icon="mdi-chevron-right" variant="text" :aria-label="t('calendar.nextMonth')" @click="nextMonth" />
    </div>

    <v-alert v-if="loadError" type="error" variant="tonal" density="comfortable" class="mb-4">
      {{ t('calendar.loadError') }}
    </v-alert>

    <p class="text-body-2 text-medium-emphasis mb-2">{{ t('calendar.instruction') }}</p>

    <div class="d-flex flex-wrap ga-3 mb-4">
      <v-chip size="small" :color="chipColor('available')" variant="flat">{{ t('calendar.legendAvailable') }}</v-chip>
      <v-chip size="small" :color="chipColor('booked')" variant="flat">{{ t('calendar.legendBooked') }}</v-chip>
      <v-chip size="small" :color="chipColor('unavailable')" variant="flat">{{
        t('calendar.legendUnavailable')
      }}</v-chip>
      <v-chip size="small" color="primary" variant="flat">{{ t('calendar.legendSelected') }}</v-chip>
    </div>

    <v-progress-linear v-if="loading" indeterminate class="mb-2" />

    <div class="calendar-grid mb-4">
      <div v-for="(w, i) in weekdayLabels" :key="i" class="calendar-grid__head text-caption text-medium-emphasis">
        {{ w }}
      </div>
      <template v-for="(cell, idx) in gridCells" :key="idx">
        <div v-if="!cell" class="calendar-grid__cell" />
        <button
          v-else
          type="button"
          class="calendar-grid__cell calendar-grid__day"
          :class="{
            'calendar-grid__day--booked': cell.state === 'booked',
            'calendar-grid__day--unavailable': cell.state === 'unavailable',
            'calendar-grid__day--selected': inSelectedRange(cell.date),
          }"
          :disabled="cell.state !== 'available'"
          @click="onPick(cell.date, cell.state)"
        >
          {{ Number(cell.date.slice(8, 10)) }}
        </button>
      </template>
    </div>

    <div class="d-flex ga-2">
      <v-btn size="small" variant="text" @click="clearSel">{{ t('calendar.clear') }}</v-btn>
      <span v-if="selection.start" class="text-body-2 text-medium-emphasis align-self-center">
        {{ selection.start }}<template v-if="selection.end"> → {{ selection.end }}</template>
      </span>
    </div>
  </div>
</template>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.calendar-grid__head {
  text-align: center;
  padding: 4px 0;
}
.calendar-grid__cell {
  min-height: 40px;
}
.calendar-grid__day {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgb(var(--v-theme-surface));
  cursor: pointer;
  font: inherit;
  transition: background 0.12s ease;
}
.calendar-grid__day:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.calendar-grid__day--booked {
  background: rgba(var(--v-theme-error), 0.12);
}
.calendar-grid__day--unavailable {
  background: rgba(0, 0, 0, 0.06);
}
.calendar-grid__day--selected {
  outline: 2px solid rgb(var(--v-theme-primary));
  font-weight: 600;
}
</style>
