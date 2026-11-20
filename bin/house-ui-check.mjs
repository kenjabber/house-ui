#!/usr/bin/env node
// house-ui-check (PLAN D-17): reports where an app styles around house-ui.
//
//   house-ui-check [dir ...]     default: src
//
// Prints `file:line: problem` for each problem and exits 1; prints nothing
// and exits 0 when clean. It reads .css, .ts, .tsx, .js and .jsx files below
// each dir, skipping node_modules, dist, tests and app-tokens.css (the one
// file allowed palette tokens and literals, D-12). No dependencies.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, basename, extname } from 'node:path'

const HELP = `usage: house-ui-check [dir ...]

Checks an app's frontend source (default: src) against house-ui's rules:
  - colour literals (#hex, rgb(), hsl(), ...) in CSS and inline styles
  - font sizes not from a --text-* token
  - shadows not from a --shadow-* token
  - palette tokens (--color-*) used or defined outside app-tokens.css
  - rules that style house-ui's hu- classes
  - global element rules (*, button, input, a, ...) that override house-ui
  - dates and times formatted by hand (toLocaleDateString, a stored
    timestamp cut with .replace("T", " ")): use DateTime / formatDateTime
Prints file:line: problem per problem and exits 1, or nothing and exits 0.`

const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', 'coverage', '.git'])
const EXTS = new Set(['.css', '.ts', '.tsx', '.js', '.jsx'])

const COLOUR_FN = /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i
const HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![0-9a-z_-])/i
const PALETTE_USE = /var\(\s*(--color-[\w-]+)/
const ABS_SIZE = /\d(?:px|rem|pt|pc|cm|mm|in|q|vw|vh|vmin|vmax|dvh|svh|lvh|ch|ex|cap|lh|rlh)\b/i
const SIZE_KEYWORD = /^(?:xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large)$/i
const CSS_WIDE = /^(?:inherit|initial|unset|revert|revert-layer)$/i

function colourLiteral(value) {
  const v = stripStrings(value)
  const hex = v.match(HEX)
  if (hex) return hex[0]
  const fn = v.match(COLOUR_FN)
  if (fn) return `${fn[1]}()`
  return null
}

// Drops quoted strings and url(...) so `content: "#1"` or `url(#a)` don't count.
function stripStrings(s) {
  return s.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""').replace(/url\([^)]*\)/gi, 'url()')
}

function lineAt(text, index) {
  let n = 1
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) n++
  return n
}

// ── CSS ──

function checkCss(text, report) {
  // Blank out comments, keeping newlines so line numbers hold.
  const src = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  const stack = [] // { kind: 'rule' | 'at', name }
  let buf = ''
  let bufStart = -1
  let quote = null
  let paren = 0

  const flush = (opening) => {
    const raw = buf
    const start = bufStart
    buf = ''
    bufStart = -1
    const trimmed = raw.trim()
    if (!trimmed) return opening ? stack.push({ kind: 'rule', name: '' }) : undefined
    const line = lineAt(src, start)
    if (opening) {
      if (trimmed.startsWith('@')) {
        stack.push({ kind: 'at', name: trimmed.split(/[\s(]/)[0].toLowerCase() })
      } else {
        stack.push({ kind: 'rule', name: trimmed })
        const inKeyframes = stack.some((c) => c.kind === 'at' && c.name.endsWith('keyframes'))
        if (!inKeyframes) checkSelector(trimmed, line, report)
      }
      return
    }
    if (trimmed.startsWith('@')) return // @import, @layer a, b;
    const top = stack[stack.length - 1]
    if (!top || top.kind !== 'rule') return
    const colon = trimmed.indexOf(':')
    if (colon < 0) return
    checkDeclaration(trimmed.slice(0, colon).trim().toLowerCase(), trimmed.slice(colon + 1).trim(), line, report)
  }

  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    if (quote) {
      if (ch === '\\') {
        buf += ch + (src[i + 1] ?? '')
        i++
        continue
      }
      if (ch === quote) quote = null
      buf += ch
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
    } else if (ch === '(') {
      paren++
    } else if (ch === ')') {
      paren = Math.max(0, paren - 1)
    } else if (paren === 0 && ch === '{') {
      flush(true)
      continue
    } else if (paren === 0 && ch === ';') {
      flush(false)
      continue
    } else if (paren === 0 && ch === '}') {
      flush(false)
      stack.pop()
      continue
    }
    if (bufStart < 0 && !/\s/.test(ch)) bufStart = i
    buf += ch
  }
}

function checkSelector(selector, line, report) {
  const hu = selector.match(/\.hu-[\w-]+/)
  if (hu) report(line, `rule styles house-ui's class ${hu[0]}; change house-ui instead`)
  for (const part of splitTopLevel(selector)) {
    const s = part.trim()
    if (!s || s.startsWith(':root')) continue
    // Strip pseudo-classes/elements (with their arguments) to see what is left.
    const bare = s.replace(/::?[\w-]+(\([^)]*\))?/g, '').trim()
    if (bare === '' || /[.#[&]/.test(bare)) continue
    if (/^[\d.%\s]+$|^(from|to)$/i.test(bare)) continue
    report(line, `global element rule \`${s}\` overrides house-ui's components; leave element defaults to its base.css`)
  }
}

// Splits a selector list at commas outside parentheses (`:is(h3, h4)` stays whole).
function splitTopLevel(selector) {
  const parts = []
  let depth = 0
  let cur = ''
  for (const ch of selector) {
    if (ch === '(') depth++
    else if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      parts.push(cur)
      cur = ''
    } else cur += ch
  }
  parts.push(cur)
  return parts
}

