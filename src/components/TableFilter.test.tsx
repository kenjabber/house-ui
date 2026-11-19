import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { TableFilter, chipValue, useTableFilter, type TableFilterOptions } from './TableFilter'

interface Row {
  name: string
  status: string
}
const ROWS: Row[] = [
  { name: 'alpha', status: 'Ready' },
  { name: 'beta', status: 'needs Ken (the token)' },
  { name: 'gamma', status: 'ready' },
  { name: 'delta', status: 'Needs Ken' },
]
const OPTS: TableFilterOptions<Row> = {
  text: (r) => `${r.name} ${r.status}`,
  chips: [{ name: 'Status', value: (r) => chipValue(r.status) }],
}

describe('chipValue', () => {
  it('drops the bracketed note and collapses space', () => {
    expect(chipValue('needs Ken (the token)')).toBe('needs Ken')
    expect(chipValue('  a   b ')).toBe('a b')
    expect(chipValue('(only a note)')).toBe('—')
  })
})

describe('useTableFilter', () => {
  it('groups chip values regardless of case, keeping the first spelling', () => {
    const { result } = renderHook(() => useTableFilter(ROWS, OPTS))
    expect(result.current.columns[0].chips.map((c) => [c.value, c.count])).toEqual([
      ['Ready', 2],
      ['needs Ken', 2],
    ])
    expect(result.current.active).toBe(false)
  })

  it('needs every typed word, in any column', () => {
    const { result } = renderHook(() => useTableFilter(ROWS, OPTS))
    act(() => result.current.setQuery('ken  BE'))
    expect(result.current.visible.map((r) => r.name)).toEqual(['beta'])
    expect(result.current.active).toBe(true)
  })

  it('switches a value off and on, and shows only one with `only`', () => {
    const { result } = renderHook(() => useTableFilter(ROWS, OPTS))
    act(() => result.current.toggle(0, 'Ready'))
    expect(result.current.visible.map((r) => r.name)).toEqual(['beta', 'delta'])
    expect(result.current.columns[0].chips[0]).toMatchObject({ value: 'Ready', on: false, count: 2 })
    act(() => result.current.toggle(0, 'Ready'))
    expect(result.current.visible).toHaveLength(4)

    act(() => result.current.only(0, 'needs Ken'))
    expect(result.current.visible.map((r) => r.name)).toEqual(['beta', 'delta'])
    act(() => result.current.only(0, 'needs Ken'))
    expect(result.current.visible).toHaveLength(4)
  })

  it('counts a chip with the text filter applied', () => {
    const { result } = renderHook(() => useTableFilter(ROWS, OPTS))
    act(() => result.current.setQuery('alpha'))
    expect(result.current.columns[0].chips.map((c) => c.count)).toEqual([1, 0])
  })
})

function Harness() {
  const filter = useTableFilter(ROWS, OPTS)
  return (
    <>
      <TableFilter filter={filter} />
      <ul>
        {filter.visible.map((r) => (
          <li key={r.name}>{r.name}</li>
        ))}
      </ul>
    </>
  )
}

describe('TableFilter', () => {
  it('shows the count, chips with aria-pressed, and Show all once something is filtered', () => {
    render(<Harness />)
    expect(screen.getByText('4 rows')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Show all' })).toBeNull()

    const ready = screen.getByRole('button', { name: /^Ready/ })
    expect(ready).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(ready)
    expect(ready).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('2 of 4 rows')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'delta' } })
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['delta'])

    fireEvent.click(screen.getByRole('button', { name: 'Show all' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.getByRole('searchbox')).toHaveValue('')
  })
})
