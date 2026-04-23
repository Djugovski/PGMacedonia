import nodemailer from 'nodemailer'

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

type FormattedEmail = { subject: string; text: string; html: string }

function rowsFrom(entries: [string, unknown][]): { text: string[]; html: string } {
  const filtered = entries.filter(([, v]) => v !== undefined && v !== null && String(v).length > 0)
  const text = filtered.map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
  const html = filtered
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 10px;border:1px solid #eee;font-weight:600;white-space:nowrap">${escapeHtml(
          k,
        )}</td><td style="padding:6px 10px;border:1px solid #eee">${escapeHtml(
          typeof v === 'object' ? JSON.stringify(v) : String(v),
        )}</td></tr>`,
    )
    .join('')
  return { text, html }
}

function formatTandemBookingEmail(payload: Record<string, unknown>): FormattedEmail {
  const meta = (payload.meta && typeof payload.meta === 'object' ? payload.meta : {}) as Record<string, unknown>
  const program = String(meta.program ?? '—')
  const ordered: [string, unknown][] = [
    ['Name', payload.name],
    ['E-Mail', payload.email],
    ['Phone', meta.phone],
    ['Place / Program', program],
    ['Preferred date', meta.preferredDate],
    ['Number of Person', meta.persons],
    ['Residence', meta.residence],
    ['Travel from', meta.travelStart],
    ['Travel to', meta.travelEnd],
    ['Message', payload.message],
  ]
  const { text, html } = rowsFrom(ordered)

  const subject = `[PG Macedonia] New tandem booking — ${program}`
  const textBody = [
    'New tandem flight booking request',
    '',
    ...text,
    '',
    'Reply directly to this email to contact the guest.',
  ].join('\n')
  const htmlBody = `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937">
<h2 style="margin:0 0 12px">New tandem flight booking</h2>
<p style="margin:0 0 16px;color:#4b5563">A guest just submitted the tandem booking form on pgmacedonia.mk.</p>
<table style="border-collapse:collapse;max-width:640px;width:100%">${html}</table>
<p style="margin-top:18px;color:#6b7280;font-size:13px">Reply directly to this email to contact the guest.</p>
</body></html>`
  return { subject, text: textBody, html: htmlBody }
}

function formatGuidingInquiryEmail(payload: Record<string, unknown>): FormattedEmail {
  const meta = (payload.meta && typeof payload.meta === 'object' ? payload.meta : {}) as Record<string, unknown>
  const ordered: [string, unknown][] = [
    ['Name', payload.name],
    ['E-Mail', payload.email],
    ['Phone', meta.phone],
    ['Arrival', meta.arrivalDate ?? meta.travelStart],
    ['Departure', meta.departureDate ?? meta.travelEnd],
    ['Number of pilots', meta.numberOfPeople ?? meta.persons],
    ['Needs accommodation', meta.needAccommodation],
    ['Message', payload.message],
  ]
  const { text, html } = rowsFrom(ordered)
  const subject = `[PG Macedonia] Guiding inquiry — ${String(payload.name ?? '').trim() || 'new request'}`
  const textBody = ['New XC guiding inquiry', '', ...text].join('\n')
  const htmlBody = `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937">
<h2 style="margin:0 0 12px">New XC guiding inquiry</h2>
<table style="border-collapse:collapse;max-width:640px;width:100%">${html}</table>
<p style="margin-top:18px;color:#6b7280;font-size:13px">Reply directly to this email to contact the guest.</p>
</body></html>`
  return { subject, text: textBody, html: htmlBody }
}

export function formatContactEmail(payload: Record<string, unknown>): FormattedEmail {
  if (payload.kind === 'tandem') return formatTandemBookingEmail(payload)
  if (payload.kind === 'guiding') return formatGuidingInquiryEmail(payload)

  const { text, html } = rowsFrom(Object.entries(payload))
  const htmlBody = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif"><h2>PG Macedonia — inquiry</h2><table style="border-collapse:collapse;max-width:640px">${html}</table></body></html>`
  const textBody = ['PG Macedonia — website inquiry', '', ...text].join('\n')
  const subject =
    typeof payload.subject === 'string' && payload.subject.trim()
      ? `[PG Macedonia] ${payload.subject.trim()}`
      : `[PG Macedonia] ${String(payload.kind ?? 'message')}`
  return { subject, text: textBody, html: htmlBody }
}

