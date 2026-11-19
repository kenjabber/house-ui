import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => cleanup())

// Node 25+ has a localStorage global of its own (undefined without
// --localstorage-file) that hides jsdom's; put jsdom's back.
const jsdomWindow = (globalThis as { jsdom?: { window: Window } }).jsdom?.window
if (typeof localStorage === 'undefined' && jsdomWindow) {
  Object.defineProperty(globalThis, 'localStorage', { value: jsdomWindow.localStorage, configurable: true })
}
