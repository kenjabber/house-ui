import { fireEvent, render, screen } from '@testing-library/react'
import { MenuItem, UserMenu } from './Menu'

function Harness({ onSignOut = () => {} }: { onSignOut?: () => void }) {
  return (
    <>
      <p>outside</p>
      <UserMenu name="Ken" badge="admin">
        <MenuItem>Profile</MenuItem>
        <MenuItem danger onClick={onSignOut}>
          Sign out
        </MenuItem>
      </UserMenu>
    </>
  )
}

describe('UserMenu', () => {
  it('opens a menu, focuses its first item, and runs and closes on a choice', () => {
    let signedOut = 0
    render(<Harness onSignOut={() => signedOut++} />)
    const button = screen.getByRole('button', { name: /Ken/ })
    expect(button).toHaveAttribute('aria-haspopup', 'menu')
    expect(button).toHaveTextContent('admin')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus()
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveClass('hu-menu__item--danger')
    fireEvent.click(screen.getByRole('menuitem', { name: 'Sign out' }))
    expect(signedOut).toBe(1)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('moves with the arrow keys and closes on Escape and outside clicks', () => {
    render(<Harness />)
    const button = screen.getByRole('button', { name: /Ken/ })
    fireEvent.click(button)
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus()
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
    expect(button).toHaveFocus()

    fireEvent.click(button)
    fireEvent.mouseDown(screen.getByText('outside'))
    expect(screen.queryByRole('menu')).toBeNull()
  })
})
