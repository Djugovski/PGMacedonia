export type DayState = 'available' | 'booked' | 'unavailable'

export interface CalendarMonthResponse {
  year: number
  month: number
  days: Record<string, DayState>
}

function apiBase(): string {
  const u = import.meta.env.VITE_API_URL?.trim()
  if (u) return u.replace(/\/$/, '')
  if (import.meta.env.DEV) return ''
  return ''
}

export async function fetchCalendarMonth(year: number, month: number): Promise<CalendarMonthResponse> {
  const base = apiBase()
  const url = `${base}/api/calendar?year=${year}&month=${month}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<CalendarMonthResponse>
}

export interface CalendarRequestPayload {
  start: string
  end: string
  firstName: string
  lastName?: string
  email: string
  phone?: string
  message?: string
  captchaAnswer: number
  captchaExpected: number
}

export async function submitCalendarRequest(payload: CalendarRequestPayload): Promise<void> {
  const base = apiBase()
  const res = await fetch(`${base}/api/calendar/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? res.statusText)
  }
}

export async function confirmCalendarToken(token: string): Promise<{ ok: boolean; message?: string }> {
  const base = apiBase()
  const res = await fetch(`${base}/api/calendar/confirm?token=${encodeURIComponent(token)}`)
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; error?: string }
  if (!res.ok) throw new Error(data.error ?? res.statusText)
  return { ok: true, message: data.message }
}