function checkDeclaration(prop, value, line, report) {
  if (prop.startsWith('--color-')) {
    report(line, `defines palette token ${prop}; palette tokens are house-ui's`)
    return
  }
  const palette = value.match(PALETTE_USE)
  if (palette) report(line, `uses palette token ${palette[1]}; use a semantic token`)
  const colour = colourLiteral(value)
  if (colour) report(line, `colour literal ${colour} in ${prop}; use a semantic token`)

  if (prop === 'font-size') {
    if (!value.includes('var(--text-') && !CSS_WIDE.test(value) && (ABS_SIZE.test(value) || SIZE_KEYWORD.test(value))) {
      report(line, `font-size ${value} is not a --text-* token`)
    }
  } else if (prop === 'font') {
    const v = stripStrings(value)
    if (!v.includes('var(--text-') && ABS_SIZE.test(v)) report(line, `font size in \`font: ${value}\` is not a --text-* token`)
  } else if (prop === 'box-shadow' || prop === 'text-shadow') {
    const ok =
      /^none$/i.test(value) ||
      CSS_WIDE.test(value) ||
      value.split(',').every((p) => /^var\(--shadow-[\w-]+\)$/.test(p.trim()))
    if (!ok) report(line, `${prop} is not a --shadow-* token`)
  }
}

// ── TS / TSX ──

const STYLE_START = /\bstyle\s*=\s*\{\s*\{/g
// Dates by hand (D-25): toLocaleDateString / toLocaleTimeString (always a
// date), new Date(...).toLocaleString (a number's toLocaleString is fine),
// and a stored timestamp cut to text with .replace("T", " ").
const DATE_BY_HAND = [
  /\.toLocale(?:Date|Time)String\(/g,
  /new Date\([^)]*\)\s*\.toLocaleString\(/g,
  /\.replace\(\s*["'`]T["'`]\s*,\s*["'`] ["'`]\s*\)/g,
]
const COLOUR_ATTR = /\b(fill|stroke|color|stopColor|floodColor|lightingColor)\s*=\s*\{?\s*["'`]\s*(#[0-9a-f]{3,8}\b|(?:rgba?|hsla?)\()/gi

function checkScript(text, report) {
  // Inline style objects: style={{ ... }}
  for (const m of text.matchAll(STYLE_START)) {
    let depth = 2
    let i = m.index + m[0].length
    const start = i
    while (i < text.length && depth > 0) {
      if (text[i] === '{') depth++
      else if (text[i] === '}') depth--
      i++
    }
    const body = text.slice(start, i - 2)
    for (const lit of body.matchAll(/["'`]([^"'`]*)["'`]/g)) {
      const colour = colourLiteral(lit[1])
      if (colour && !lit[1].includes('var(')) {
        report(lineAt(text, start + lit.index), `colour literal ${colour} in an inline style; use a semantic token`)
      }
    }
  }
  for (const m of text.matchAll(COLOUR_ATTR)) {
    report(lineAt(text, m.index), `colour literal in ${m[1]}=; use currentColor or a semantic token`)
  }
  for (const m of text.matchAll(/var\(\s*(--color-[\w-]+)/g)) {
    report(lineAt(text, m.index), `uses palette token ${m[1]}; use a semantic token`)
  }
  for (const re of DATE_BY_HAND) {
    for (const m of text.matchAll(re)) {
      report(lineAt(text, m.index), `date formatted by hand; use house-ui's DateTime or formatDateTime (the viewer's time zone)`)
    }
  }
}

// ── Files ──

function* walk(dir) {
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name)
    const st = statSync(path)
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(name)) yield* walk(path)
    } else if (EXTS.has(extname(name)) && !/\.(test|spec)\.[jt]sx?$/.test(name) && !name.endsWith('.d.ts')) {
      if (basename(name) !== 'app-tokens.css') yield path
    }
  }
}

function main(argv) {
  if (argv.includes('-h') || argv.includes('--help')) {
    console.log(HELP)
    return 0
  }
  const dirs = argv.length ? argv : ['src']
  const problems = []
  for (const dir of dirs) {
    let st
    try {
      st = statSync(dir)
    } catch {
      console.error(`house-ui-check: ${dir}: no such directory`)
      return 2
    }
    const files = st.isDirectory() ? [...walk(dir)] : [dir]
    for (const file of files) {
      const text = readFileSync(file, 'utf8')
      const rel = relative(process.cwd(), file) || file
      const report = (line, msg) => problems.push({ file: rel, line, msg })
      if (extname(file) === '.css') checkCss(text, report)
      else checkScript(text, report)
    }
  }
  problems.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1))
  for (const p of problems) console.log(`${p.file}:${p.line}: ${p.msg}`)
  return problems.length ? 1 : 0
}

process.exitCode = main(process.argv.slice(2))
