import type { HTMLAttributes } from 'react'
import { cx } from '../cx'

/** The five status kinds (PLAN D-11). Each app maps its own states onto these. */
export type ChipKind = 'ok' | 'warn' | 'bad' | 'info' | 'neutral'

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Default `neutral`. */
  kind?: ChipKind
}

/** A status label. */
export function Chip({ kind = 'neutral', className, ...rest }: ChipProps) {
  return <span className={cx('hu-chip', kind !== 'neutral' && `hu-chip--${kind}`, className)} {...rest} />
}
