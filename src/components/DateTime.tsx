import type { TimeHTMLAttributes } from 'react'

/**
 * Dates and times in the viewer's own time zone and locale (D-25). The
 * backends store instants in UTC as ISO 8601, sometimes without an offset
 * (house-backend's tokens: "2026-10-02T15:17:27.440510"); such a string is
 * read as UTC, never as local time. A bare date ("2026-11-19") is a
 * calendar day, not an instant, and is shown as that day.
 */
export type DateTimeStyle = 'datetime' | 'datetime-seconds' | 'date' | 'time' | 'time-seconds'

export type DateTimeValue = string | number | Date | null | undefined

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/
// An ISO date-time with no offset and no "Z": the backends mean UTC.
const NO_OFFSET = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/

const OPTIONS: Record<DateTimeStyle, Intl.DateTimeFormatOptions> = {
  datetime: { dateStyle: 'short', timeStyle: 'short' },
  'datetime-seconds': { dateStyle: 'short', timeStyle: 'medium' },
  date: { dateStyle: 'short' },
  time: { timeStyle: 'short' },
  'time-seconds': { timeStyle: 'medium' },
}

/**
 * The instant a value names, or null when it names none. Numbers are
 * milliseconds since the epoch; a bare date is local midnight of that day.
 */
export function toInstant(value: DateTimeValue): Date | null {
  if (value == null || value === '') return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value === 'number') return new Date(value)
  const day = DATE_ONLY.exec(value)
  if (day) return new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3]))
  const iso = NO_OFFSET.test(value) ? `${value.replace(' ', 'T')}Z` : value
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * A value as the viewer reads a date and time: their time zone, their
 * locale's order. `fallback` for no value; text that is not a date comes
 * back as it is.
 */
export function formatDateTime(value: DateTimeValue, style: DateTimeStyle = 'datetime', fallback = '—'): string {
  const d = toInstant(value)
  if (d == null) return value == null || value === '' ? fallback : String(value)
  const opts = typeof value === 'string' && DATE_ONLY.test(value) ? OPTIONS.date : OPTIONS[style]
  return d.toLocaleString(undefined, opts)
}

/** The full form, with the time-zone name: the hover of a `DateTime`. */
export function formatDateTimeFull(value: DateTimeValue): string {
  const d = toInstant(value)
  if (d == null) return ''
  if (typeof value === 'string' && DATE_ONLY.test(value)) return d.toLocaleDateString(undefined, { dateStyle: 'full' })
  return d.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'long' })
}

export interface DateTimeProps extends Omit<TimeHTMLAttributes<HTMLTimeElement>, 'children' | 'dateTime'> {
  value: DateTimeValue
  /** What to show: date and time (the default), with seconds, the date or the time. */
  format?: DateTimeStyle
  /** Shown when there is no value. */
  fallback?: string
}

/**
 * A `<time>` in the viewer's time zone; hovering it shows the full date
 * with the zone's name. Use it (or `formatDateTime` inside text) for every
 * date or time on a page — never the stored string.
 */
export function DateTime({ value, format = 'datetime', fallback = '—', title, ...rest }: DateTimeProps) {
  const d = toInstant(value)
  if (d == null) return <>{value == null || value === '' ? fallback : String(value)}</>
  return (
    <time dateTime={d.toISOString()} title={title ?? formatDateTimeFull(value)} {...rest}>
      {formatDateTime(value, format, fallback)}
    </time>
  )
}
