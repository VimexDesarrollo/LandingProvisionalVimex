/**
 * AuthPage.test.tsx — Tests del flujo de autenticación frontend
 *
 * Principios aplicados:
 * - Los tests intentan romper el flujo, no solo verificar el camino feliz
 * - Mocking mínimo: solo el authService (no queremos testear fetch)
 * - Verificamos comportamiento observable (UI, navegación), no implementación interna
 * - Los tests de seguridad verifican que datos sensibles no estén en el DOM
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRouterReplace = vi.fn()
const mockRouterPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockRouterReplace,
    push:    mockRouterPush,
  }),
  useSearchParams: () => new URLSearchParams('returnUrl=/residences/villa-test/checkout'),
}))

const mockLogin    = vi.fn()
const mockRegister = vi.fn()
const mockLogout   = vi.fn()
const mockRevalidate = vi.fn()

vi.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    status:          'unauthenticated',
    user:            null,
    isLoading:       false,
    isAuthenticated: false,
    login:           mockLogin,
    register:        mockRegister,
    logout:          mockLogout,
    revalidate:      mockRevalidate,
    loginWithGoogle: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/services/authService', () => ({
  initiateGoogleAuth: vi.fn(),
  readAndClearReturnUrl: vi.fn(() => '/'),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getMe: vi.fn(),
  refreshToken: vi.fn(),
}))

vi.mock('@/hooks/useCountries', () => ({
  useCountries: () => ({
    countries: [
      { code: 'MX', name: 'Mexico', dialCode: '+52', flagEmoji: 'MX' },
      { code: 'US', name: 'United States', dialCode: '+1', flagEmoji: 'US' },
    ],
    isLoading: false,
  }),
}))

vi.mock('@/components/booking-request/CountryCombobox', () => ({
  CountryCombobox: ({
    value,
    onChange,
    label,
  }: {
    value: string
    onChange: (value: string) => void
    label: string
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  ),
}))

import React from 'react'
import { LoginForm } from '../LoginForm'
import { RegisterForm } from '../RegisterForm'

// ---------------------------------------------------------------------------
// LoginForm tests
// ---------------------------------------------------------------------------

describe('LoginForm', () => {
  beforeEach(() => {
    mockLogin.mockReset()
  })

  it('renders email and password fields', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    render(<LoginForm />)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email format', async () => {
    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/email/i)
    await userEvent.type(emailInput, 'notanemail')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument()
    })
  })

  it('calls login with correct credentials on valid submit', async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText(/email/i), 'test@vimex.mx')
    await userEvent.type(screen.getByLabelText(/password/i), 'SecurePass!99')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email:    'test@vimex.mx',
        password: 'SecurePass!99',
      })
    })
  })

  it('shows server error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce({ nonFieldErrors: 'Invalid credentials. Please try again.' })
    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText(/email/i), 'test@vimex.mx')
    await userEvent.type(screen.getByLabelText(/password/i), 'WrongPassword!')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials. Please try again.')
    })
  })

  it('disables submit button while loading', async () => {
    // login que nunca resuelve — simula loading prolongado
    mockLogin.mockImplementationOnce(() => new Promise(() => {}))
    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText(/email/i), 'test@vimex.mx')
    await userEvent.type(screen.getByLabelText(/password/i), 'SecurePass!99')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
    })
  })

  it('does not expose password value in any DOM text node', async () => {
    render(<LoginForm />)
    const passwordInput = screen.getByLabelText(/password/i)
    await userEvent.type(passwordInput, 'MySecret!Pass99')

    // La contraseña no debe aparecer en ningún texto del DOM
    expect(screen.queryByText('MySecret!Pass99')).not.toBeInTheDocument()
    // El input debe ser type="password"
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('calls onSuccess callback after successful login', async () => {
    const onSuccess = vi.fn()
    mockLogin.mockResolvedValueOnce(undefined)
    render(<LoginForm onSuccess={onSuccess} />)

    await userEvent.type(screen.getByLabelText(/email/i), 'test@vimex.mx')
    await userEvent.type(screen.getByLabelText(/password/i), 'SecurePass!99')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce()
    })
  })
})

// ---------------------------------------------------------------------------
// RegisterForm tests
// ---------------------------------------------------------------------------

describe('RegisterForm', () => {
  beforeEach(() => {
    mockRegister.mockReset()
  })

  it('renders all required fields', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('validates password minimum length', async () => {
    render(<RegisterForm />)

    await userEvent.type(screen.getByLabelText(/first name/i), 'Test')
    await userEvent.type(screen.getByLabelText(/last name/i), 'User')
    await userEvent.type(screen.getByLabelText(/email/i), 'test@vimex.mx')
    await userEvent.type(screen.getByLabelText(/password/i), '123')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
    })
  })

  it('shows server-side duplicate email error', async () => {
    mockRegister.mockRejectedValueOnce({
      fieldErrors: { email: 'An account with this email already exists.' },
    })
    render(<RegisterForm />)

    await userEvent.type(screen.getByLabelText(/first name/i), 'Test')
    await userEvent.type(screen.getByLabelText(/last name/i), 'User')
    await userEvent.type(screen.getByLabelText(/email/i), 'existing@vimex.mx')
    await userEvent.type(screen.getByLabelText(/phone code/i), '+52')
    await userEvent.type(screen.getByLabelText(/phone number/i), '9841234567')
    await userEvent.type(screen.getByLabelText(/password/i), 'StrongPass!42')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/already exists/i)).toBeInTheDocument()
    })
  })

  it('does not expose password in DOM after failed submit', async () => {
    mockRegister.mockRejectedValueOnce({ nonFieldErrors: 'Something went wrong.' })
    render(<RegisterForm />)

    const passwordInput = screen.getByLabelText(/password/i)
    await userEvent.type(passwordInput, 'MySecret!Pass99')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.queryByText('MySecret!Pass99')).not.toBeInTheDocument()
      expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })

  it('calls onSuccess after successful registration', async () => {
    const onSuccess = vi.fn()
    mockRegister.mockResolvedValueOnce(undefined)
    render(<RegisterForm onSuccess={onSuccess} />)

    await userEvent.type(screen.getByLabelText(/first name/i), 'Ana')
    await userEvent.type(screen.getByLabelText(/last name/i), 'López')
    await userEvent.type(screen.getByLabelText(/email/i), 'ana@vimex.mx')
    await userEvent.type(screen.getByLabelText(/phone code/i), '+52')
    await userEvent.type(screen.getByLabelText(/phone number/i), '9841234567')
    await userEvent.type(screen.getByLabelText(/password/i), 'StrongPass!42')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce()
    })
  })

  it('does not call register service if form validation fails', async () => {
    render(<RegisterForm />)
    // Intentar submit con form vacío
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockRegister).not.toHaveBeenCalled()
    })
  })
})
