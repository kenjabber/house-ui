import { render, screen } from '@testing-library/react'
import { DiffView } from './DiffView'

describe('DiffView', () => {
  it('colours added, removed and hunk lines, and leaves file headers and context plain', () => {
    const diff = '--- a/Caddyfile\n+++ b/Caddyfile\n@@ -1,3 +1,3 @@\n kwicky.kenjabber.ai {\n-  reverse_proxy old:80\n+  reverse_proxy new:80\n\n}\n'
    render(<DiffView diff={diff} />)
    const pre = screen.getByLabelText('diff')
    expect(pre).toHaveClass('hu-diff')
    const lines = [...pre.querySelectorAll('.hu-diff__body > span')]
    expect(lines.map((l) => l.className)).toEqual([
      'hu-diff__line',
      'hu-diff__line',
      'hu-diff__line hu-diff__line--hunk',
      'hu-diff__line',
      'hu-diff__line hu-diff__line--del',
      'hu-diff__line hu-diff__line--add',
      'hu-diff__line',
      'hu-diff__line',
    ])
    expect(lines[6].textContent).toBe(' ')
  })

  it('takes a label', () => {
    render(<DiffView diff="+a" label="Caddyfile diff" />)
    expect(screen.getByLabelText('Caddyfile diff')).toBeInTheDocument()
  })
})
