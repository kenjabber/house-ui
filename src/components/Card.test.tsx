import { render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Card } from './Card'
import { Page } from './PageHead'
import { TableWrap } from './Table'

describe('Card', () => {
  it('renders the head, the body and the actions row', () => {
    const { container } = render(
      <Card title="Backups" headActions={<button>Run now</button>} actions={<button>Save</button>}>
        <p>Body</p>
      </Card>,
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Backups' })).toHaveClass('hu-card__title')
    expect(screen.getByRole('button', { name: 'Run now' }).parentElement).toHaveClass('hu-card__head-actions')
    expect(screen.getByRole('button', { name: 'Save' }).parentElement).toHaveClass('hu-card__actions')
    expect(container.querySelector('.hu-card')).not.toHaveClass('hu-card--fill')
  })

  it('fill adds hu-card--fill and keeps the other classes and children', () => {
    const { container } = render(
      <Page fill>
        <Card fill title="Router config" className="x">
          <div role="alert">A banner</div>
          <div className="hu-fill">split</div>
        </Card>
      </Page>,
    )
    const card = container.querySelector('.hu-page--fill > .hu-card')
    expect(card).toHaveClass('hu-card', 'hu-card--fill', 'x')
    expect(card?.children[0]).toHaveClass('hu-card__head')
    expect(card?.lastElementChild).toHaveClass('hu-fill')
  })

  it('a TableWrap fill can sit straight in a fill card', () => {
    const { container } = render(
      <Card fill>
        <TableWrap fill />
      </Card>,
    )
    expect(container.querySelector('.hu-card--fill > .hu-table-wrap--fill')).not.toBeNull()
  })
})

describe('card.css fill rules', () => {
  // jsdom does no layout, so check the rules the layout rests on.
  const css = readFileSync(resolve(process.cwd(), 'src/styles/card.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  const rule = (selector: string) => {
    const at = css.indexOf(selector)
    expect(at, selector).toBeGreaterThan(-1)
    return css.slice(css.indexOf('{', at), css.indexOf('}', at))
  }

  it('a fill page is as wide as the main area (D-22)', () => {
    expect(rule('.hu-page--fill {')).toMatch(/max-width: none/)
  })

  it('the page lets a fill card and a .hu-fill take the rest', () => {
    const r = rule('.hu-page--fill > .hu-card--fill,\n  .hu-page--fill > .hu-fill {')
    expect(r).toMatch(/flex: 1 1 auto/)
    expect(r).toMatch(/min-height: 0/)
  })

  it('a TableWrap fill, and a fill card around one, hug their rows up to the rest', () => {
    const r = rule('.hu-page--fill > .hu-table-wrap--fill,\n  .hu-page--fill > .hu-card--fill:has(> .hu-table-wrap--fill) {')
    expect(r).toMatch(/flex: 0 1 auto/)
    expect(r).toMatch(/min-height: 0/)
    const c = rule('.hu-card--fill > .hu-table-wrap--fill {')
    expect(c).toMatch(/flex: 0 1 auto/)
    expect(c).toMatch(/min-height: 0/)
  })

  it('a fill card is a flex column whose .hu-fill grows and the rest keep their height', () => {
    expect(rule('.hu-card--fill {')).toMatch(/flex-direction: column/)
    expect(rule('.hu-card--fill > * {')).toMatch(/flex-shrink: 0/)
    const r = rule('.hu-card--fill > .hu-fill {')
    expect(r).toMatch(/flex: 1 1 auto/)
    expect(r).toMatch(/min-height: 0/)
    expect(r).toMatch(/min-width: 0/)
  })

  it('at phone width a page with a fill card is an ordinary page', () => {
    const phone = css.slice(css.indexOf('@container hu-shell (max-width: 600px)'))
    expect(phone).toMatch(/\.hu-page--fill:has\(> \.hu-card--fill\) \{\s*height: auto;/)
    expect(phone).toMatch(/\.hu-page--fill > \.hu-card--fill,[\s\S]*?flex: none;/)
  })
})
