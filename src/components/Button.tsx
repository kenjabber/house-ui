import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ElementType } from 'react'
import { cx } from '../cx'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost-danger' | 'ghost' | 'link'

/** The look Button and ButtonLink share. */
interface ButtonLook {
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

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonLook {}

const buttonClass = ({ variant = 'secondary', sm, icon }: ButtonLook, className?: string) =>
  cx(
    'hu-btn',
    variant !== 'secondary' && `hu-btn--${variant}`,
    sm && 'hu-btn--sm',
    icon && 'hu-btn--icon',
    className,
  )

/** A button. `type` defaults to "button" (not "submit"). */
export function Button({ variant, sm, icon, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass({ variant, sm, icon }, className)} {...rest} />
}

export type ButtonLinkProps<C extends ElementType = 'a'> = ButtonLook & {
  /** The element or component to render: "a" (default) or a router link (`Link`). */
  as?: C
  className?: string
} & Omit<ComponentPropsWithoutRef<C>, keyof ButtonLook | 'as' | 'className'>

/**
 * A link that looks like a Button: a download (`href` and `download`), or a
 * page in the app (`as={Link}` with `to`). Same `variant`, `sm` and `icon`.
 */
export function ButtonLink<C extends ElementType = 'a'>({ as, variant, sm, icon, className, ...rest }: ButtonLinkProps<C>) {
  const Comp: ElementType = as ?? 'a'
  return <Comp className={buttonClass({ variant, sm, icon }, className)} {...rest} />
}
