import type { ReactNode } from 'react'
import { cx } from '../cx'

export interface PageHeadProps {
  /** The page's h1. */
  title: ReactNode
  /** One line under the title. */
  subtitle?: ReactNode
  /** Buttons at the right; they wrap under the title on a narrow screen. */
  actions?: ReactNode
  className?: string
}

/** The top of a page: title, subtitle and actions. */
export function PageHead({ title, subtitle, actions, className }: PageHeadProps) {
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

/** A centred column of at most --page-max-width with cards spaced evenly. */
export function Page({ className, children }: { className?: string; children?: ReactNode }) {
  return <div className={cx('hu-page', className)}>{children}</div>
}
