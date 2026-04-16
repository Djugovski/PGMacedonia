/**
 * Submits inquiry payloads to your backend. The WordPress site handled mail server-side;
 * this SPA expects a small API (e.g. Vercel/Netlify function, Node, or Formspree proxy)
 * that sends email via SMTP or a provider (Resend, SendGrid, etc.).
 */
export type InquiryKind = 'general' | 'tandem' | 'guiding'

export interface ContactPayload {
  kind: InquiryKind
  name: string
  email: string
  subject?: string
  message: string
  /** Simple bot deterrent; backend should re-validate or use hCaptcha/Turnstile */
  captchaAnswer: number
  captchaExpected: number
  meta?: Record<string, string | number | undefined>
}

export class ContactApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = 'ContactApiError'
  }
}

function contactEndpoint(): string {
  const custom = import.meta.env.VITE_CONTACT_API_URL?.trim()
  if (custom) return custom
  const api = import.meta.env.VITE_API_URL?.trim()
  if (api) return `${api.replace(/\/$/, '')}/api/contact`
  if (import.meta.env.DEV) return '/api/contact'
  return ''
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  const url = contactEndpoint()
  if (!url) {
    throw new ContactApiError('Contact API URL is not configured.')
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new ContactApiError(text || res.statusText, res.status)
  }
}
