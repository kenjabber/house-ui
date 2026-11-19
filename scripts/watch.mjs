// `npm run watch`: rebuilds dist/ on every change, for an app linked to this
// working copy with `npm link` (PLAN D-5). Runs the three builds of
// `npm run build` in watch mode; Ctrl-C stops them all.
import { spawn } from 'node:child_process'
import { watch } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const bin = (name) => join(root, 'node_modules/.bin', name)
const run = (cmd, args) => spawn(cmd, args, { cwd: root, stdio: 'inherit' })

const css = () => run(process.execPath, [join(root, 'scripts/build-css.mjs')])
css()
let timer
watch(join(root, 'src/styles'), () => {
  clearTimeout(timer)
  timer = setTimeout(css, 100)
})

const children = [
  run(bin('vite'), ['build', '--watch']),
  run(bin('tsc'), ['-p', 'tsconfig.build.json', '--watch', '--preserveWatchOutput']),
]
process.on('SIGINT', () => {
  for (const c of children) c.kill('SIGINT')
  process.exit(0)
})
