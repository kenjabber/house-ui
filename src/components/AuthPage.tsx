import type { FormEventHandler, ReactNode } from 'react'
import { cx } from '../cx'
import { Banner } from './Feedback'

export interface AuthPageProps {
  /** The page's h1: "Sign in", "Register your passkey". */
  title: ReactNode
  /** A muted line under the title: what to do. */
  subtitle?: ReactNode
  /** An error, shown as a `bad` Banner above the form; nothing when empty. */
  error?: ReactNode
  /**
   * With it, the children are a `<form>` that calls it on submit. Without it
   * (a browser with no passkeys), the children are a plain column.
   */
  onSubmit?: FormEventHandler<HTMLFormElement>
  /** A muted, centred line at the bottom: a link to register or sign in. */
  footer?: ReactNode
  /** The fields and the submit Button; a Button straight in the form is full width. */
  children?: ReactNode
  className?: string
}

/**
 * The sign-in and register page: a centred card (at most 360px) on the body
 * surface, outside the AppShell.
 */
export function AuthPage({ title, subtitle, error, onSubmit, footer, children, className }: AuthPageProps) {
  return (
    <main className={cx('hu-auth', className)}>
      <section className="hu-card hu-auth__card">
        <h1 className="hu-auth__title">{title}</h1>
        {subtitle && <p className="hu-auth__subtitle">{subtitle}</p>}
        <Banner kind="bad">{error}</Banner>
        {children &&
          (onSubmit ? (
            <form className="hu-auth__form" onSubmit={onSubmit}>
              {children}
            </form>
          ) : (
            <div className="hu-auth__form">{children}</div>
          ))}
        {footer && <p className="hu-auth__footer">{footer}</p>}
      </section>
    </main>
  )
}
