import { cx } from '../cx'

export interface DiffViewProps {
  /** A unified diff (`diff -u`, `git diff`). */
  diff: string
  /** The block's accessible name. Default "diff". */
  label?: string
  className?: string
}

function lineClass(line: string): string {
  if (line.startsWith('+++') || line.startsWith('---')) return 'hu-diff__line'
  if (line.startsWith('+')) return 'hu-diff__line hu-diff__line--add'
  if (line.startsWith('-')) return 'hu-diff__line hu-diff__line--del'
  if (line.startsWith('@@')) return 'hu-diff__line hu-diff__line--hunk'
  return 'hu-diff__line'
}

/**
 * A unified diff with added, removed and hunk lines coloured. Lines span the
 * scroll width, so a long line's colour does not stop at the edge.
 */
export function DiffView({ diff, label = 'diff', className }: DiffViewProps) {
  const lines = diff.replace(/\n$/, '').split('\n')
  return (
    <pre className={cx('hu-diff', className)} aria-label={label}>
      <span className="hu-diff__body">
        {lines.map((line, i) => (
          <span key={i} className={lineClass(line)}>
            {line || ' '}
          </span>
        ))}
      </span>
    </pre>
  )
}
