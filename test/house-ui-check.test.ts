import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const bin = fileURLToPath(new URL('../bin/house-ui-check.mjs', import.meta.url))
const fixture = (name: string) => fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url))
const run = (cwd: string, args: string[] = []) => spawnSync(process.execPath, [bin, ...args], { cwd, encoding: 'utf8' })

describe('house-ui-check', () => {
  it('prints nothing and exits 0 for a clean app (app-tokens.css and tests skipped)', () => {
    const r = run(fixture('clean'))
    expect(r.stderr).toBe('')
    expect(r.stdout).toBe('')
    expect(r.status).toBe(0)
  })

  it('reports every kind of problem as file:line: problem and exits 1', () => {
    const r = run(fixture('dirty'))
    expect(r.stdout).toBe(readFileSync(`${fixture('dirty')}/expected.txt`, 'utf8'))
    expect(r.status).toBe(1)
  })

  it('reports each problem kind at least once', () => {
    const out = run(fixture('dirty')).stdout
    for (const kind of [
      'global element rule',
      'colour literal #',
      'colour literal rgba()',
      'uses palette token',
      'defines palette token',
      'font-size 14px',
      'font size in `font:',
      'box-shadow is not',
      'text-shadow is not',
      "styles house-ui's class .hu-btn",
      'in an inline style',
      'in fill=',
    ]) {
      expect(out).toContain(kind)
    }
  })

  it('takes directories as arguments', () => {
    const r = run(fixture('.'), ['clean/src', 'dirty/src/components'])
    expect(r.stdout.split('\n').filter(Boolean)).toHaveLength(5)
    expect(r.stdout).toMatch(/^dirty\/src\/components\/Chart\.tsx:5: /)
  })

  it('exits 2 for a missing directory', () => {
    const r = run(fixture('clean'), ['nope'])
    expect(r.status).toBe(2)
    expect(r.stderr).toContain('nope')
  })

  it('prints help', () => {
    const r = run(fixture('clean'), ['--help'])
    expect(r.status).toBe(0)
    expect(r.stdout).toContain('usage: house-ui-check')
  })
})
