import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../cx'

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The card's heading (an h2). */
  title?: ReactNode
  /** Buttons or links at the right of the head. */
  headActions?: ReactNode
  /** A row of buttons under the body, right-aligned. */
  actions?: ReactNode
}

/** A raised box: head (title and head actions), body, actions. */
export function Card({ title, headActions, actions, className, children, ...rest }: CardProps) {
  return (
    <section className={cx('hu-card', className)} {...rest}>
      {(title || headActions) && (
        <div className="hu-card__head">
          {title && <h2 className="hu-card__title">{title}</h2>}
          {headActions && <div className="hu-card__head-actions">{headActions}</div>}
        </div>
      )}
      {children}
      {actions && <div className="hu-card__actions">{actions}</div>}
    </section>
  )
}
