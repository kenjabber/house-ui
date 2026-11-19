import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { TabPanel, Tabs } from './Tabs'

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
