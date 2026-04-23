import './env'
import express, { Router, type Request, type RequestHandler } from 'express'
import cors, { type CorsOptions } from 'cors'
import rateLimit from 'express-rate-limit'
import type { ZodSchema } from 'zod'
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
import {
  formatContactEmail,
  formatGuestAutoReply,
  logMailConfigStatus,
  sendNotification,
} from './mail'
import { validateMathCaptcha } from './captcha'
import { CalendarRequestSchema, ContactPayloadSchema } from './validation'
import { getSharedMedia, invalidateGalleryCache, logNextcloudStatus } from './nextcloud'

/**
 * PORT resolution order:
 *   1. API_PORT  (set explicitly in .env for local dev / Docker / Render blueprint)
 *   2. PORT      (Passenger / Heroku-style platforms inject this)
 *   3. 8787      (local default)
 */
const PORT = Number(process.env.API_PORT ?? process.env.PORT ?? '8787')
const CONTACT_TO = process.env.CONTACT_TO_EMAIL ?? 'contact@pgmacedonia.mk'
const APP_PUBLIC_URL = (process.env.APP_PUBLIC_URL ?? 'http://localhost:5173').replace(/\/$/, '')
const CALENDAR_ADMIN_SECRET = process.env.CALENDAR_ADMIN_SECRET ?? ''
const TRUST_PROXY = (process.env.TRUST_PROXY ?? '').toLowerCase() === 'true'

/**
 * Mount path for the API routes (default `/api`).
 *
 * Set to `/` (or empty) when running behind a reverse proxy that already
 * strips the `/api` prefix — e.g. cPanel's Passenger when "Application URL"
 * is configured as `/api`. In that case routes are accessed externally as
 * `https://site.tld/api/contact` but arrive at this server as `/contact`.
 */
const API_PATH_PREFIX = (() => {
  const raw = process.env.API_PATH_PREFIX ?? '/api'
  if (!raw || raw === '/') return ''
  return raw.startsWith('/') ? raw.replace(/\/$/, '') : `/${raw.replace(/\/$/, '')}`
})()

const app = express()

if (TRUST_PROXY) app.set('trust proxy', 1)

/* ------------------------------------------------------------------ */
/* CORS — explicit allow-list, no regex footguns                       */
/* ------------------------------------------------------------------ */

const allowedOrigins = new Set<string>([
  'https://pgmacedonia.mk',
  'https://www.pgmacedonia.mk',
  ...(process.env.EXTRA_CORS_ORIGINS?.split(',').map((s) => s.trim()).filter(Boolean) ?? []),
])
const devOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    // Same-origin / curl / server-to-server: no Origin header. Allow.
    if (!origin) return cb(null, true)
    if (allowedOrigins.has(origin)) return cb(null, true)
    if (devOriginPattern.test(origin)) return cb(null, true)
    console.warn(`[cors] blocked origin: ${origin}`)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: false,
}
app.use(cors(corsOptions))
app.use(express.json({ limit: '64kb' }))

/* ------------------------------------------------------------------ */
/* Rate limiting                                                       */
/* ------------------------------------------------------------------ */

const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many submissions — please try again later.' },
})

const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function parseBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const first = result.error.issues[0]
      res.status(400).json({
        error: 'Invalid request',
        field: first?.path.join('.'),
        detail: first?.message,
      })
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(req as any).validated = result.data
    next()
  }
}

function validated<T>(req: Request): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req as any).validated as T
}

/* ------------------------------------------------------------------ */
/* Routes — mounted on a Router so the path prefix is configurable     */
/* ------------------------------------------------------------------ */

const api = Router()

api.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'pgmacedonia-api' })
})

api.get('/gallery', readLimiter, async (_req, res) => {
  try {
    const items = await getSharedMedia()
    res.json({ items })
  } catch (e) {
    console.error('[gallery] fetch failed:', e)
    // Never fail the client — the SPA falls back to bundled images.
    res.json({ items: [] })
  }
})

// Optional admin hook: force re-read the Nextcloud share (handy for the
// "I just uploaded — why isn't it live yet?" case, without restarting).
api.post('/gallery/refresh', (req, res) => {
  const secret = String(req.headers['x-calendar-admin-secret'] ?? '')
  if (!CALENDAR_ADMIN_SECRET || secret !== CALENDAR_ADMIN_SECRET) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  invalidateGalleryCache()
  res.json({ ok: true })
})

api.post(
  '/contact',
  submitLimiter,
  parseBody(ContactPayloadSchema),
  async (req, res) => {
    try {
      const body = validated<import('./validation').ContactPayload>(req)

      const captcha = validateMathCaptcha(body)
      if (!captcha.ok) {
        res.status(400).json({ error: 'Captcha verification failed', reason: captcha.reason })
        return
      }

      // Strip captcha fields before formatting — they don't belong in the email.
      const { captchaQuestion: _cq, captchaAnswer: _ca, ...rest } = body
      const { subject, text, html } = formatContactEmail(rest)

      await sendNotification(CONTACT_TO, subject, text, html, {
        replyTo: body.email,
      })

      const autoReply = formatGuestAutoReply(rest)
      if (autoReply) {
        sendNotification(body.email, autoReply.subject, autoReply.text, autoReply.html, {
          replyTo: CONTACT_TO,
        }).catch((err) => console.error('[mail] auto-reply failed:', err))
      }

      res.json({ ok: true })
    } catch (e) {
      console.error('[contact] error:', e)
      res.status(500).json({ error: 'Failed to send message' })
    }
  },
)

