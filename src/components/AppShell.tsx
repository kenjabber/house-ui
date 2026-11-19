import { useCallback, useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import { cx } from '../cx'
import { ShellContext, type ShellState } from './shellContext'

export interface AppShellProps {
  /** The sidebar: a `<Sidebar>`. */
  sidebar: ReactNode
  /** The main header's title, usually the current section's name. Not a heading: the page's h1 is its PageHead. */
  title?: ReactNode
  /** The main header's right side: settings button, user menu. */
  headerRight?: ReactNode
  /** The page. It scrolls inside the main area. */
  children?: ReactNode
  /** Controlled collapsed state; leave out to let the shell keep its own. */
  collapsed?: boolean
  /** Called when the sidebar's toggle is pressed. */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Starting collapsed state when uncontrolled. */
  defaultCollapsed?: boolean
  className?: string
}

/**
 * The sidebar layout (PLAN D-10). The sidebar collapses to icons; at 980px and
 * below it becomes an overlay opened by the header's menu button and closed by
 * a link, the scrim, or Escape.
 */
export function AppShell({
  sidebar,
  title,
  headerRight,
  children,
  collapsed: collapsedProp,
  onCollapsedChange,
  defaultCollapsed = false,
  className,
}: AppShellProps) {
  const [ownCollapsed, setOwnCollapsed] = useState(defaultCollapsed)
  const collapsed = collapsedProp ?? ownCollapsed
  const [navOpen, setNavOpen] = useState(false)
  const sidebarId = useId()

  const toggleCollapsed = useCallback(() => {
    const next = !collapsed
    if (collapsedProp === undefined) setOwnCollapsed(next)
    onCollapsedChange?.(next)
  }, [collapsed, collapsedProp, onCollapsedChange])

  useEffect(() => {
    if (!navOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [navOpen])

  const state = useMemo<ShellState>(
    () => ({ collapsed, toggleCollapsed, navOpen, setNavOpen, sidebarId }),
    [collapsed, toggleCollapsed, navOpen, sidebarId],
  )

  return (
    <ShellContext.Provider value={state}>
      <div className={cx('hu-shell-frame', className)}>
        <div className={cx('hu-shell', collapsed && 'hu-shell--collapsed', navOpen && 'hu-shell--nav-open')}>
          {sidebar}
          <div className="hu-shell__scrim" aria-hidden="true" onClick={() => setNavOpen(false)} />
          <div className="hu-main">
            <header className="hu-main__header">
              <button
                type="button"
                className="hu-btn hu-btn--ghost hu-btn--icon hu-main__menu"
                aria-label="Open menu"
                aria-controls={sidebarId}
                aria-expanded={navOpen}
                onClick={() => setNavOpen(true)}
              >
                <MenuIcon />
              </button>
              <div className="hu-main__title">{title}</div>
              {headerRight && <div className="hu-main__right">{headerRight}</div>}
            </header>
            <main className="hu-main__content">{children}</main>
          </div>
        </div>
      </div>
    </ShellContext.Provider>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
