import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthModePage } from '@/routes/AuthModePage'

const mockRouterReplace = vi.fn()
const mockRouterPush = vi.fn()
let mockSearchParams = new URLSearchParams('returnUrl=/residences/villa-test/checkout')

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockRouterReplace,
    push: mockRouterPush,
  }),
  useSearchParams: () => mockSearchParams,
}))

const mockRegister = vi.fn()
const mockLogin = vi.fn()

interface AuthState {
  status: 'loading' | 'authenticated' | 'unauthenticated'
  isAuthenticated: boolean
}

let authState: AuthState = { status: 'unauthenticated', isAuthenticated: false }

vi.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    ...authState,
    user: null,
    isLoading: false,
    login: mockLogin,
    register: mockRegister,
    logout: vi.fn(),
    revalidate: vi.fn(),
    loginWithGoogle: vi.fn(),
  }),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children),
}))

vi.mock('@/components/auth/RegisterForm', () => ({
  RegisterForm: ({ onSuccess }: { onSuccess?: () => void }) => (
    <button type="button" onClick={onSuccess} data-testid="trigger-register-success">
      trigger register success
    </button>
  ),
}))

vi.mock('@/components/auth/LoginForm', () => ({
  LoginForm: ({ onSuccess }: { onSuccess?: () => void }) => (
    <button type="button" onClick={onSuccess} data-testid="trigger-login-success">
      trigger login success
    </button>
  ),
}))

vi.mock('@/components/auth/GoogleAuthButton', () => ({
  GoogleAuthButton: ({ label }: { label: string }) => <div>{label}</div>,
}))

vi.mock('@/components/auth/GuestContinueSection', () => ({
  GuestContinueSection: ({ onContinueAsGuest }: { onContinueAsGuest?: () => void }) => (
    <button type="button" onClick={onContinueAsGuest} data-testid="guest-continue">
      Continue as guest
    </button>
  ),
}))

function resetState() {
  mockRegister.mockReset()
  mockLogin.mockReset()
  mockRouterReplace.mockReset()
  mockRouterPush.mockReset()
  mockSearchParams = new URLSearchParams('returnUrl=/residences/villa-test/checkout')
  authState = { status: 'unauthenticated', isAuthenticated: false }
}

describe('AuthModePage', () => {
  beforeEach(resetState)

  it('renders login mode with switch link that preserves returnUrl', () => {
    render(<AuthModePage mode="login" />)

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByText(/sign in with google/i)).toBeInTheDocument()
    expect(screen.getByTestId('trigger-login-success')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /create account/i })).toHaveAttribute(
      'href',
      '/auth/register?returnUrl=%2Fresidences%2Fvilla-test%2Fcheckout',
    )
  })

  it('renders register mode with switch link that preserves returnUrl', () => {
    render(<AuthModePage mode="register" />)

    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument()
    expect(screen.getByText(/sign up with google/i)).toBeInTheDocument()
    expect(screen.getByTestId('trigger-register-success')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      '/auth/login?returnUrl=%2Fresidences%2Fvilla-test%2Fcheckout',
    )
  })

  it('redirects to the sanitized returnUrl after successful login', async () => {
    const user = userEvent.setup()
    render(<AuthModePage mode="login" />)

    await user.click(screen.getByTestId('trigger-login-success'))

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith('/residences/villa-test/checkout')
    })
  })

  it('shows the thank-you screen after successful registration with booking context', async () => {
    const user = userEvent.setup()
    render(<AuthModePage mode="register" />)

    await user.click(screen.getByTestId('trigger-register-success'))

    await waitFor(() => {
      expect(screen.getByText(/account created/i)).toBeInTheDocument()
    })
  })

  it('redirects registration without booking context straight to home', async () => {
    const user = userEvent.setup()
    mockSearchParams = new URLSearchParams()

    render(<AuthModePage mode="register" />)

    await user.click(screen.getByTestId('trigger-register-success'))

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith('/')
    })
  })

  it('redirects checkout auth links to the guest-details step', async () => {
    mockSearchParams = new URLSearchParams('returnUrl=/residences/villa-test/checkout?checkoutSession=session-1')

    render(<AuthModePage mode="login" />)

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith('/residences/villa-test/guest-details?checkoutSession=session-1')
    })
  })

  it('sanitizes external returnUrl values before building auth navigation', () => {
    mockSearchParams = new URLSearchParams('returnUrl=https://evil.example/phish')

    render(<AuthModePage mode="login" />)

    expect(screen.queryByTestId('guest-continue')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /create account/i })).toHaveAttribute('href', '/auth/register')
  })

  it('auto-redirects after countdown reaches zero on register success', async () => {
    vi.useFakeTimers()

    render(<AuthModePage mode="register" />)

    await act(async () => {
      screen.getByTestId('trigger-register-success').click()
    })

    await act(async () => {
      vi.advanceTimersByTime(15000)
    })

    expect(mockRouterReplace).toHaveBeenCalledWith('/residences/villa-test/checkout')
  })

  it('shows oauth error messages when present', () => {
    mockSearchParams = new URLSearchParams('error=invalid_state')

    render(<AuthModePage mode="login" />)

    expect(screen.getByRole('alert')).toHaveTextContent(/authentication was interrupted/i)
  })

  it('redirects already authenticated users to their sanitized returnUrl', async () => {
    authState = { status: 'authenticated', isAuthenticated: true }

    render(<AuthModePage mode="login" />)

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith('/residences/villa-test/checkout')
    })
  })
})

afterEach(() => {
  vi.useRealTimers()
})
