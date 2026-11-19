import {
  Children,
  cloneElement,
  useId,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { cx } from '../cx'

export interface FieldProps {
  /** The label text. */
  label: ReactNode
  /** One control: `<Input>`, `<Select>`, `<Textarea>` or `<Checkbox>`. */
  children: ReactElement
  /** A hint under the control. */
  help?: ReactNode
  /** An error under the control; marks it aria-invalid. */
  error?: ReactNode
  /** Mark the label as required (the control's own `required` still applies). */
  required?: boolean
  /** Span every column of a FormGrid. */
  wide?: boolean
  className?: string
}

type ControlProps = { id?: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean | 'true' | 'false'; type?: string }

/**
 * A label, a control, and optional help and error text, wired together: the
 * label points at the control, which is described by the help and error.
 * A checkbox child puts the label beside it.
 */
export function Field({ label, children, help, error, required, wide, className }: FieldProps) {
  const autoId = useId()
  const child = Children.only(children) as ReactElement<ControlProps>
  const id = child.props.id ?? autoId
  const helpId = help ? `${id}-help` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [child.props['aria-describedby'], helpId, errorId].filter(Boolean).join(' ') || undefined
  const check = child.props.type === 'checkbox' || child.type === Checkbox
  const control = cloneElement(child, {
    id,
    'aria-describedby': describedBy,
    ...(error ? { 'aria-invalid': true } : {}),
  })
  return (
    <div className={cx('hu-field', check && 'hu-field--check', wide && 'hu-field--wide', className)}>
      <label className="hu-field__label" htmlFor={id}>
        {label}
        {required && (
          <span className="hu-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {control}
      {help && (
        <small className="hu-field__help" id={helpId}>
          {help}
        </small>
      )}
      {error && (
        <small className="hu-field__error" id={errorId} role="alert">
          {error}
        </small>
      )}
    </div>
  )
}

/** A grid of Fields, as many 220px+ columns as fit. */
export function FormGrid({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('hu-form-grid', className)} {...rest} />
}

/** The row of buttons under a form. */
export function FormActions({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('hu-form-actions', className)} {...rest} />
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(rest.type === 'checkbox' ? 'hu-checkbox' : 'hu-input', className)} {...rest} />
}

export function Checkbox({ className, ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return <input type="checkbox" className={cx('hu-checkbox', className)} {...rest} />
}

export function Select({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cx('hu-select', className)} {...rest} />
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx('hu-textarea', className)} {...rest} />
}