/** Auto-reply sent to the customer after they submit a form (matches CF7 "Mail (2)"). */
export function formatGuestAutoReply(payload: Record<string, unknown>): FormattedEmail | null {
  const email = typeof payload.email === 'string' ? payload.email.trim() : ''
  if (!email) return null
  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const meta = (payload.meta && typeof payload.meta === 'object' ? payload.meta : {}) as Record<string, unknown>
  const greeting = name ? `Hi ${name.split(/\s+/)[0]},` : 'Hi,'

  if (payload.kind === 'tandem') {
    const program = String(meta.program ?? 'tandem flight')
    const date = meta.preferredDate ? String(meta.preferredDate) : ''
    const dateLine = date ? ` for ${date}` : ''
    const subject = '[PG Macedonia] We received your tandem booking'
    const text = [
      greeting,
      '',
      `Thank you for your tandem flight booking request${dateLine}.`,
      `Chosen option: ${program}.`,
      '',
      'We will get back to you within a few hours (usually much sooner) to confirm availability, the exact meeting point and the weather outlook.',
      '',
      'If your plans change, just reply to this email.',
      '',
      'Blue skies,',
      'PG Macedonia',
      'https://pgmacedonia.mk',
    ].join('\n')
    const html = `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937;line-height:1.55">
<p>${escapeHtml(greeting)}</p>
<p>Thank you for your tandem flight booking request${dateLine ? ` <b>${escapeHtml(dateLine.trim())}</b>` : ''}.</p>
<p>Chosen option: <b>${escapeHtml(program)}</b>.</p>
<p>We will get back to you within a few hours (usually much sooner) to confirm availability, the exact meeting point and the weather outlook. If your plans change, just reply to this email.</p>
<p style="margin-top:24px">Blue skies,<br/><b>PG Macedonia</b><br/><a href="https://pgmacedonia.mk">pgmacedonia.mk</a></p>
</body></html>`
    return { subject, text, html }
  }

  if (payload.kind === 'guiding') {
    const subject = '[PG Macedonia] We received your guiding inquiry'
    const text = [
      greeting,
      '',
      'Thanks for your XC guiding inquiry. We will reply shortly with availability and next steps.',
      '',
      'Blue skies,',
      'PG Macedonia',
    ].join('\n')
    const html = `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937;line-height:1.55">
<p>${escapeHtml(greeting)}</p>
<p>Thanks for your XC guiding inquiry. We will reply shortly with availability and next steps.</p>
<p style="margin-top:24px">Blue skies,<br/><b>PG Macedonia</b></p>
</body></html>`
    return { subject, text, html }
  }

  const subject = '[PG Macedonia] We received your message'
  const text = [greeting, '', 'Thanks for reaching out. We will get back to you shortly.', '', 'PG Macedonia'].join(
    '\n',
  )
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937;line-height:1.55">
<p>${escapeHtml(greeting)}</p>
<p>Thanks for reaching out. We will get back to you shortly.</p>
<p style="margin-top:24px"><b>PG Macedonia</b></p>
</body></html>`
  return { subject, text, html }
}

export interface SendOptions {
  replyTo?: string
}

export async function sendNotification(
  to: string,
  subject: string,
  text: string,
  html: string,
  options: SendOptions = {},
): Promise<void> {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM ?? user ?? 'noreply@pgmacedonia.mk'

  if (!host || !user || !pass) {
    console.warn(
      '[mail] SMTP NOT configured — email will NOT be delivered. ' +
        'Set SMTP_HOST, SMTP_USER and SMTP_PASS in a .env file at the project root, then restart the API.',
    )
    console.info('  (intended) To:', to)
    console.info('  (intended) Subject:', subject)
    console.info(text)
    return
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    })
    console.info(`[mail] sent → ${to} (id=${info.messageId})`)
  } catch (err) {
    console.error('[mail] FAILED to send:', err)
    throw err
  }
}

/** Logs once at startup whether the mail pipeline is wired up. */
export function logMailConfigStatus(): void {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (host && user && pass) {
    console.info(`[mail] SMTP configured: host=${host} user=${user}`)
  } else {
    console.warn(
      '[mail] SMTP is NOT configured. Submissions will succeed in the UI but NO email will be sent. ' +
        'Create a .env file with SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.',
    )
  }
}
