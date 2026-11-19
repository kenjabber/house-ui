import { fireEvent, render, screen } from '@testing-library/react'
import { AppShell } from './AppShell'
import { Sidebar, SidebarLink } from './Sidebar'

function Shell(props: { onCollapsedChange?: (c: boolean) => void; onPick?: () => void }) {
  return (
    <AppShell
      title="Hosts"
      headerRight={<span>user</span>}
      onCollapsedChange={props.onCollapsedChange}
      sidebar={
        <Sidebar brand="NetConfig" below={<p>below</p>}>
          <SidebarLink label="Hosts" active badge={3} onClick={props.onPick} />
          <SidebarLink as="a" href="/domains" label="Domains" />
        </Sidebar>
      }
    >
      <p>page</p>
    </AppShell>
  )
}

describe('AppShell', () => {
  it('renders the sidebar, header and page', () => {
    render(<Shell />)
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveTextContent('page')
    expect(screen.getByText('user')).toBeInTheDocument()
    expect(screen.getByText('below')).toBeInTheDocument()
  })

  it('marks the active link, shows its badge, and renders a link as <a>', () => {
    render(<Shell />)
    const hosts = screen.getByRole('button', { name: /Hosts/ })
    expect(hosts).toHaveAttribute('aria-current', 'page')
    expect(hosts).toHaveClass('hu-sidebar-link--active')
    expect(hosts).toHaveTextContent('3')
    const domains = screen.getByRole('link', { name: /Domains/ })
    expect(domains).toHaveAttribute('href', '/domains')
    expect(domains).not.toHaveAttribute('aria-current')
    expect(domains).not.toHaveAttribute('type')
  })

  it('collapses from the toggle', () => {
    const changes: boolean[] = []
    const { container } = render(<Shell onCollapsedChange={(c) => changes.push(c)} />)
    const shell = container.querySelector('.hu-shell')!
    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }))
    expect(shell).toHaveClass('hu-shell--collapsed')
    fireEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }))
    expect(shell).not.toHaveClass('hu-shell--collapsed')
    expect(changes).toEqual([true, false])
  })

  it('opens the compact overlay from the menu and closes it on a link, the scrim or Escape', () => {
    let picked = 0
    const { container } = render(<Shell onPick={() => picked++} />)
    const shell = container.querySelector('.hu-shell')!
    const menu = screen.getByRole('button', { name: 'Open menu' })

    fireEvent.click(menu)
    expect(shell).toHaveClass('hu-shell--nav-open')
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(screen.getByRole('button', { name: /Hosts/ }))
    expect(picked).toBe(1)
    expect(shell).not.toHaveClass('hu-shell--nav-open')

    fireEvent.click(menu)
    fireEvent.click(container.querySelector('.hu-shell__scrim')!)
    expect(shell).not.toHaveClass('hu-shell--nav-open')

    fireEvent.click(menu)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(shell).not.toHaveClass('hu-shell--nav-open')
    expect(menu).toHaveAttribute('aria-controls', container.querySelector('.hu-sidebar')!.id)
  })
})
