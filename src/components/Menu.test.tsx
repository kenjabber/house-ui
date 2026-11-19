import { fireEvent, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
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

describe('UserMenu at phone width', () => {
  it('names the button after the user and shows the name and badge at the top of the open menu', () => {
    render(<Harness />)
    const button = screen.getByRole('button', { name: /Ken/ })
    expect(button.querySelector('.hu-user-menu__name')).toHaveTextContent('Ken')
    fireEvent.click(button)
    const head = screen.getByRole('menu').querySelector('.hu-menu__head')!
    expect(head).toHaveAttribute('aria-hidden', 'true')
    expect(head).toHaveTextContent('Ken')
    expect(head).toHaveTextContent('admin')
    expect(head.nextElementSibling).toHaveAccessibleName('Profile')
    // The first item, not the head, takes the focus.
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus()
  })

  // jsdom does no layout or container queries, so check the rules.
  const strip = (f: string) => readFileSync(resolve(process.cwd(), `src/styles/${f}`), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  const phone = (f: string) => {
    const css = strip(f)
    const at = css.indexOf('@container hu-shell (max-width: 600px)')
    expect(at, f).toBeGreaterThan(-1)
    return css.slice(at)
  }

  it('hides the name and badge visually in the button and shows the menu head', () => {
    const css = phone('menu.css')
    expect(css).toMatch(/\.hu-user-menu__button \.hu-user-menu__name,\s*\.hu-user-menu__button \.hu-user-menu__badge \{[^}]*clip: rect\(0 0 0 0\)/)
    expect(css).toMatch(/\.hu-menu__head \{\s*display: flex;/)
    expect(strip('menu.css')).toMatch(/\.hu-menu__head \{\s*display: none;/)
  })

  it('lets the header right side shrink and keeps room for the title', () => {
    const css = phone('shell.css')
    expect(css).toMatch(/\.hu-main__title \{\s*min-width: 5rem;/)
    expect(css).toMatch(/\.hu-main__right \{\s*flex-shrink: 1;\s*min-width: 0;/)
  })
})
