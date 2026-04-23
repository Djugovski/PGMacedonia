import { computed, ref } from 'vue'

/**
 * Stone-age math captcha — no external services, no third-party calls.
 *
 * Generates a simple arithmetic problem (e.g. "3 + 7", "9 × 4") that the
 * visitor has to solve. Both the rendered question string AND the user's
 * typed answer are sent to the API, which re-evaluates the question server
 * side (see `server/captcha.ts`) to catch the naive "just omit the field"
 * bypass.
 *
 * It's not bulletproof — a determined scraper can parse `a op b` — but it
 * blocks the 99% of casual spam bots that just POST a form body without
 * rendering the page.
 */

const OPS = ['+', '-', '×'] as const
type Op = (typeof OPS)[number]

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickOp(): Op {
  return OPS[rand(0, OPS.length - 1)] as Op
}

function solve(a: number, op: Op, b: number): number {
  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '×':
      return a * b
  }
}

export function useMathCaptcha() {
  const question = ref('')
  const expected = ref(0)
  const answer = ref<string>('')

  function regenerate(): void {
    const op = pickOp()
    let a: number
    let b: number
    if (op === '×') {
      a = rand(2, 9)
      b = rand(2, 9)
    } else if (op === '-') {
      // Always non-negative results so no one has to type a minus sign.
      a = rand(5, 20)
      b = rand(1, a)
    } else {
      a = rand(2, 20)
      b = rand(2, 20)
    }
    expected.value = solve(a, op, b)
    question.value = `${a} ${op} ${b}`
    answer.value = ''
  }

  regenerate()

  const isValid = computed(() => {
    const n = Number.parseInt(answer.value.trim(), 10)
    return Number.isFinite(n) && n === expected.value
  })

  /** Payload shape sent to the API. Undefined when the visitor hasn't answered yet. */
  const asPayload = computed<{ captchaQuestion: string; captchaAnswer: number } | undefined>(
    () => {
      const n = Number.parseInt(answer.value.trim(), 10)
      if (!Number.isFinite(n)) return undefined
      return { captchaQuestion: question.value, captchaAnswer: n }
    },
  )

  return { question, answer, expected, isValid, regenerate, asPayload }
}
