import type { ReactNode } from 'react'
import { cx } from '../cx'

export interface PageHeadProps {
  /** The page's h1. */
  title: ReactNode
  /** One line under the title. */
  subtitle?: ReactNode
  /** Buttons at the right; they wrap under the title on a narrow screen. */
  actions?: ReactNode
  /**
   * Hide the h1 (it stays for screen readers) when AppShell's header already
   * says the same: a list page. The head becomes a toolbar of the actions.
   */
  hideTitle?: boolean
  className?: string
}

/** The top of a page: title, subtitle and actions. */
export function PageHead({ title, subtitle, actions, hideTitle, className }: PageHeadProps) {
  if (hideTitle) {
    const h1 = <h1 className="hu-page-head__title hu-visually-hidden">{title}</h1>
    // Nothing to show: only the hidden h1, so no empty gap in the Page.
    if (!subtitle && !actions) return h1
    return (
      <div className={cx('hu-page-head', 'hu-page-head--toolbar', className)}>
        {h1}
        {subtitle && (
          <div className="hu-page-head__text">
            <p className="hu-page-head__subtitle">{subtitle}</p>
          </div>
        )}
        {actions && <div className="hu-page-head__actions">{actions}</div>}
      </div>
    )
  }
  return (
    <div className={cx('hu-page-head', className)}>
      <div className="hu-page-head__text">
        <h1 className="hu-page-head__title">{title}</h1>
        {subtitle && <p className="hu-page-head__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="hu-page-head__actions">{actions}</div>}
    </div>
  )
}

export interface PageProps {
  /**
   * Take the main area's full height so one child can grow and scroll by
   * itself (a `<TableWrap fill>`); the other children keep their height.
   */
  fill?: boolean
  className?: string
  children?: ReactNode
}

/** A centred column of at most --page-max-width with cards spaced evenly. */
export function Page({ fill, className, children }: PageProps) {
  return <div className={cx('hu-page', fill && 'hu-page--fill', className)}>{children}</div>
}
