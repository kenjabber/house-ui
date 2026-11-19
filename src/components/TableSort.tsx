import { useState, type ReactNode, type ThHTMLAttributes } from 'react'
import { cx } from '../cx'

export type SortDir = 'asc' | 'desc'

/** Which column the rows are sorted by, and which way. */
export interface TableSort {
  key: string
  dir: SortDir
}

/** What a column sorts by: usually what its cell shows. */
export type SortValue = string | number | boolean | Date | null | undefined

export interface TableSortOptions<R> {
  /** The columns that sort, by key: each gives a row's value in it. */
  columns: Record<string, (row: R) => SortValue>
  /** The sort before any click. Default none: the rows' own order. */
  initial?: TableSort | null
  /** Remember the sort in this browser (localStorage) under this key. */
  storageKey?: string
}

/** What a SortHeader needs: an app keeping its own sort state can supply just this. */
export interface SortControl {
  /** The direction a column is sorted in, or null. */
  dirOf: (key: string) => SortDir | null
  /** A header click: ascending, then descending, then the rows' own order. */
  cycle: (key: string) => void
}

export interface TableSortState<R> extends SortControl {
  /** The rows in the chosen order (a copy; the rows given are not reordered). */
  sorted: R[]
  /** The sort in effect, or null for the rows' own order. */
  sort: TableSort | null
  setSort: (sort: TableSort | null) => void
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

const isEmpty = (v: SortValue) => v == null || v === '' || (typeof v === 'number' && Number.isNaN(v))

const comparable = (v: SortValue): string | number =>
  v instanceof Date ? v.getTime() : typeof v === 'boolean' ? Number(v) : (v as string | number)

/**
 * Natural order: numbers (and dates, booleans) numerically, text without
 * regard to case and with digit runs compared as numbers (ether2 < ether10,
 * 10.0.0.2 < 10.0.0.11). Empty values go last either way.
 */
export function compareSortValues(a: SortValue, b: SortValue, dir: SortDir = 'asc'): number {
  const ea = isEmpty(a)
  const eb = isEmpty(b)
  if (ea || eb) return ea === eb ? 0 : ea ? 1 : -1
  const x = comparable(a)
  const y = comparable(b)
  const c = typeof x === 'number' && typeof y === 'number' ? x - y : collator.compare(String(x), String(y))
  return dir === 'asc' ? c : -c
}

function load(storageKey: string | undefined): TableSort | null | undefined {
  if (!storageKey) return undefined
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw === null) return undefined
    const s = JSON.parse(raw) as TableSort | null
    return s && typeof s.key === 'string' && (s.dir === 'asc' || s.dir === 'desc') ? { key: s.key, dir: s.dir } : null
  } catch {
    return undefined
  }
}

function save(storageKey: string | undefined, sort: TableSort | null) {
  if (!storageKey) return
  try {
    localStorage.setItem(storageKey, JSON.stringify(sort))
  } catch {
    // No storage (a private window, blocked): the sort just is not remembered.
  }
}

/**
 * Click-to-sort for a table: give it the rows (after any filter) and the
 * columns that sort; show `sorted`, and put a `<SortHeader sort={…} column>`
 * on each sortable column. The sort is a view only: the rows are not
 * reordered. Equal values keep the rows' own order.
 */
export function useTableSort<R>(rows: readonly R[], options: TableSortOptions<R>): TableSortState<R> {
  const { columns, storageKey } = options
  const [chosen, setChosen] = useState<TableSort | null>(() => {
    const remembered = load(storageKey)
    return remembered === undefined ? (options.initial ?? null) : remembered
  })
  // A sort on a column that no longer sorts (a remembered one) is ignored.
  const sort = chosen && columns[chosen.key] ? chosen : null
  const value = sort ? columns[sort.key] : undefined
  // Array.prototype.sort is stable: equal values keep the rows' own order.
  const sorted = value && sort ? [...rows].sort((a, b) => compareSortValues(value(a), value(b), sort.dir)) : [...rows]

  const setSort = (next: TableSort | null) => {
    setChosen(next)
    save(storageKey, next)
  }
  const cycle = (key: string) =>
    setSort(sort?.key !== key ? { key, dir: 'asc' } : sort.dir === 'asc' ? { key, dir: 'desc' } : null)
  const dirOf = (key: string) => (sort?.key === key ? sort.dir : null)

  return { sorted, sort, setSort, cycle, dirOf }
}

export interface SortHeaderProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'children'> {
  /** The table's sort: `useTableSort`'s state, or any `SortControl`. */
  sort: SortControl
  /** The column's key in the sort's columns. */
  column: string
  /** The header's text. */
  children: ReactNode
}

/**
 * A `th` that sorts its column on a click: ascending ▲, descending ▼, then
 * the rows' own order (↕). Sets `aria-sort` on the active column.
 */
export function SortHeader({ sort, column, children, ...rest }: SortHeaderProps) {
  const dir = sort.dirOf(column)
  return (
    <th {...rest} aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : undefined}>
      <button type="button" className="hu-sort" onClick={() => sort.cycle(column)}>
        {children}
        <span className={cx('hu-sort__icon', dir && 'hu-sort__icon--active')} aria-hidden="true">
          {dir === 'asc' ? '▲' : dir === 'desc' ? '▼' : '↕'}
        </span>
      </button>
    </th>
  )
}