api.get('/calendar', readLimiter, async (req, res) => {
  try {
    const year = Number(req.query.year)
    const month = Number(req.query.month)
    if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
      res.status(400).json({ error: 'year and month (1-12) required' })
      return
    }
    const state = await loadCalendar()
    const days = dayStateForMonth(year, month, state)
    res.json({ year, month, days })
  } catch (e) {
    console.error('[calendar] error:', e)
    res.status(500).json({ error: 'Calendar error' })
  }
})

api.post(
  '/calendar/request',
  submitLimiter,
  parseBody(CalendarRequestSchema),
  async (req, res) => {
    try {
      const body = validated<import('./validation').CalendarRequestBody>(req)

      const captcha = validateMathCaptcha(body)
      if (!captcha.ok) {
        res.status(400).json({ error: 'Captcha verification failed', reason: captcha.reason })
        return
      }

      const state = await loadCalendar()
      if (touchesUnavailable(body.start, body.end, state)) {
        res.status(409).json({ error: 'Selected dates include unavailable days' })
        return
      }
      if (overlapsConfirmed(body.start, body.end, state)) {
        res.status(409).json({ error: 'Selected dates overlap an existing booking' })
        return
      }

      const pending: PendingRequest = {
        id: newId(),
        token: newToken(),
        start: body.start,
        end: body.end,
        firstName: body.firstName,
        lastName: body.lastName || undefined,
        email: body.email,
        phone: body.phone || undefined,
        message: body.message || undefined,
        createdAt: new Date().toISOString(),
      }

      state.pending.push(pending)
      await saveCalendar(state)

      const confirmPath = `/calendar/confirm?token=${encodeURIComponent(pending.token)}`
      const confirmUrl = `${APP_PUBLIC_URL}${confirmPath}`

      const text = [
        'New accommodation / guiding calendar request',
        '',
        `Dates: ${body.start} → ${body.end}`,
        `Name: ${body.firstName} ${body.lastName ?? ''}`.trim(),
        `Email: ${body.email}`,
        body.phone ? `Phone: ${body.phone}` : '',
        body.message ? `Message: ${body.message}` : '',
        '',
        'Approve (confirms booking & blocks dates):',
        confirmUrl,
      ]
        .filter(Boolean)
        .join('\n')

      const html = `<p>New calendar request</p>
<ul>
<li><b>Dates:</b> ${body.start} → ${body.end}</li>
<li><b>Name:</b> ${body.firstName} ${body.lastName ?? ''}</li>
<li><b>Email:</b> ${body.email}</li>
${body.phone ? `<li><b>Phone:</b> ${body.phone}</li>` : ''}
${body.message ? `<li><b>Message:</b> ${body.message}</li>` : ''}
</ul>
<p><a href="${confirmUrl}">Click to approve and reserve these dates</a></p>
<p>Or open: <code>${confirmUrl}</code></p>`

      await sendNotification(
        CONTACT_TO,
        '[PG Macedonia] Calendar request — approval needed',
        text,
        html,
        { replyTo: body.email },
      )

      res.json({ ok: true, id: pending.id })
    } catch (e) {
      console.error('[calendar request] error:', e)
      res.status(500).json({ error: 'Failed to save request' })
    }
  },
)

api.get('/calendar/confirm', readLimiter, async (req, res) => {
  try {
    const token = String(req.query.token ?? '')
    if (!token || token.length > 200) {
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
    await sendNotification(p.email, guestSubject, guestText, guestHtml, {
      replyTo: CONTACT_TO,
    }).catch((err) => console.error('Guest notify failed', err))

    res.json({ ok: true, message: 'Booking confirmed and calendar updated.' })
  } catch (e) {
    console.error('[calendar confirm] error:', e)
    res.status(500).json({ error: 'Confirm failed' })
  }
})

/** Owner tools — set unavailable YYYY-MM-DD list (replace), optional confirmed add. */
api.post('/calendar/admin', async (req, res) => {
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
      state.unavailable = [
        ...new Set(body.unavailable.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))),
      ]
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
    console.error('[admin] error:', e)
    res.status(500).json({ error: 'Admin update failed' })
  }
})

// Mount everything at the configured prefix (default /api).
app.use(API_PATH_PREFIX || '/', api)

app.listen(PORT, () => {
  const mountNote = API_PATH_PREFIX ? `mount=${API_PATH_PREFIX}` : 'mount=/ (Passenger-style prefix stripping)'
  console.info(`[api] listening on http://localhost:${PORT} (${mountNote})`)
  console.info(`[api] contact mail → ${CONTACT_TO}`)
  console.info(`[api] CORS allow-list: ${[...allowedOrigins].join(', ') || '(dev only)'}`)
  logMailConfigStatus()
  logNextcloudStatus()
})

export { app }
