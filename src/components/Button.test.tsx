import { render, screen } from '@testing-library/react'
import { Button } from './Button'
import { Chip } from './Chip'

describe('Button', () => {
  it('is a secondary, non-submit button by default', () => {
    render(<Button>Save</Button>)
    const b = screen.getByRole('button', { name: 'Save' })
    expect(b).toHaveClass('hu-btn')
    expect(b.className).toBe('hu-btn')
    expect(b).toHaveAttribute('type', 'button')
  })

  it('adds the variant, size and icon classes and passes props through', () => {
    render(
      <Button variant="danger" sm icon aria-label="Delete" className="extra" disabled type="submit">
        x
      </Button>,
    )
    const b = screen.getByRole('button', { name: 'Delete' })
    expect(b.className).toBe('hu-btn hu-btn--danger hu-btn--sm hu-btn--icon extra')
    expect(b).toBeDisabled()
    expect(b).toHaveAttribute('type', 'submit')
  })
})

describe('Chip', () => {
  it('maps kinds to classes, neutral by default', () => {
    render(
      <>
        <Chip>plain</Chip>
        <Chip kind="ok">good</Chip>
      </>,
    )
    expect(screen.getByText('plain').className).toBe('hu-chip')
    expect(screen.getByText('good').className).toBe('hu-chip hu-chip--ok')
  })
})
