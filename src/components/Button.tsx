import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../cx'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost-danger' | 'ghost' | 'link'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Default `secondary`. `danger` is solid red (a dialog's confirm);
   * `ghost-danger` is a secondary button with red text (Delete in a table row).
   */
  variant?: ButtonVariant
  /** The small size. */
  sm?: boolean
  /** A square button holding only an icon; give it an `aria-label`. */
  icon?: boolean
}

/** A button. `type` defaults to "button" (not "submit"). */
export function Button({ variant = 'secondary', sm, icon, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'hu-btn',
        variant !== 'secondary' && `hu-btn--${variant}`,
        sm && 'hu-btn--sm',
        icon && 'hu-btn--icon',
        className,
      )}
      {...rest}
    />
  )
}
