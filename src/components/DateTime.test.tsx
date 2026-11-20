import { render, screen } from '@testing-library/react'
import { DateTime, formatDateTime, toInstant } from './DateTime'

// The viewer is in Los Angeles for these tests: the formatter must convert
// UTC to it (Node re-reads TZ when it changes).
process.env.TZ = 'America/Los_Angeles'
describe('DateTime (D-25)', () => {
  it('reads a stored timestamp without an offset as UTC', () => {
    expect(toInstant('2026-11-20T03:46:35.918387')?.toISOString()).toBe('2026-11-20T03:46:35.918Z')
    expect(toInstant('2026-11-20 03:46')?.toISOString()).toBe('2026-11-20T03:46:00.000Z')
    expect(toInstant('2026-11-20T03:46:35+00:00')?.toISOString()).toBe('2026-11-20T03:46:35.000Z')
    expect(toInstant('2026-11-20T03:46:35Z')?.toISOString()).toBe('2026-11-20T03:46:35.000Z')
  })

  it('shows the instant in the viewer’s time zone', () => {
    // 03:46 UTC is 19:46 the day before in Los Angeles (PST, UTC-8).
    const expected = new Date(Date.UTC(2026, 10, 20, 3, 46)).toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    })
    expect(formatDateTime('2026-11-20T03:46:35+00:00')).toBe(expected)
    expect(formatDateTime('2026-11-20T03:46:35')).toBe(expected)
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe('America/Los_Angeles')
    expect(formatDateTime('2026-11-20T03:46:35Z', 'time')).toMatch(/7:46/)
    expect(formatDateTime('2026-11-20T03:46:35Z', 'date')).toMatch(/19/)
  })

  it('keeps a bare date on its day, and passes through what is not a date', () => {
    const day = toInstant('2026-11-19')!
    expect([day.getFullYear(), day.getMonth(), day.getDate()]).toEqual([2026, 10, 19])
    expect(formatDateTime('2026-11-19', 'datetime')).toBe(day.toLocaleDateString(undefined, { dateStyle: 'short' }))
    expect(formatDateTime(null)).toBe('—')
    expect(formatDateTime(undefined, 'datetime', '')).toBe('')
    expect(formatDateTime('never')).toBe('never')
  })

  it('renders a <time> with the instant and a full hover', () => {
    render(<DateTime value="2026-11-20T03:46:35Z" data-testid="t" />)
    const t = screen.getByTestId('t')
    expect(t.tagName).toBe('TIME')
    expect(t).toHaveAttribute('datetime', '2026-11-20T03:46:35.000Z')
    expect(t.getAttribute('title')).toBeTruthy()
    render(<DateTime value={null} fallback="never" />)
    expect(screen.getByText('never')).toBeInTheDocument()
  })
})
