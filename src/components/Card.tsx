import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../cx'

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The card's heading (an h2). */
  title?: ReactNode
  /** Buttons or links at the right of the head. */
  headActions?: ReactNode
  /** A row of buttons under the body, right-aligned. */
  actions?: ReactNode
  /**
   * Straight in a `<Page fill>`: take the page's remaining height as a flex
   * column. The head, the actions row and other children keep their height;
   * one child takes the rest: a `<TableWrap fill>` or an element with
   * `className="hu-fill"`. At 600px and below it is an ordinary card.
   */
  fill?: boolean
}

/** A raised box: head (title and head actions), body, actions. */
export function Card({ title, headActions, actions, fill, className, children, ...rest }: CardProps) {
  return (
    <section className={cx('hu-card', fill && 'hu-card--fill', className)} {...rest}>
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
