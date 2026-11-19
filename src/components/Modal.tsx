import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../cx'

export interface ModalProps {
  /** The heading; also the dialog's accessible name. */
  title: ReactNode
  /** Called on Escape, the × button, or a click on the backdrop. */
  onClose: () => void
  children?: ReactNode
  /** Buttons at the bottom, right-aligned. */
  footer?: ReactNode
  /** 820px wide instead of 460px. */
  wide?: boolean
  /** Close on a click on the backdrop. Default true; turn off for forms that would lose input. */
  closeOnBackdrop?: boolean
  /** Where the dialog is rendered. Default document.body. */
  container?: Element | null
  className?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * A dialog over the page, rendered into document.body. Its height is capped
 * by --modal-max-height (dynamic-viewport aware) and its body scrolls. Focus
 * moves into it, Tab stays inside, and focus goes back on close.
 */
export function Modal({
  title,
  onClose,
  children,
  footer,
  wide,
  closeOnBackdrop = true,
  container,
  className,
}: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const dialog = dialogRef.current
    const before = document.activeElement as HTMLElement | null
    const auto = dialog?.querySelector<HTMLElement>('[autofocus], [data-autofocus]')
    ;(auto ?? dialog)?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCloseRef.current()
      } else if (e.key === 'Tab' && dialog) {
        const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
        if (items.length === 0) {
          e.preventDefault()
          return
        }
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      before?.focus?.()
    }
  }, [])

  return createPortal(
    <div
      className="hu-modal-overlay"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onCloseRef.current()
      }}
    >
      <div
        ref={dialogRef}
        className={cx('hu-modal', wide && 'hu-modal--wide', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="hu-modal__header">
          <h2 className="hu-modal__title" id={titleId}>
            {title}
          </h2>
          <button type="button" className="hu-modal__close" aria-label="Close" onClick={() => onCloseRef.current()}>
            ×
          </button>
        </div>
        <div className="hu-modal__body">{children}</div>
        {footer && <div className="hu-modal__footer">{footer}</div>}
      </div>
    </div>,
    container ?? document.body,
  )
}
