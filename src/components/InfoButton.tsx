import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

const WIDTH = 420

export interface InfoButtonProps {
  /** What the note is about; the button reads "About <title>". */
  title: string
  /** The note. */
  children: ReactNode
}

/**
 * The "?" beside a title: a click opens a short note in place of a paragraph
 * always on screen. A second click, Escape or a click elsewhere closes it.
 * The note is rendered into document.body, so no modal or scroll box clips it.
 */
export function InfoButton({ title, children }: InfoButtonProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left: number }>({ top: 0, left: 0 })
  const [theme, setTheme] = useState<string | undefined>()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const noteRef = useRef<HTMLDivElement>(null)
  const noteId = useId()

  const toggle = () => {
    if (open) return setOpen(false)
    const r = buttonRef.current?.getBoundingClientRect()
    if (r) {
      const left = Math.max(8, Math.min(r.left - 8, window.innerWidth - WIDTH - 8))
      const below = window.innerHeight - r.bottom
      // Open upward when the room below is short and there is more above.
      setPos(below < 240 && r.top > below ? { bottom: window.innerHeight - r.top + 6, left } : { top: r.bottom + 6, left })
    }
    // The note takes the theme of the button's surroundings.
    setTheme(buttonRef.current?.closest('[data-theme]')?.getAttribute('data-theme') ?? undefined)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (!noteRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const close = () => setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', close)
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="hu-info-btn"
        aria-label={`About ${title}`}
        aria-expanded={open}
        aria-controls={open ? noteId : undefined}
        onClick={toggle}
      >
        ?
      </button>
      {open &&
        createPortal(
          <div
            ref={noteRef}
            id={noteId}
            role="note"
            aria-label={title}
            className="hu-info-note"
            data-theme={theme}
            style={pos}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  )
}
