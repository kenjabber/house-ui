import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url)), 'utf8')

/** The custom properties declared in the block that starts after `marker`. */
function block(marker: string): Map<string, string> {
  const start = css.indexOf(marker)
  expect(start, marker).toBeGreaterThanOrEqual(0)
  const open = css.indexOf('{', start)
  const close = css.indexOf('}', open)
  const out = new Map<string, string>()
  for (const m of css.slice(open + 1, close).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out.set(m[1], m[2].trim())
  return out
}

describe('tokens.css', () => {
  const light = block(':root,\n  [data-theme="light"]')
  const systemDark = block(':root:not([data-theme="light"])')
  const dark = block('[data-theme="dark"] {')

  it('declares the dark layer identically for the system setting and data-theme="dark"', () => {
    expect([...systemDark]).toEqual([...dark])
  })

  it('only redefines semantic tokens in dark, never palette ones', () => {
    for (const name of dark.keys()) expect(name.startsWith('--color-'), name).toBe(false)
  })

  it('has a light value for every dark token', () => {
    for (const name of dark.keys()) expect(light.has(name), name).toBe(true)
  })

  it('repeats in dark every light token whose value uses a token that dark changes', () => {
    for (const [name, value] of light) {
      const uses = [...value.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1])
      if (uses.some((u) => dark.has(u) && !u.startsWith('--color-'))) expect(dark.has(name), name).toBe(true)
    }
  })

  it('wraps everything in @layer house-ui', () => {
    for (const file of ['tokens', 'base', 'button', 'chip', 'card', 'shell', 'table', 'table-filter', 'modal', 'form']) {
      const text = readFileSync(fileURLToPath(new URL(`../src/styles/${file}.css`, import.meta.url)), 'utf8')
      const code = text.replace(/\/\*[\s\S]*?\*\//g, '').trim()
      expect(code.startsWith('@layer house-ui {'), file).toBe(true)
      expect(code.endsWith('}'), file).toBe(true)
    }
  })
})
