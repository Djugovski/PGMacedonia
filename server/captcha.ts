/**
 * Stone-age math captcha verification.
 *
 * The client generates a question like "3 + 7" or "9 × 4", and the visitor
 * types the answer. Both fields are POSTed to the API; we re-evaluate the
 * question string here, so you can't bypass the captcha by stripping the
 * fields or by sending a fixed answer.
 *
 * Only simple `a OP b` expressions are accepted, with small operands.
 * Anything more complex — parentheses, multiple operators, large numbers —
 * is rejected.
 */

export interface CaptchaBody {
  captchaQuestion?: string
  captchaAnswer?: number
}

export interface CaptchaResult {
  ok: boolean
  /** Short machine code for logging / client display. */
  reason?: 'missing' | 'malformed' | 'wrong'
}

const QUESTION_RE = /^\s*(\d{1,2})\s*([+\-*x×])\s*(\d{1,2})\s*$/

export function validateMathCaptcha(body: CaptchaBody): CaptchaResult {
  const q = body.captchaQuestion
  const a = body.captchaAnswer

  if (typeof q !== 'string' || typeof a !== 'number' || !Number.isFinite(a)) {
    return { ok: false, reason: 'missing' }
  }

  const m = QUESTION_RE.exec(q)
  if (!m) return { ok: false, reason: 'malformed' }

  const lhs = Number(m[1])
  const rhs = Number(m[3])
  const op = m[2]!

  let expected: number
  switch (op) {
    case '+':
      expected = lhs + rhs
      break
    case '-':
      expected = lhs - rhs
      break
    case '*':
    case 'x':
    case '×':
      expected = lhs * rhs
      break
    default:
      return { ok: false, reason: 'malformed' }
  }

  return expected === a ? { ok: true } : { ok: false, reason: 'wrong' }
}
