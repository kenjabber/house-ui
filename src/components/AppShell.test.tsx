import { fireEvent, render, screen } from '@testing-library/react'
import { AppShell } from './AppShell'
import { Sidebar, SidebarAction, SidebarItem, SidebarLink, SidebarSection } from './Sidebar'

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

  it('puts a text title in a span, so a long one ends in an ellipsis', () => {
    const { container } = render(<Shell />)
    expect(container.querySelector('.hu-main__title > .hu-main__title-text')).toHaveTextContent('Hosts')
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

describe('SidebarSection and SidebarItem', () => {
  it('lists rows under a titled section, marks the active one, and closes the overlay on a pick', () => {
    let picked = ''
    const { container } = render(
      <AppShell
        sidebar={
          <Sidebar
            brand="stocker"
            below={
              <SidebarSection title="Scenarios" actions={<SidebarAction aria-label="Add scenario">+</SidebarAction>}>
                <SidebarItem active meta="🔒" onClick={() => (picked = 'Base')}>
                  Base case
                </SidebarItem>
                <SidebarItem onClick={() => (picked = 'Early')}>Early retirement</SidebarItem>
              </SidebarSection>
            }
          />
        }
      />,
    )
    expect(screen.getByRole('heading', { name: 'Scenarios' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add scenario' })).toHaveClass('hu-sidebar-action')
    const base = screen.getByRole('button', { name: /Base case/ })
    expect(base).toHaveAttribute('aria-current', 'true')
    expect(base).toHaveTextContent('🔒')
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    fireEvent.click(screen.getByRole('button', { name: 'Early retirement' }))
    expect(picked).toBe('Early')
    expect(container.querySelector('.hu-shell')).not.toHaveClass('hu-shell--nav-open')
  })

  it('shows an icon before the label, hidden from screen readers', () => {
    render(
      <AppShell
        sidebar={
          <Sidebar
            brand="kwicky"
            below={
              <SidebarSection title="Pages">
                <SidebarItem icon={<svg data-testid="folder" />}>projects</SidebarItem>
                <SidebarItem>home</SidebarItem>
              </SidebarSection>
            }
          />
        }
      />,
    )
    const projects = screen.getByRole('button', { name: 'projects' })
    const icon = projects.querySelector('.hu-sidebar-item__icon')!
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).toContainElement(screen.getByTestId('folder'))
    expect(icon.nextElementSibling).toHaveClass('hu-sidebar-item__label')
    expect(screen.getByRole('button', { name: 'home' }).querySelector('.hu-sidebar-item__icon')).toBeNull()
  })
})
