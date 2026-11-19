import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// `npm run dev` serves the kitchen sink (PLAN D-14) on port 5673 (the apps use
// 5173 stocker, 5273 NetConfig, 5373 kwicky, 5473 NestEgg, 5573 AppConfig).
// `vite build` builds the library's JS into dist/ (PLAN D-20); the stylesheet
// is built by scripts/build-css.mjs and the types by tsc (see `npm run build`).
export default defineConfig(({ command }) =>
  command === 'build'
    ? {
        plugins: [react()],
        build: {
          outDir: here('dist'),
          // `npm run build` empties dist/ first; the watch build must not
          // delete the stylesheet and types the other watchers write there.
          emptyOutDir: false,
          sourcemap: true,
          lib: {
            entry: here('src/index.ts'),
            formats: ['es'],
            fileName: () => 'index.js',
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
          },
        },
      }
    : {
        root: here('kitchen'),
        plugins: [react()],
        server: { host: 'localhost', port: 5673, strictPort: true },
      },
)
