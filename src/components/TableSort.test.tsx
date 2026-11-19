import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { SortHeader, compareSortValues, useTableSort, type TableSortOptions } from './TableSort'

interface Row {
  name: string
  port: number | null
  up: boolean
}
const ROWS: Row[] = [
  { name: 'ether10', port: 8080, up: true },
  { name: 'Ether2', port: null, up: false },
  { name: 'ether1', port: 22, up: true },
  { name: '', port: 443, up: false },
]
const OPTS: TableSortOptions<Row> = {
  columns: { name: (r) => r.name, port: (r) => r.port, up: (r) => r.up },
}
const names = (rows: Row[]) => rows.map((r) => r.name)

describe('compareSortValues', () => {
  it('orders naturally, without regard to case, empty values last either way', () => {
    const v = ['ether10', '', 'Ether2', null, 'ether1']
    expect([...v].sort((a, b) => compareSortValues(a, b))).toEqual(['ether1', 'Ether2', 'ether10', '', null])
    expect([...v].sort((a, b) => compareSortValues(a, b, 'desc'))).toEqual(['ether10', 'Ether2', 'ether1', '', null])
    expect(['10.0.0.11', '10.0.0.2'].sort((a, b) => compareSortValues(a, b))).toEqual(['10.0.0.2', '10.0.0.11'])
  })

  it('compares numbers, dates and booleans as numbers', () => {
    expect(compareSortValues(9, 10)).toBeLessThan(0)
    expect(compareSortValues(new Date(2026, 1, 1), new Date(2025, 1, 1))).toBeGreaterThan(0)
    expect(compareSortValues(false, true)).toBeLessThan(0)
    expect(compareSortValues(Number.NaN, 1)).toBe(1)
  })
})

describe('useTableSort', () => {
  beforeEach(() => localStorage.clear())

  it('keeps the rows own order until a column is chosen', () => {
    const { result } = renderHook(() => useTableSort(ROWS, OPTS))
    expect(result.current.sort).toBeNull()
    expect(names(result.current.sorted)).toEqual(names(ROWS))
    expect(result.current.sorted).not.toBe(ROWS)
  })

  it('cycles ascending, descending, then the rows own order', () => {
    const { result } = renderHook(() => useTableSort(ROWS, OPTS))
    act(() => result.current.cycle('port'))
    expect(result.current.dirOf('port')).toBe('asc')
    expect(result.current.sorted.map((r) => r.port)).toEqual([22, 443, 8080, null])
    act(() => result.current.cycle('port'))
    expect(result.current.dirOf('port')).toBe('desc')
    expect(result.current.sorted.map((r) => r.port)).toEqual([8080, 443, 22, null])
    act(() => result.current.cycle('port'))
    expect(result.current.sort).toBeNull()
    expect(names(result.current.sorted)).toEqual(names(ROWS))
    act(() => result.current.cycle('port'))
    act(() => result.current.cycle('name'))
    expect(result.current.sort).toEqual({ key: 'name', dir: 'asc' })
    expect(result.current.dirOf('port')).toBeNull()
    expect(names(result.current.sorted)).toEqual(['ether1', 'Ether2', 'ether10', ''])
  })

  it('keeps the rows own order among equal values', () => {
    const { result } = renderHook(() => useTableSort(ROWS, { ...OPTS, initial: { key: 'up', dir: 'desc' } }))
    expect(names(result.current.sorted)).toEqual(['ether10', 'ether1', 'Ether2', ''])
  })

  it('remembers the sort under storageKey, and ignores one on a column that no longer sorts', () => {
    const first = renderHook(() => useTableSort(ROWS, { ...OPTS, storageKey: 'test.sort' }))
    act(() => first.result.current.cycle('port'))
    expect(JSON.parse(localStorage.getItem('test.sort')!)).toEqual({ key: 'port', dir: 'asc' })
    const again = renderHook(() => useTableSort(ROWS, { ...OPTS, storageKey: 'test.sort', initial: { key: 'name', dir: 'asc' } }))
    expect(again.result.current.sort).toEqual({ key: 'port', dir: 'asc' })

    localStorage.setItem('test.sort', JSON.stringify({ key: 'gone', dir: 'asc' }))
    const stale = renderHook(() => useTableSort(ROWS, { ...OPTS, storageKey: 'test.sort' }))
    expect(stale.result.current.sort).toBeNull()
    expect(names(stale.result.current.sorted)).toEqual(names(ROWS))

    // Back to the rows' own order is remembered too, over `initial`.
    act(() => first.result.current.setSort(null))
    const cleared = renderHook(() => useTableSort(ROWS, { ...OPTS, storageKey: 'test.sort', initial: { key: 'name', dir: 'asc' } }))
    expect(cleared.result.current.sort).toBeNull()
  })
})

describe('SortHeader', () => {
  function Demo() {
    const sort = useTableSort(ROWS, OPTS)
    return (
      <table>
        <thead>
          <tr>
            <SortHeader sort={sort} column="name">
              Name
            </SortHeader>
            <SortHeader sort={sort} column="port" className="hu-num">
              Port
            </SortHeader>
          </tr>
        </thead>
        <tbody>
          {sort.sorted.map((r) => (
            <tr key={r.name}>
              <td>{r.name}</td>
              <td>{r.port}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  it('sorts on a click and marks the column with aria-sort and an arrow', () => {
    render(<Demo />)
    const name = screen.getByRole('button', { name: 'Name' })
    const nameTh = screen.getByRole('columnheader', { name: 'Name' })
    const portTh = screen.getByRole('columnheader', { name: 'Port' })
    expect(portTh).toHaveClass('hu-num')
    expect(nameTh).not.toHaveAttribute('aria-sort')
    expect(name.querySelector('.hu-sort__icon')).toHaveTextContent('↕')

    fireEvent.click(name)
    expect(nameTh).toHaveAttribute('aria-sort', 'ascending')
    expect(name.querySelector('.hu-sort__icon')).toHaveTextContent('▲')
    expect(name.querySelector('.hu-sort__icon')).toHaveClass('hu-sort__icon--active')
    expect(screen.getAllByRole('row').slice(1).map((r) => r.firstChild!.textContent)).toEqual(['ether1', 'Ether2', 'ether10', ''])

    fireEvent.click(name)
    expect(nameTh).toHaveAttribute('aria-sort', 'descending')
    expect(name.querySelector('.hu-sort__icon')).toHaveTextContent('▼')

    fireEvent.click(screen.getByRole('button', { name: 'Port' }))
    expect(nameTh).not.toHaveAttribute('aria-sort')
    expect(portTh).toHaveAttribute('aria-sort', 'ascending')
  })
})
