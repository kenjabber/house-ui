import { useState } from 'react'
import { cx } from '../cx'

/** A column whose values become on/off chips. */
export interface ChipColumn<R> {
  /** Shown before the chips. */
  name: string
  /** The row's value in this column. Values are grouped regardless of case. */
  value: (row: R) => string
}

export interface TableFilterOptions<R> {
  /** The row's text the box searches (every typed word must appear). */
  text: (row: R) => string
  /** Columns that get a row of chips. */
  chips?: ChipColumn<R>[]
}

export interface ChipState {
  value: string
  /** Rows with this value that pass the text and the other columns' chips. */
  count: number
  on: boolean
}

export interface TableFilterState<R> {
  query: string
  setQuery: (q: string) => void
  /** Every row. */
  rows: R[]
  /** The rows that pass the box and the chips, in order. */
  visible: R[]
  columns: { name: string; chips: ChipState[] }[]
  /** Switch one value's rows off or on. */
  toggle: (column: number, value: string) => void
  /** Show only this value's rows, or all of them again if that is already so. */
  only: (column: number, value: string) => void
  /** Clear the box and switch every chip on. */
  reset: () => void
  /** True when anything is filtered out. */
  active: boolean
}

/**
 * The filter's logic, for any kind of row: objects in a React table, or DOM
 * rows (kwicky). Render it with `<TableFilter filter={...} />` and show
 * `filter.visible`.
 */
export function useTableFilter<R>(rows: R[], options: TableFilterOptions<R>): TableFilterState<R> {
  const [query, setQuery] = useState('')
  // Per column name, the lower-cased values switched off.
  const [off, setOff] = useState<Record<string, string[]>>({})
  const specs = options.chips ?? []

  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const texts = rows.map((r) => options.text(r).replace(/\s+/g, ' ').toLowerCase())
  const keys = rows.map((r) => specs.map((c) => c.value(r).trim().toLowerCase()))
  const matchesText = (i: number) => words.every((w) => texts[i].includes(w))
  const passesChips = (i: number, except = -1) =>
    specs.every((c, ci) => ci === except || !(off[c.name] ?? []).includes(keys[i][ci]))

  const columns = specs.map((c, ci) => {
    const spellings = new Map<string, string>() // key -> first spelling met
    rows.forEach((r, i) => {
      if (!spellings.has(keys[i][ci])) spellings.set(keys[i][ci], c.value(r).trim())
    })
    const chips: ChipState[] = Array.from(spellings, ([key, value]) => ({
      value,
      on: !(off[c.name] ?? []).includes(key),
      count: rows.filter((_, i) => keys[i][ci] === key && matchesText(i) && passesChips(i, ci)).length,
    }))
    return { name: c.name, chips }
  })

  const visible = rows.filter((_, i) => matchesText(i) && passesChips(i))

  const toggle = (column: number, value: string) => {
    const name = specs[column]?.name
    if (!name) return
    const key = value.toLowerCase()
    setOff((prev) => {
      const cur = prev[name] ?? []
      return { ...prev, [name]: cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key] }
    })
  }
  const only = (column: number, value: string) => {
    const name = specs[column]?.name
    if (!name) return
    const key = value.toLowerCase()
    const others = Array.from(new Set(keys.map((k) => k[column]))).filter((k) => k !== key)
    setOff((prev) => {
      const cur = prev[name] ?? []
      const alreadyOnly = !cur.includes(key) && others.every((k) => cur.includes(k))
      return { ...prev, [name]: alreadyOnly ? [] : others }
    })
  }
  const reset = () => {
    setQuery('')
    setOff({})
  }
  const active = words.length > 0 || Object.values(off).some((v) => v.length > 0)

  return { query, setQuery, rows, visible, columns, toggle, only, reset, active }
}

/**
 * The text before any `(` note, collapsed and trimmed, or "—" when empty: so
 * `needs Ken (the token)` groups with `needs Ken`.
 */
export function chipValue(text: string): string {
  return text.split('(')[0].replace(/\s+/g, ' ').trim() || '—'
}

export interface TableFilterProps {
  filter: TableFilterState<unknown>
  /** The box's placeholder. Default "Filter rows…". */
  placeholder?: string
  /** What a row is called in the count. Default "rows". */
  noun?: string
  className?: string
}

/** The filter bar above a table: box, count, Show all, and the chip rows. */
export function TableFilter({ filter, placeholder = 'Filter rows…', noun = 'rows', className }: TableFilterProps) {
  const total = filter.rows.length
  const shown = filter.visible.length
  return (
    <div className={cx('hu-table-filter', className)}>
      <div className="hu-table-filter__bar">
        <input
          type="search"
          className="hu-table-filter__input"
          placeholder={placeholder}
          aria-label={`Filter the table's ${noun}`}
          value={filter.query}
          onChange={(e) => filter.setQuery(e.target.value)}
        />
        <span className="hu-table-filter__count" aria-live="polite">
          {shown === total ? `${total} ${noun}` : `${shown} of ${total} ${noun}`}
        </span>
        {filter.active && (
          <button type="button" className="hu-btn hu-btn--link" onClick={filter.reset}>
            Show all
          </button>
        )}
      </div>
      {filter.columns.map((c, ci) => (
        <div key={c.name} className="hu-table-filter__chips" role="group" aria-label={`${c.name} values`}>
          <span className="hu-table-filter__chips-label">{c.name}</span>
          {c.chips.map((chip) => (
            <button
              key={chip.value}
              type="button"
              className={cx('hu-table-filter__chip', chip.on && 'hu-table-filter__chip--on')}
              aria-pressed={chip.on}
              title={`${chip.on ? 'Hide' : 'Show'} these ${noun} (shift-click: show only these)`}
              onClick={(e) => (e.shiftKey ? filter.only(ci, chip.value) : filter.toggle(ci, chip.value))}
            >
              {chip.value}
              <span className="hu-table-filter__chip-count">{chip.count}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
