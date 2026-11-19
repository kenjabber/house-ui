import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../cx'
import { PersonIcon } from './icons'

export interface UserMenuProps {
  /** Who is signed in. */
  name: ReactNode
  /** A short label after the name (kwicky's "admin"). */
  badge?: ReactNode
  /** The menu: `<MenuItem>`s. */
  children: ReactNode
  className?: string
}

/**
 * The signed-in user's button in the header and its drop-down menu. It
 * closes on a choice, Escape, or a click elsewhere. At phone width (an
 * AppShell 600px wide or less) the button shows only the person icon (the
 * name stays its accessible name) and the open menu shows the name and
 * badge at its top.
 */
export function UserMenu({ name, badge, children, className }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    wrapRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={cx('hu-user-menu', className)} ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="hu-user-menu__button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <PersonIcon />
        <span className="hu-user-menu__name">{name}</span>
        {badge && <span className="hu-chip hu-chip--info hu-user-menu__badge">{badge}</span>}
      </button>
      {open && (
        <div
          className="hu-menu"
          role="menu"
          id={menuId}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('[role="menuitem"]')) setOpen(false)
          }}
          onKeyDown={(e) => {
            if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
            e.preventDefault()
            const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)'))
            const i = items.indexOf(document.activeElement as HTMLElement)
            const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length
            items[next]?.focus()
          }}
        >
          {/* Shown at phone width only, where the button is just the icon. The
              button already carries the name for screen readers. */}
          <div className="hu-menu__head" aria-hidden="true">
            <span className="hu-menu__head-name">{name}</span>
            {badge && <span className="hu-chip hu-chip--info hu-user-menu__badge">{badge}</span>}
          </div>
          {children}
        </div>
      )}
    </div>
  )
}

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Red, for Sign out or a delete. */
  danger?: boolean
}

/** One choice in a UserMenu. */
export function MenuItem({ danger, className, ...rest }: MenuItemProps) {
  return (
    <button type="button" role="menuitem" className={cx('hu-menu__item', danger && 'hu-menu__item--danger', className)} {...rest} />
  )
}
