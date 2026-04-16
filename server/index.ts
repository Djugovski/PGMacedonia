import express from 'express'
import cors from 'cors'
import {
  loadCalendar,
  saveCalendar,
  newId,
  newToken,
  dayStateForMonth,
  overlapsConfirmed,
  touchesUnavailable,
  type PendingRequest,
} from './calendar-store'
import { formatContactEmail, sendNotification } from './mail'

const PORT = Number(process.env.API_PORT ?? '8787')
const CONTACT_TO = process.env.CONTACT_TO_EMAIL ?? 'dorian_dzugovski@live.com'
const APP_PUBLIC_URL = (process.env.APP_PUBLIC_URL ?? 'http://localhost:5173').replace(/\/$/, '')
const CALENDAR_ADMIN_SECRET = process.env.CALENDAR_ADMIN_SECRET ?? ''

const app = express()
app.use(
  cors({
    origin: [/localhost:\d+$/, /127\.0\.0\.1:\d+$/, /pgmacedonia\.mk$/],
    credentials: true,
  }),
)
app.use(express.json({ limit: '128kb' }))

function validateCaptcha(a: unknown, b: unknown): boolean {
  return typeof a === 'number' && typeof b === 'number' && a === b
}

app.post('/api/contact', async (req, res) => {
  try {
    const body = req.body as Record<string, unknown>
    const captchaOk = validateCaptcha(body.captchaAnswer, body.captchaExpected)
    if (!captchaOk) {
      res.status(400).json({ error: 'Invalid captcha' })
      return
    }

    const { captchaAnswer: _a, captchaExpected: _b, ...rest } = body
    const { subject, text, html } = formatContactEmail(rest)

    await sendNotification(CONTACT_TO, subject, text, html)
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

app.get('/api/calendar', async (req, res) => {
  try {
    const year = Number(req.query.year)
    const month = Number(req.query.month)
    if (!year || !month || month < 1 || month > 12) {
      res.status(400).json({ error: 'year and month (1-12) required' })
      return
    }
    const state = await loadCalendar()
    const days = dayStateForMonth(year, month, state)
    res.json({ year, month, days })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Calendar error' })
  }
})

app.post('/api/calendar/request', async (req, res) => {
  try {
    const body = req.body as Record<string, unknown>
    if (!validateCaptcha(body.captchaAnswer, body.captchaExpected)) {
      res.status(400).json({ error: 'Invalid captcha' })
      return
    }

    const start = String(body.start ?? '')
    const end = String(body.end ?? '')
    const firstName = String(body.firstName ?? '').trim()
    const email = String(body.email ?? '').trim()
    const phone = body.phone != null ? String(body.phone).trim() : ''
    const message = body.message != null ? String(body.message).trim() : ''
    const lastName = body.lastName != null ? String(body.lastName).trim() : ''

    if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
      res.status(400).json({ error: 'Invalid dates' })
      return
    }
    if (start > end) {
      res.status(400).json({ error: 'End date must be on or after start' })
      return
    }
    if (!firstName || !email) {
      res.status(400).json({ error: 'Name and email required' })
      return
    }

    const state = await loadCalendar()
    if (touchesUnavailable(start, end, state)) {
      res.status(409).json({ error: 'Selected dates include unavailable days' })
      return
    }
    if (overlapsConfirmed(start, end, state)) {
      res.status(409).json({ error: 'Selected dates overlap an existing booking' })
      return
    }

    const pending: PendingRequest = {
      id: newId(),
      token: newToken(),
      start,
      end,
      firstName,
      lastName: lastName || undefined,
      email,
      phone: phone || undefined,
      message: message || undefined,
      createdAt: new Date().toISOString(),
    }

    state.pending.push(pending)
    await saveCalendar(state)

    const confirmPath = `/calendar/confirm?token=${encodeURIComponent(pending.token)}`
    const confirmUrl = `${APP_PUBLIC_URL}${confirmPath}`

    const text = [
      'New accommodation / guiding calendar request',
      '',
      `Dates: ${start} → ${end}`,
      `Name: ${firstName} ${lastName}`.trim(),
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : '',
      message ? `Message: ${message}` : '',
      '',
      `Approve (confirms booking & blocks dates):`,
      confirmUrl,
      '',
      'If you did not expect this message, ignore it.',
    ]
      .filter(Boolean)
      .join('\n')

    const html = `<p>New calendar request</p>
<ul>
<li><b>Dates:</b> ${start} → ${end}</li>
<li><b>Name:</b> ${firstName} ${lastName}</li>
<li><b>Email:</b> ${email}</li>
${phone ? `<li><b>Phone:</b> ${phone}</li>` : ''}
${message ? `<li><b>Message:</b> ${message}</li>` : ''}
</ul>
<p><a href="${confirmUrl}">Click to approve and reserve these dates</a></p>
<p>Or open: <code>${confirmUrl}</code></p>`

    await sendNotification(
      CONTACT_TO,
      '[PG Macedonia] Calendar request — approval needed',
      text,
      html,
    )

    res.json({ ok: true, id: pending.id })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to save request' })
  }
})

app.get('/api/calendar/confirm', async (req, res) => {
  try {
    const token = String(req.query.token ?? '')
    if (!token) {
      res.status(400).json({ error: 'Missing token' })
      return
    }

    const state = await loadCalendar()
    const idx = state.pending.findIndex((p) => p.token === token)
    if (idx === -1) {
      res.status(404).json({ error: 'Invalid or already processed link' })
      return
    }

    const p = state.pending[idx]!
    if (overlapsConfirmed(p.start, p.end, state)) {
      res.status(409).json({ error: 'Dates are no longer available' })
      return
    }
    if (touchesUnavailable(p.start, p.end, state)) {
      res.status(409).json({ error: 'Dates include unavailable days' })
      return
    }

    state.pending.splice(idx, 1)
    state.confirmed.push({
      id: p.id,
      start: p.start,
      end: p.end,
      note: 'Approved from web request',
      email: p.email,
    })
    await saveCalendar(state)

    const guestSubject = '[PG Macedonia] Your dates are confirmed'
    const guestText = `Hi ${p.firstName},\n\nYour requested stay (${p.start} → ${p.end}) has been confirmed.\n\nWe will follow up with details.\n`
    const guestHtml = `<p>Hi ${p.firstName},</p><p>Your requested stay <b>${p.start}</b> → <b>${p.end}</b> has been confirmed.</p><p>We will follow up with details.</p>`
    await sendNotification(p.email, guestSubject, guestText, guestHtml).catch((err) =>
      console.error('Guest notify failed', err),
    )

    res.json({ ok: true, message: 'Booking confirmed and calendar updated.' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Confirm failed' })
  }
})

/** Owner tools: set unavailable YYYY-MM-DD list (replace), optional confirmed add — protected by secret */
app.post('/api/calendar/admin', async (req, res) => {
  try {
    const secret = String(req.headers['x-calendar-admin-secret'] ?? '')
    if (!CALENDAR_ADMIN_SECRET || secret !== CALENDAR_ADMIN_SECRET) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const body = req.body as {
      unavailable?: string[]
      addConfirmed?: { start: string; end: string; note?: string }
    }
    const state = await loadCalendar()

    if (Array.isArray(body.unavailable)) {
      state.unavailable = [...new Set(body.unavailable.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)))]
    }

    if (body.addConfirmed?.start && body.addConfirmed?.end) {
      const { start, end } = body.addConfirmed
      if (start <= end) {
        state.confirmed.push({
          id: newId(),
          start,
          end,
          note: body.addConfirmed.note,
        })
      }
    }

    await saveCalendar(state)
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Admin update failed' })
  }
})

app.listen(PORT, () => {
  console.info(`[api] listening on http://localhost:${PORT}`)
  console.info(`[api] contact mail → ${CONTACT_TO}`)
})
