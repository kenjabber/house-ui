import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../cx'
import { Button } from './Button'
import type { ChipKind } from './Chip'
import { Modal } from './Modal'

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The status kind (D-11). Default `info`. */
  kind?: ChipKind
  /** A bold first line. */
  title?: ReactNode
  /** Lines shown as a list under the title or text. */
  items?: ReactNode[]
}

/**
 * A message across the page or a card: an error, a warning, a list of
 * warnings, a success. `bad` is announced at once (role alert); the others
 * politely (role status).
 */
export function Banner({ kind = 'info', title, items, className, children, ...rest }: BannerProps) {
  if (!title && !children && (!items || items.length === 0)) return null
  return (
    <div
      role={kind === 'bad' ? 'alert' : 'status'}
      className={cx('hu-banner', `hu-banner--${kind}`, className)}
      {...rest}
    >
      {title && <strong className="hu-banner__title">{title}</strong>}
      {children}
      {items && items.length > 0 && (
        <ul className="hu-banner__list">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** "Loading…" while data comes in. */
export function Loading({ what = 'Loading', className }: { what?: string; className?: string }) {
  return (
    <p className={cx('hu-loading', className)} role="status">
      {what}…
    </p>
  )
}

export interface ConfirmButtonProps {
  /** The button's text, and the confirm button's unless `confirmLabel` is given. */
  label: ReactNode
  /** The dialog's title. */
  title: ReactNode
  /** What will happen. */
  message: ReactNode
  confirmLabel?: ReactNode
  /** Runs on yes. */
  onConfirm: () => void
  /** Destroys something: a ghost-red button, and a red confirm button. */
  danger?: boolean
  disabled?: boolean
  sm?: boolean
  className?: string
}

/** A button that asks first, in a Modal, and runs `onConfirm` on yes. */
export function ConfirmButton({
  label,
  title,
  message,
  confirmLabel,
  onConfirm,
  danger,
  disabled,
  sm,
  className,
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        variant={danger ? 'ghost-danger' : 'secondary'}
        sm={sm}
        disabled={disabled}
        className={className}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      {open && (
        <Modal
          title={title}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                variant={danger ? 'danger' : 'primary'}
                autoFocus
                onClick={() => {
                  setOpen(false)
                  onConfirm()
                }}
              >
                {confirmLabel ?? label}
              </Button>
            </>
          }
        >
          <div className="hu-hint">{message}</div>
        </Modal>
      )}
    </>
  )
}

export interface FactsProps {
  /** Label and value pairs. A null or undefined value shows as "—". */
  items: Array<[ReactNode, ReactNode]>
  /** Values in the monospace font (ids, paths, hashes). */
  mono?: boolean
  className?: string
}

/** A two-column list of facts: labels on the left, values on the right. */
export function Facts({ items, mono, className }: FactsProps) {
  return (
    <dl className={cx('hu-facts', mono && 'hu-facts--mono', className)}>
      {items.map(([label, value], i) => (
        <div key={i} className="hu-facts__row">
          <dt>{label}</dt>
          <dd>{value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  )
}
