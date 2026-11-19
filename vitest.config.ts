import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  esbuild: { jsx: 'automatic' },
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.ts'],
    environment: 'jsdom',
    environmentMatchGlobs: [['test/**', 'node']],
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: false,
  },
})
