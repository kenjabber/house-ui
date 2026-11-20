import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { PanelTabs, TabPanel, Tabs } from './Tabs'

function Harness() {
  const [tab, setTab] = useState('users')
  return (
    <>
      <Tabs
        label="Settings"
        idPrefix="s"
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'users', label: 'Users' },
          { key: 'off', label: 'Off', disabled: true },
          { key: 'tokens', label: 'API tokens' },
        ]}
      />
      <TabPanel idPrefix="s" tabKey={tab}>
        panel {tab}
      </TabPanel>
    </>
  )
}

describe('Tabs', () => {
  it('marks the selected tab and wires the panel to it', () => {
    render(<Harness />)
    expect(screen.getByRole('tablist', { name: 'Settings' })).toBeInTheDocument()
    const users = screen.getByRole('tab', { name: 'Users' })
    expect(users).toHaveAttribute('aria-selected', 'true')
    expect(users).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tabpanel', { name: 'Users' })).toHaveTextContent('panel users')
    fireEvent.click(screen.getByRole('tab', { name: 'API tokens' }))
    expect(screen.getByRole('tabpanel', { name: 'API tokens' })).toHaveTextContent('panel tokens')
    expect(users).toHaveAttribute('tabindex', '-1')
  })

  it('moves with arrows, Home and End, skipping disabled tabs', () => {
    render(<Harness />)
    const list = screen.getByRole('tablist')
    fireEvent.keyDown(list, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'API tokens' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'API tokens' })).toHaveFocus()
    fireEvent.keyDown(list, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Users' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(list, { key: 'End' })
    expect(screen.getByRole('tab', { name: 'API tokens' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(list, { key: 'Home' })
    expect(screen.getByRole('tab', { name: 'Users' })).toHaveAttribute('aria-selected', 'true')
  })
})

function PanelHarness() {
  const [edge, setEdge] = useState('main')
  return (
    <PanelTabs
      label="Edges"
      value={edge}
      onChange={setEdge}
      panelLabel={`${edge} edge`}
      tabs={[
        { key: 'main', label: 'main', sub: '· srv1a' },
        { key: 'admin', label: 'admin', sub: '· srv1b' },
      ]}
    >
      <p>the {edge} panel</p>
    </PanelTabs>
  )
}

describe('PanelTabs', () => {
  it('joins the selected tab to a panel wired to it, with sub-text in the name', () => {
    render(<PanelHarness />)
    const list = screen.getByRole('tablist', { name: 'Edges' })
    expect(list).toHaveClass('hu-tabs', 'hu-tabs--panel')
    const main = screen.getByRole('tab', { name: 'main · srv1a' })
    expect(main).toHaveAttribute('aria-selected', 'true')
    expect(main.querySelector('.hu-tab__sub')).toHaveTextContent('· srv1a')
    const panel = screen.getByRole('tabpanel', { name: 'main edge' })
    expect(panel).toHaveClass('hu-tab-panel', 'hu-tab-panel--joined')
    expect(main).toHaveAttribute('aria-controls', panel.id)
    expect(panel).toHaveTextContent('the main panel')

    main.focus()
    fireEvent.keyDown(main, { key: 'ArrowRight' })
    const admin = screen.getByRole('tab', { name: /admin · srv1b/ })
    expect(admin).toHaveAttribute('aria-selected', 'true')
    expect(admin).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('the admin panel')
  })

  it('labels the panel by its tab when no panelLabel is given', () => {
    render(
      <PanelTabs label="Edges" value="main" onChange={() => {}} tabs={[{ key: 'main', label: 'main' }]}>
        x
      </PanelTabs>,
    )
    expect(screen.getByRole('tabpanel', { name: 'main' })).toHaveAttribute('aria-labelledby', screen.getByRole('tab').id)
  })

  it('puts the note of a tab behind a "?" right of the tab, outside it', () => {
    render(
      <Tabs
        label="Views"
        value="a"
        onChange={() => {}}
        tabs={[
          { key: 'a', label: 'Blocked domains', info: 'What is blocked.' },
          { key: 'b', label: 'Watch' },
        ]}
      />,
    )
    const help = screen.getByRole('button', { name: 'About Blocked domains' })
    expect(screen.getByRole('tab', { name: 'Blocked domains' })).not.toContainElement(help)
    expect(screen.getAllByRole('tab')).toHaveLength(2)
    fireEvent.click(help)
    expect(screen.getByRole('note', { name: 'Blocked domains' })).toHaveTextContent('What is blocked.')
  })
})
