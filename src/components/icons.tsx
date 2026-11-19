// The few icons house-ui's own pieces use, and that every app's header
// needs. Apps bring their own icons for everything else (inline SVG).
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = { width: '1em', height: '1em', 'aria-hidden': true, focusable: false } as const

/** The settings gear (from stocker's header). */
export function GearIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base} {...props}>
      <path d="M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm7.43-2.5c.04-.32.07-.65.07-1s-.03-.69-.07-1l2.14-1.67a.5.5 0 0 0 .12-.64l-2.03-3.51a.5.5 0 0 0-.61-.22l-2.52 1.01a7.4 7.4 0 0 0-1.72-.99l-.38-2.68A.49.49 0 0 0 14 2h-4a.49.49 0 0 0-.49.42l-.38 2.68a7.4 7.4 0 0 0-1.72.99L4.89 5.08a.5.5 0 0 0-.61.22L2.25 8.81a.49.49 0 0 0 .12.64L4.51 11.5c-.04.32-.07.65-.07 1s.03.68.07 1L2.37 15.17a.5.5 0 0 0-.12.64l2.03 3.51c.13.22.38.3.61.22l2.52-1.01c.54.38 1.12.69 1.72.99l.38 2.68c.06.24.27.42.49.42h4c.22 0 .43-.18.49-.42l.38-2.68a7.4 7.4 0 0 0 1.72-.99l2.52 1.01c.23.08.48 0 .61-.22l2.03-3.51a.49.49 0 0 0-.12-.64L19.43 13z" />
    </svg>
  )
}

/** A person (the user menu). */
export function PersonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base} {...props}>
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  )
}

/** Three lines (the compact shell's menu button). */
export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...base} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

/** A plus (add). */
export function PlusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
