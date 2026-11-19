import { createContext, useContext } from 'react'

export interface ShellState {
  collapsed: boolean
  toggleCollapsed: () => void
  navOpen: boolean
  setNavOpen: (open: boolean) => void
  sidebarId: string
}

const noop = () => {}

export const ShellContext = createContext<ShellState>({
  collapsed: false,
  toggleCollapsed: noop,
  navOpen: false,
  setNavOpen: noop,
  sidebarId: 'hu-sidebar',
})

/** The shell's state, for a component inside AppShell. */
export function useShell(): ShellState {
  return useContext(ShellContext)
}
