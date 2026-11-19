import { render, screen } from '@testing-library/react'
import { Checkbox, Field, Input, Select } from './Form'

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

describe('Input and Select', () => {
  it('are as wide as their content with `inline`, and fill their field without it', () => {
    render(
      <>
        <Input aria-label="ref" inline />
        <Select aria-label="kind" inline>
          <option>all</option>
        </Select>
        <Input aria-label="name" />
        <Input type="checkbox" aria-label="on" inline />
      </>,
    )
    expect(screen.getByRole('textbox', { name: 'ref' }).className).toBe('hu-input hu-input--inline')
    expect(screen.getByRole('combobox', { name: 'kind' }).className).toBe('hu-select hu-select--inline')
    expect(screen.getByRole('textbox', { name: 'name' }).className).toBe('hu-input')
    expect(screen.getByRole('checkbox', { name: 'on' }).className).toBe('hu-checkbox')
    expect(screen.getByRole('textbox', { name: 'ref' })).not.toHaveAttribute('inline')
  })
})
