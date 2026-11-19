import { fireEvent, render, screen } from '@testing-library/react'
import { Banner, ConfirmButton, Facts, Loading } from './Feedback'
import { InfoButton } from './InfoButton'

describe('Banner', () => {
  it('is an alert when bad and a status otherwise, with an optional list', () => {
    render(
      <>
        <Banner kind="bad">Could not save.</Banner>
        <Banner kind="warn" title="2 warnings" items={['one', 'two']} />
      </>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save.')
    expect(screen.getByRole('alert')).toHaveClass('hu-banner', 'hu-banner--bad')
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('2 warnings')
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['one', 'two'])
  })

  it('renders nothing when empty', () => {
    const { container } = render(<Banner kind="warn" items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('Loading', () => {
  it('says what is loading', () => {
    render(<Loading what="Loading servers" />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading servers…')
  })
})

describe('ConfirmButton', () => {
  it('asks first and runs on yes only', () => {
    let ran = 0
    render(<ConfirmButton label="Delete" title="Delete kwicky?" message="Gone for good." danger onConfirm={() => ran++} />)
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('hu-btn--ghost-danger')
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('dialog', { name: 'Delete kwicky?' })).toHaveTextContent('Gone for good.')
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(ran).toBe(0)
    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    const confirm = screen.getAllByRole('button', { name: 'Delete' }).find((b) => b.closest('[role="dialog"]'))!
    expect(confirm).toHaveClass('hu-btn--danger')
    fireEvent.click(confirm)
    expect(ran).toBe(1)
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})

describe('Facts', () => {
  it('pairs labels with values and shows a dash for a missing one', () => {
    const { container } = render(<Facts mono items={[['Commit', 'a1b2c3'], ['Tag', null]]} />)
    expect(container.querySelector('dl')).toHaveClass('hu-facts', 'hu-facts--mono')
    expect([...container.querySelectorAll('dt')].map((d) => d.textContent)).toEqual(['Commit', 'Tag'])
    expect([...container.querySelectorAll('dd')].map((d) => d.textContent)).toEqual(['a1b2c3', '—'])
  })

  it('skips falsy entries, so a conditional row is `cond && [label, value]`', () => {
    const pi = false
    const parts: string[] = []
    const { container } = render(
      <Facts
        items={[
          ['Host', 'srv1a'],
          pi && ['Temperature', '48 °C'],
          parts.length && ['Parts', parts.join(', ')],
          null,
          undefined,
          ['Kernel', '6.8'],
        ]}
      />,
    )
    expect([...container.querySelectorAll('dt')].map((d) => d.textContent)).toEqual(['Host', 'Kernel'])
  })
})

describe('InfoButton', () => {
  it('toggles a note and closes it on Escape or an outside click', () => {
    render(
      <>
        <p>elsewhere</p>
        <InfoButton title="Edges">The edges route names to apps.</InfoButton>
      </>,
    )
    const button = screen.getByRole('button', { name: 'About Edges' })
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('note', { name: 'Edges' })).toHaveTextContent('The edges route names to apps.')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('note')).toBeNull()
    expect(button).toHaveFocus()
    fireEvent.click(button)
    fireEvent.mouseDown(screen.getByText('elsewhere'))
    expect(screen.queryByRole('note')).toBeNull()
    fireEvent.click(button)
    fireEvent.click(button)
    expect(screen.queryByRole('note')).toBeNull()
  })
})
