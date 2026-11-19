// Builds dist/house-ui.css (PLAN D-20) from src/styles/house-ui.css by
// inlining its @import lines in order. Every part is already wrapped in
// @layer house-ui (D-19). No dependencies.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const styles = join(root, 'src/styles')
const index = readFileSync(join(styles, 'house-ui.css'), 'utf8')
const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version

const parts = []
for (const m of index.matchAll(/^@import\s+"\.\/([^"]+)";$/gm)) {
  parts.push(`/* ── ${m[1]} ── */\n` + readFileSync(join(styles, m[1]), 'utf8').trim())
}
if (parts.length === 0) throw new Error('src/styles/house-ui.css lists no @import lines')

const out = `/* house-ui ${version} — https://github.com/kenjabber/house-ui */\n@layer house-ui;\n\n${parts.join('\n\n')}\n`
mkdirSync(join(root, 'dist'), { recursive: true })
writeFileSync(join(root, 'dist/house-ui.css'), out)
console.log(`dist/house-ui.css: ${parts.length} parts, ${out.length} bytes`)
