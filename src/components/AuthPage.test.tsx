import { fireEvent, render, screen } from '@testing-library/react'
import { AuthPage } from './AuthPage'
import { Button } from './Button'
import { Field, Input } from './Form'

describe('AuthPage', () => {
  it('renders the title, subtitle, form and footer, and submits', () => {
    let submitted = 0
    render(
      <AuthPage
        title="Sign in"
        subtitle="Use your passkey."
        footer={<a href="/register">Register</a>}
        onSubmit={(e) => {
          e.preventDefault()
          submitted++
        }}
      >
        <Field label="Username">
          <Input />
        </Field>
        <Button type="submit" variant="primary">
          Sign in with passkey
        </Button>
      </AuthPage>,
    )
    expect(screen.getByRole('main')).toHaveClass('hu-auth')
    expect(screen.getByRole('heading', { level: 1, name: 'Sign in' })).toBeInTheDocument()
    expect(screen.getByText('Use your passkey.')).toHaveClass('hu-auth__subtitle')
    expect(screen.getByRole('link', { name: 'Register' }).closest('p')).toHaveClass('hu-auth__footer')
    expect(screen.queryByRole('alert')).toBeNull()
    const button = screen.getByRole('button', { name: 'Sign in with passkey' })
    expect(button.parentElement?.tagName).toBe('FORM')
    expect(button.parentElement).toHaveClass('hu-auth__form')
    fireEvent.click(button)
    expect(submitted).toBe(1)
  })

  it('shows an error as a bad Banner', () => {
    render(<AuthPage title="Sign in" error="The passkey was not accepted." />)
    expect(screen.getByRole('alert')).toHaveTextContent('The passkey was not accepted.')
  })

  it('without onSubmit puts the children in a plain column, and leaves out what is not given', () => {
    const { container } = render(
      <AuthPage title="Sign in">
        <p>This browser does not support passkeys.</p>
      </AuthPage>,
    )
    expect(container.querySelector('form')).toBeNull()
    expect(screen.getByText(/does not support/).parentElement).toHaveClass('hu-auth__form')
    expect(container.querySelector('.hu-auth__subtitle')).toBeNull()
    expect(container.querySelector('.hu-auth__footer')).toBeNull()
  })
})
