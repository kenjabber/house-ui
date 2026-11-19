import { render, screen } from '@testing-library/react'
import { Checkbox, Field, Input } from './Form'

describe('Field', () => {
  it('labels the control and describes it with help and error', () => {
    render(
      <Field label="Port" help="1 to 65535" error="Too big">
        <Input defaultValue="70000" />
      </Field>,
    )
    const input = screen.getByLabelText('Port')
    expect(input).toHaveClass('hu-input')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('1 to 65535 Too big')
    expect(screen.getByRole('alert')).toHaveTextContent('Too big')
  })

  it("keeps the control's own id", () => {
    render(
      <Field label="Name">
        <Input id="name" />
      </Field>,
    )
    expect(screen.getByLabelText('Name')).toHaveAttribute('id', 'name')
  })

  it('lays out a checkbox with its label beside it', () => {
    const { container } = render(
      <Field label="Deploy on push">
        <Checkbox />
      </Field>,
    )
    expect(container.firstChild).toHaveClass('hu-field', 'hu-field--check')
    expect(screen.getByLabelText('Deploy on push')).toHaveAttribute('type', 'checkbox')
  })
})
