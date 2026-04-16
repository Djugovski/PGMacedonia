import nodemailer from 'nodemailer'

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function formatContactEmail(payload: Record<string, unknown>): { subject: string; text: string; html: string } {
  const lines = Object.entries(payload)
    .filter(([, v]) => v !== undefined && v !== null && String(v).length > 0)
    .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
  const text = ['PG Macedonia — website inquiry', '', ...lines].join('\n')
  const rows = Object.entries(payload)
    .filter(([, v]) => v !== undefined && v !== null && String(v).length > 0)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 10px;border:1px solid #eee;font-weight:600">${escapeHtml(k)}</td><td style="padding:6px 10px;border:1px solid #eee">${escapeHtml(
          typeof v === 'object' ? JSON.stringify(v) : String(v),
        )}</td></tr>`,
    )
    .join('')
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif"><h2>PG Macedonia — inquiry</h2><table style="border-collapse:collapse;max-width:640px">${rows}</table></body></html>`
  const subject =
    typeof payload.subject === 'string' && payload.subject.trim()
      ? `[PG Macedonia] ${payload.subject.trim()}`
      : `[PG Macedonia] ${String(payload.kind ?? 'message')}`
  return { subject, text, html }
}

export async function sendNotification(to: string, subject: string, text: string, html: string): Promise<void> {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM ?? user ?? 'noreply@pgmacedonia.mk'

  if (!host || !user || !pass) {
    console.info('[mail] SMTP not configured — logging message instead of sending.')
    console.info('To:', to)
    console.info('Subject:', subject)
    console.info(text)
    return
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  })
}
