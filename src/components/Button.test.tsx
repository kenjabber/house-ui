import { render, screen } from '@testing-library/react'
import { Button, ButtonLink } from './Button'
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

  it('has a ghost-danger variant: secondary with red text', () => {
    render(<Button variant="ghost-danger" sm>Revoke</Button>)
    expect(screen.getByRole('button', { name: 'Revoke' }).className).toBe('hu-btn hu-btn--ghost-danger hu-btn--sm')
  })
})

describe('ButtonLink', () => {
  it('is a link with the button classes, secondary by default', () => {
    render(
      <ButtonLink href="/x.conf" download>
        Download
      </ButtonLink>,
    )
    const a = screen.getByRole('link', { name: 'Download' })
    expect(a.tagName).toBe('A')
    expect(a.className).toBe('hu-btn')
    expect(a).toHaveAttribute('href', '/x.conf')
    expect(a).toHaveAttribute('download')
    expect(a).not.toHaveAttribute('type')
  })

  it('takes variant, sm, icon and a className', () => {
    render(
      <ButtonLink href="/" variant="primary" sm icon aria-label="Home" className="extra">
        x
      </ButtonLink>,
    )
    expect(screen.getByRole('link', { name: 'Home' }).className).toBe('hu-btn hu-btn--primary hu-btn--sm hu-btn--icon extra')
  })

  it('renders another component with `as`, passing its props', () => {
    const RouterLink = ({ to, ...rest }: { to: string; className?: string; children?: React.ReactNode }) => (
      <a href={`#${to}`} data-router="yes" {...rest} />
    )
    render(
      <ButtonLink as={RouterLink} to="/hosts" variant="ghost">
        Hosts
      </ButtonLink>,
    )
    const a = screen.getByRole('link', { name: 'Hosts' })
    expect(a).toHaveAttribute('href', '#/hosts')
    expect(a).toHaveAttribute('data-router', 'yes')
    expect(a.className).toBe('hu-btn hu-btn--ghost')
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
