import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GuestRegistrationPage } from '@/routes/GuestRegistrationPage'

const pushSpy = vi.fn()
const mockUseCheckoutSession = vi.fn()
const mockRequestCheckoutOtp = vi.fn()
const mockContinueCheckoutAsGuest = vi.fn()
const mockVerifyCheckoutOtp = vi.fn()

vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'villa-azul' }),
  useRouter: () => ({ push: pushSpy }),
  useSearchParams: () => new URLSearchParams('checkoutSession=session-1&checkin=2026-03-10&checkout=2026-03-12'),
}))

vi.mock('@/hooks/useCheckoutSession', () => ({
  useCheckoutSession: (token: string | undefined) => mockUseCheckoutSession(token),
}))

vi.mock('@/services/bookingRequestService', () => ({
  bookingRequestService: {
    requestCheckoutOtp: (payload: unknown) => mockRequestCheckoutOtp(payload),
    continueCheckoutAsGuest: (payload: unknown) => mockContinueCheckoutAsGuest(payload),
    verifyCheckoutOtp: (payload: unknown) => mockVerifyCheckoutOtp(payload),
  },
}))

describe('GuestRegistrationPage', () => {
  beforeEach(() => {
    pushSpy.mockReset()
    mockUseCheckoutSession.mockReset()
    mockRequestCheckoutOtp.mockReset()
    mockContinueCheckoutAsGuest.mockReset()
    mockVerifyCheckoutOtp.mockReset()

    mockUseCheckoutSession.mockReturnValue({
      checkoutSession: {
        token: 'session-1',
        residenceSlug: 'villa-azul',
        checkIn: '2026-03-10',
        checkOut: '2026-03-12',
        guests: 2,
        firstName: '',
        lastName: '',
        phone: '',
        quotedNights: 2,
        quotedSubtotal: 600,
        quotedCleaningFee: 75,
        quotedServiceFee: 72,
        quotedTotal: 747,
        currency: 'USD',
        accessState: 'anonymous',
        identityEmail: '',
        expiresAt: '2026-03-09T12:00:00Z',
      },
      isLoading: false,
      error: null,
    })
  })

  it('keeps inputs controlled even when checkout session identity fields are missing', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    mockUseCheckoutSession.mockReturnValue({
      checkoutSession: {
        token: 'session-1',
        residenceSlug: 'villa-azul',
        checkIn: '2026-03-10',
        checkOut: '2026-03-12',
        guests: 2,
        firstName: undefined,
        lastName: undefined,
        phone: undefined,
        quotedNights: 2,
        quotedSubtotal: 600,
        quotedCleaningFee: 75,
        quotedServiceFee: 72,
        quotedTotal: 747,
        currency: 'USD',
        accessState: 'anonymous',
        identityEmail: undefined,
        expiresAt: '2026-03-09T12:00:00Z',
      },
      isLoading: false,
      error: null,
    })

    render(<GuestRegistrationPage />)

    expect(screen.getByLabelText(/first name/i)).toHaveValue('')
    expect(screen.getByLabelText(/last name/i)).toHaveValue('')
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('')
    expect(screen.getByLabelText(/phone/i)).toHaveValue('')
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('A component is changing a controlled input to be uncontrolled'),
    )

    consoleErrorSpy.mockRestore()
  })

  it('shows the login and create account pill toggle inside the preregistration form', async () => {
    const user = userEvent.setup()

    render(<GuestRegistrationPage />)

    expect(screen.getByRole('tab', { name: /login/i })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tab', { name: /create account/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { name: /create account to continue/i })).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: /login/i }))

    expect(screen.getByRole('tab', { name: /login/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { name: /log in to continue/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue with login verification/i })).toBeInTheDocument()
  })

  it('continues as guest after collecting preregistration details', async () => {
    mockContinueCheckoutAsGuest.mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(<GuestRegistrationPage />)

    await user.click(screen.getByRole('button', { name: /continue as guest/i }))

    await waitFor(() => {
      expect(mockContinueCheckoutAsGuest).toHaveBeenCalledWith({
        checkoutSessionToken: 'session-1',
      })
      expect(pushSpy).toHaveBeenCalledWith('/residences/villa-azul/checkout?checkoutSession=session-1&checkin=2026-03-10&checkout=2026-03-12')
    })
  })

  it('requests otp and verifies before continuing', async () => {
    mockRequestCheckoutOtp.mockResolvedValue(undefined)
    mockVerifyCheckoutOtp.mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(<GuestRegistrationPage />)

    await user.type(screen.getByLabelText(/first name/i), 'Ana')
    await user.type(screen.getByLabelText(/last name/i), 'Garcia')
    await user.type(screen.getByLabelText(/^email$/i), 'ana@example.com')
    await user.type(screen.getByLabelText(/phone/i), '+52 984 123 4567')
    await user.click(screen.getByRole('button', { name: /continue with email verification/i }))

    await waitFor(() => {
      expect(mockRequestCheckoutOtp).toHaveBeenCalledWith({
        checkoutSessionToken: 'session-1',
        firstName: 'Ana',
        lastName: 'Garcia',
        email: 'ana@example.com',
        phone: '+52 984 123 4567',
      })
    })

    await user.type(screen.getByLabelText(/verification code/i), '123456')
    await user.click(screen.getByRole('button', { name: /verify and continue/i }))

    await waitFor(() => {
      expect(mockVerifyCheckoutOtp).toHaveBeenCalledWith({
        checkoutSessionToken: 'session-1',
        firstName: 'Ana',
        lastName: 'Garcia',
        email: 'ana@example.com',
        phone: '+52 984 123 4567',
        code: '123456',
      })
      expect(pushSpy).toHaveBeenCalledWith('/residences/villa-azul/checkout?checkoutSession=session-1&checkin=2026-03-10&checkout=2026-03-12')
    })
  })
})
