import type { ComponentPropsWithoutRef, ElementType, MouseEvent, ReactNode } from 'react'
import { cx } from '../cx'
import { useShell } from './shellContext'

export interface SidebarProps {
  /** The app's name at the top. */
  brand: ReactNode
  /** The links: `<SidebarLink>`s. */
  children?: ReactNode
  /** Anything below the links (a list, a filter); hidden when collapsed. */
  below?: ReactNode
  /** The nav's accessible name. Default "Sections". */
  navLabel?: string
}

/** The dark sidebar of AppShell: brand, collapse toggle, links, and an area below them. */
export function Sidebar({ brand, children, below, navLabel = 'Sections' }: SidebarProps) {
  const { collapsed, toggleCollapsed, sidebarId } = useShell()
  return (
    <aside className="hu-sidebar" id={sidebarId}>
      <div className="hu-sidebar__head">
        <span className="hu-sidebar__brand">{brand}</span>
        <button
          type="button"
          className="hu-sidebar__toggle"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          onClick={toggleCollapsed}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>
      <nav className="hu-sidebar__nav" aria-label={navLabel}>
        {children}
      </nav>
      {below && <div className="hu-sidebar__below">{below}</div>}
    </aside>
  )
}

interface SidebarLinkOwnProps {
  /** An icon (an inline SVG). Without one, the label's first letter shows when collapsed. */
  icon?: ReactNode
  /** The link's text; also its tooltip, so it reads when collapsed. */
  label: string
  /** A count or short text at the right. */
  badge?: ReactNode
  /** Marks the current section. A router link that sets aria-current="page" needs nothing. */
  active?: boolean
  className?: string
}

export type SidebarLinkProps<C extends ElementType = 'button'> = SidebarLinkOwnProps & {
  /** The element or component to render: "button" (default), "a", or a router link (`NavLink`). */
  as?: C
} & Omit<ComponentPropsWithoutRef<C>, keyof SidebarLinkOwnProps | 'as' | 'children'>

/** One entry in the sidebar. A click also closes the compact overlay. */
export function SidebarLink<C extends ElementType = 'button'>({
  as,
  icon,
  label,
  badge,
  active,
  className,
  ...rest
}: SidebarLinkProps<C>) {
  const { setNavOpen } = useShell()
  const Comp: ElementType = as ?? 'button'
  const props = rest as Record<string, unknown> & { onClick?: (e: MouseEvent) => void }
  const onClick = (e: MouseEvent) => {
    props.onClick?.(e)
    setNavOpen(false)
  }
  return (
    <Comp
      {...props}
      {...(Comp === 'button' ? { type: 'button' } : {})}
      className={cx('hu-sidebar-link', active && 'hu-sidebar-link--active', className)}
      aria-current={active ? 'page' : (props['aria-current'] as string | undefined)}
      title={label}
      onClick={onClick}
    >
      <span className="hu-sidebar-link__icon" aria-hidden="true">
        {icon ?? label.charAt(0).toUpperCase()}
      </span>
      <span className="hu-sidebar-link__label">{label}</span>
      {badge !== undefined && badge !== null && <span className="hu-sidebar-link__badge">{badge}</span>}
    </Comp>
  )
}
