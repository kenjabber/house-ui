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
  /** Leave the compact overlay open on a click (by default a click closes it). */
  keepOpen?: boolean
  className?: string
}

export type SidebarLinkProps<C extends ElementType = 'button'> = SidebarLinkOwnProps & {
  /** The element or component to render: "button" (default), "a", or a router link (`NavLink`). */
  as?: C
} & Omit<ComponentPropsWithoutRef<C>, keyof SidebarLinkOwnProps | 'as' | 'children'>

/** One entry in the sidebar. A click also closes the compact overlay, unless `keepOpen`. */
export function SidebarLink<C extends ElementType = 'button'>({
  as,
  icon,
  label,
  badge,
  active,
  keepOpen,
  className,
  ...rest
}: SidebarLinkProps<C>) {
  const { setNavOpen } = useShell()
  const Comp: ElementType = as ?? 'button'
  const props = rest as Record<string, unknown> & { onClick?: (e: MouseEvent) => void }
  const onClick = (e: MouseEvent) => {
    props.onClick?.(e)
    if (!keepOpen) setNavOpen(false)
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

export interface SidebarSectionProps {
  /** A small uppercase heading. */
  title: ReactNode
  /** Small buttons at the right of the heading: `<SidebarAction>`s. */
  actions?: ReactNode
  children?: ReactNode
  className?: string
}

/**
 * A titled block in the Sidebar's `below` area: stocker's scenario list,
 * kwicky's site tree.
 */
export function SidebarSection({ title, actions, children, className }: SidebarSectionProps) {
  return (
    <section className={cx('hu-sidebar-section', className)}>
      <div className="hu-sidebar-section__head">
        <h2 className="hu-sidebar-section__title">{title}</h2>
        {actions && <div className="hu-sidebar-section__actions">{actions}</div>}
      </div>
      {children}
    </section>
  )
}

/** A small icon button on the dark sidebar; give it an `aria-label`. */
export function SidebarAction({ className, danger, ...rest }: ComponentPropsWithoutRef<'button'> & { danger?: boolean }) {
  return <button type="button" className={cx('hu-sidebar-action', danger && 'hu-sidebar-action--danger', className)} {...rest} />
}

interface SidebarItemOwnProps {
  /** An inline SVG before the label (a folder, a page), about 1rem, in the row's colour, slightly dimmed. */
  icon?: ReactNode
  /** The selected row. */
  active?: boolean
  /** Something at the right of the row (a lock, a count). */
  meta?: ReactNode
  /**
   * Leave the compact overlay open on a click: a row that changes the list
   * itself (opening a folder). By default a click closes it.
   */
  keepOpen?: boolean
  children?: ReactNode
  className?: string
}

export type SidebarItemProps<C extends ElementType = 'button'> = SidebarItemOwnProps & {
  /** "button" (default), "a", or a router link. */
  as?: C
} & Omit<ComponentPropsWithoutRef<C>, keyof SidebarItemOwnProps | 'as'>

/**
 * One row of a list in the sidebar's `below` area (a scenario, a page in
 * the tree). Denser than a SidebarLink. A click also closes the compact
 * overlay, unless `keepOpen` (a folder row that drills in).
 */
export function SidebarItem<C extends ElementType = 'button'>({
  as,
  icon,
  active,
  meta,
  keepOpen,
  children,
  className,
  ...rest
}: SidebarItemProps<C>) {
  const { setNavOpen } = useShell()
  const Comp: ElementType = as ?? 'button'
  const props = rest as Record<string, unknown> & { onClick?: (e: MouseEvent) => void }
  return (
    <Comp
      {...props}
      {...(Comp === 'button' ? { type: 'button' } : {})}
      className={cx('hu-sidebar-item', active && 'hu-sidebar-item--active', className)}
      aria-current={active ? 'true' : (props['aria-current'] as string | undefined)}
      onClick={(e: MouseEvent) => {
        props.onClick?.(e)
        if (!keepOpen) setNavOpen(false)
      }}
    >
      {icon !== undefined && icon !== null && (
        <span className="hu-sidebar-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="hu-sidebar-item__label">{children}</span>
      {meta !== undefined && meta !== null && <span className="hu-sidebar-item__meta">{meta}</span>}
    </Comp>
  )
}
