import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { Modal } from './Modal'

function Harness({ closeOnBackdrop }: { closeOnBackdrop?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && (
        <Modal title="Delete it?" onClose={() => setOpen(false)} closeOnBackdrop={closeOnBackdrop} footer={<button>OK</button>}>
          <input aria-label="first" />
        </Modal>
      )}
    </>
  )
}

describe('Modal', () => {
  it('is a labelled dialog that takes focus and gives it back on Escape', () => {
    render(<Harness />)
    const opener = screen.getByRole('button', { name: 'Open' })
    opener.focus()
    fireEvent.click(opener)
    const dialog = screen.getByRole('dialog', { name: 'Delete it?' })
    expect(dialog).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(opener).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('closes from the × and from the backdrop, unless told not to', () => {
    const { unmount } = render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.mouseDown(document.querySelector('.hu-modal-overlay')!)
    expect(screen.queryByRole('dialog')).toBeNull()
    unmount()

    render(<Harness closeOnBackdrop={false} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.mouseDown(document.querySelector('.hu-modal-overlay')!)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('keeps Tab inside the dialog', () => {
    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    const ok = screen.getByRole('button', { name: 'OK' })
    ok.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(ok).toHaveFocus()
  })
})
