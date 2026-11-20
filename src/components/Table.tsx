import type { HTMLAttributes, ReactNode, TableHTMLAttributes } from 'react'
import { cx } from '../cx'

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Keep the header row in view while the wrap scrolls. */
  stickyHead?: boolean
}

/**
 * A data table. Write `thead`/`tbody` yourself. Cell classes: `hu-num`
 * (right-aligned figures), `hu-nowrap`. Row classes: `hu-row--clickable`,
 * `hu-row--selected`, `hu-row--detail` (see TableDetailRow).
 */
export function Table({ stickyHead, className, ...rest }: TableProps) {
  return <table className={cx('hu-table', stickyHead && 'hu-table--sticky', className)} {...rest} />
}

export interface TableWrapProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * In a `<Page fill>` (or a `<Card fill>`): as tall as the rows, growing with
   * them up to the rest of the page, then scroll both ways by itself; use
   * with `<Table stickyHead>` so the header stays in view.
   */
  fill?: boolean
}

/** The bordered box around a Table; scrolls sideways when the table is wide. */
export function TableWrap({ fill, className, ...rest }: TableWrapProps) {
  return <div className={cx('hu-table-wrap', fill && 'hu-table-wrap--fill', className)} {...rest} />
}

/** A tbody row saying the table is empty. */
export function TableEmpty({ colSpan, children = 'Nothing here yet.' }: { colSpan: number; children?: ReactNode }) {
  return (
    <tr className="hu-table__empty">
      <td colSpan={colSpan}>{children}</td>
    </tr>
  )
}

export interface TableDetailRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** The number of columns, so the one cell spans the row. */
  colSpan: number
  /** The selected row's editor or details. */
  children?: ReactNode
}

/**
 * A row right under a selected row (`hu-row--selected`) that holds that
 * row's editor: the panel surface, no hover highlight, joined to the row
 * above. Renders `<tr className="hu-row--detail"><td colSpan>`.
 */
export function TableDetailRow({ colSpan, className, children, ...rest }: TableDetailRowProps) {
  return (
    <tr className={cx('hu-row--detail', className)} {...rest}>
      <td colSpan={colSpan}>{children}</td>
    </tr>
  )
}
