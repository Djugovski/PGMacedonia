import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'

export const CALENDAR_FILE = new URL('./data/calendar.json', import.meta.url)

function calendarPath() {
  return fileURLToPath(CALENDAR_FILE)
}

export interface ConfirmedRange {
  id: string
  start: string
  end: string
  note?: string
  email?: string
}

export interface PendingRequest {
  id: string
  token: string
  start: string
  end: string
  firstName: string
  lastName?: string
  email: string
  phone?: string
  message?: string
  createdAt: string
}

export interface CalendarState {
  unavailable: string[]
  confirmed: ConfirmedRange[]
  pending: PendingRequest[]
}

async function ensureFileDir() {
  await mkdir(dirname(calendarPath()), { recursive: true })
}

export async function loadCalendar(): Promise<CalendarState> {
  try {
    const raw = await readFile(calendarPath(), 'utf-8')
    const data = JSON.parse(raw) as CalendarState
    return {
      unavailable: Array.isArray(data.unavailable) ? data.unavailable : [],
      confirmed: Array.isArray(data.confirmed) ? data.confirmed : [],
      pending: Array.isArray(data.pending) ? data.pending : [],
    }
  } catch {
    return { unavailable: [], confirmed: [], pending: [] }
  }
}

export async function saveCalendar(state: CalendarState): Promise<void> {
  await ensureFileDir()
  await writeFile(calendarPath(), JSON.stringify(state, null, 2), 'utf-8')
}

export function newId(): string {
  return randomBytes(12).toString('hex')
}

export function newToken(): string {
  return randomBytes(24).toString('hex')
}

/** Inclusive date range [start, end] — each YYYY-MM-DD */
export function datesInInclusiveRange(start: string, end: string): string[] {
  const out: string[] = []
  const [ys, ms, ds] = start.split('-').map(Number)
  const [ye, me, de] = end.split('-').map(Number)
  const from = new Date(Date.UTC(ys, ms - 1, ds))
  const to = new Date(Date.UTC(ye, me - 1, de))
  if (from > to) return out
  const cur = new Date(from)
  while (cur <= to) {
    out.push(cur.toISOString().slice(0, 10))
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  return out
}

export function eachDayInMonth(year: number, month: number): string[] {
  const out: string[] = []
  const cur = new Date(Date.UTC(year, month - 1, 1))
  while (cur.getUTCMonth() === month - 1) {
    out.push(cur.toISOString().slice(0, 10))
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  return out
}

export function dayStateForMonth(
  year: number,
  month: number,
  state: CalendarState,
): Record<string, 'available' | 'booked' | 'unavailable'> {
  const days = eachDayInMonth(year, month)
  const unavailable = new Set(state.unavailable)
  const booked = new Set<string>()
  for (const c of state.confirmed) {
    for (const d of datesInInclusiveRange(c.start, c.end)) {
      booked.add(d)
    }
  }
  const result: Record<string, 'available' | 'booked' | 'unavailable'> = {}
  for (const d of days) {
    if (unavailable.has(d)) result[d] = 'unavailable'
    else if (booked.has(d)) result[d] = 'booked'
    else result[d] = 'available'
  }
  return result
}

export function overlapsConfirmed(start: string, end: string, state: CalendarState): boolean {
  const req = new Set(datesInInclusiveRange(start, end))
  for (const c of state.confirmed) {
    for (const d of datesInInclusiveRange(c.start, c.end)) {
      if (req.has(d)) return true
    }
  }
  return false
}

export function touchesUnavailable(start: string, end: string, state: CalendarState): boolean {
  const req = datesInInclusiveRange(start, end)
  const un = new Set(state.unavailable)
  return req.some((d) => un.has(d))
}
