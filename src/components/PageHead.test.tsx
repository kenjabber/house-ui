import { render, screen } from '@testing-library/react'
import { Page, PageHead } from './PageHead'
import { Table, TableWrap } from './Table'

describe('PageHead', () => {
  it('shows the title as the h1', () => {
    const { container } = render(<PageHead title="Hosts" subtitle="All of them." />)
    const h1 = screen.getByRole('heading', { level: 1, name: 'Hosts' })
    expect(h1).not.toHaveClass('hu-visually-hidden')
    expect(container.querySelector('.hu-page-head--toolbar')).toBeNull()
  })

  it('hideTitle keeps the h1 for screen readers and makes the head a toolbar', () => {
    const { container } = render(<PageHead title="Runs" hideTitle actions={<button>New run</button>} />)
    const h1 = screen.getByRole('heading', { level: 1, name: 'Runs' })
    expect(h1).toHaveClass('hu-visually-hidden')
    const head = container.querySelector('.hu-page-head')
    expect(head).toHaveClass('hu-page-head--toolbar')
    // No empty text column to reserve width.
    expect(container.querySelector('.hu-page-head__text')).toBeNull()
    expect(screen.getByRole('button', { name: 'New run' }).parentElement).toHaveClass('hu-page-head__actions')
  })

  it('hideTitle with a subtitle keeps the subtitle', () => {
    render(<PageHead title="Runs" hideTitle subtitle="Last 50." />)
    expect(screen.getByText('Last 50.')).toHaveClass('hu-page-head__subtitle')
    expect(screen.getByRole('heading', { level: 1, name: 'Runs' })).toHaveClass('hu-visually-hidden')
  })

  it('hideTitle with nothing else renders only the hidden h1', () => {
    const { container } = render(<PageHead title="Runs" hideTitle />)
    expect(container.childNodes).toHaveLength(1)
    expect(container.firstChild).toBe(screen.getByRole('heading', { level: 1, name: 'Runs' }))
    expect(container.querySelector('.hu-page-head')).toBeNull()
  })
})

describe('Page fill and TableWrap fill', () => {
  it('adds the fill classes only when asked', () => {
    const { container, rerender } = render(
      <Page>
        <TableWrap>
          <Table />
        </TableWrap>
      </Page>,
    )
    expect(container.querySelector('.hu-page')).not.toHaveClass('hu-page--fill')
    expect(container.querySelector('.hu-table-wrap')).not.toHaveClass('hu-table-wrap--fill')
    rerender(
      <Page fill className="x">
        <TableWrap fill>
          <Table stickyHead />
        </TableWrap>
      </Page>,
    )
    expect(container.querySelector('.hu-page')).toHaveClass('hu-page--fill', 'x')
    expect(container.querySelector('.hu-table-wrap')).toHaveClass('hu-table-wrap--fill')
    expect(container.querySelector('table')).toHaveClass('hu-table--sticky')
  })

  it('passes other attributes to the page div', () => {
    render(
      <Page fill role="region" aria-label="Ports">
        <TableWrap fill />
      </Page>,
    )
    expect(screen.getByRole('region', { name: 'Ports' })).toHaveClass('hu-page', 'hu-page--fill')
  })
})
