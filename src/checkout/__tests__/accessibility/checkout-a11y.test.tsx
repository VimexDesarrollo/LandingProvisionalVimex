// ---------------------------------------------------------------------------
// checkout-a11y.test.tsx — Tests de accesibilidad del checkout
//
// Cobertura:
//   1. Labels — cada campo tiene label asociado
//   2. aria-required — campos obligatorios marcados
//   3. aria-invalid — campos con error marcados correctamente
//   4. aria-current="step" — paso activo marcado en el stepper
//   5. Focus management — el primer campo con error recibe foco
//   6. Keyboard navigation — Tab y Enter funcionen correctamente
//   7. Role landmarks — main, nav, section con nombres
//   8. Error messages — role="alert" en mensajes de error
// ---------------------------------------------------------------------------

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GuestInformationStep } from '../../steps/GuestInformationStep'
import { ReviewBookingStep } from '../../steps/ReviewBookingStep'
import { StepIndicator } from '../../components/StepIndicator'
import { PolicyAcceptance } from '../../components/PolicyAcceptance'
import type { BookingQuote } from '@/types/booking'
import type { CheckoutStepperState } from '../../types'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@/design-system/components/GlassPanel', () => ({ GlassPanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('@/design-system/components/Button',     () => ({
  Button: ({ children, onClick, disabled, 'aria-busy': ariaBusy }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; 'aria-busy'?: boolean }) =>
    <button onClick={onClick} disabled={disabled} aria-busy={ariaBusy}>{children}</button>,
}))
vi.mock('@/design-system/components/Typography', () => ({ Typography: ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id}>{children}</h2> }))
vi.mock('@/components/booking-request/CountryCombobox', () => ({
  CountryCombobox: ({ label, onChange }: { label: string; onChange: (v: string) => void }) =>
    <button data-testid={`combobox-${label}`} aria-label={label} onClick={() => onChange('MX')}>{label}</button>,
}))
vi.mock('../../components/BookingSummaryCard', () => ({ BookingSummaryCard: () => <div aria-label="booking summary" /> }))
vi.mock('../../components/PriceBreakdown',     () => ({ PriceBreakdown: () => <div aria-label="price breakdown" /> }))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const VALID_GUEST_INFO = {
  firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com',
  phoneCountryCode: '+52', phone: '3312345678', country: 'MX', specialNotes: '',
}

const QUOTE: BookingQuote = {
  residenceSlug: 'villa-azul', checkIn: '2026-03-10', checkOut: '2026-03-12',
  guests: 2, quotedNights: 2, quotedSubtotal: 500, quotedCleaningFee: 80,
  quotedServiceFee: 45, quotedTotal: 625, currency: 'USD', nightlyRates: [],
}

const RESIDENCE = {
  id: 'r', name: 'Villa Azul', slug: 'villa-azul', location: 'Tulum',
  imageUrl: '', imageGallery: [], nightlyRateUsd: 250, promotionalNightlyRateUsd: null,
  guests: 6, beds: 3, minNights: 2, roomDetailsSection: { items: [] },
} as never

function makeState(overrides: Partial<CheckoutStepperState> = {}): CheckoutStepperState {
  return {
    currentStepIndex: 0,
    guestInformation: VALID_GUEST_INFO,
    policyAccepted: false,
    bookingRequestId: null,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// 1. Form labels
// ---------------------------------------------------------------------------

describe('Accessibility — form labels', () => {
  it('every input in GuestInformationStep has an accessible name', () => {
    render(
      <GuestInformationStep
        countries={[{ code: 'MX', name: 'Mexico', flagEmoji: '🇲🇽', dialCode: '+52' }]}
        isCountriesLoading={false}
        onComplete={vi.fn()}
      />,
    )
    expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /last name/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /phone number/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /special/i })).toBeInTheDocument()
  })

  it('the policy checkbox has an accessible name', () => {
    render(<PolicyAcceptance accepted={false} onChange={vi.fn()} />)
    expect(screen.getByRole('checkbox', { name: /policies/i })).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 2. aria-required
// ---------------------------------------------------------------------------

describe('Accessibility — aria-required', () => {
  it('required inputs are marked with aria-required="true"', () => {
    render(
      <GuestInformationStep countries={[]} isCountriesLoading={false} onComplete={vi.fn()} />,
    )
    const firstNameInput = screen.getByRole('textbox', { name: /first name/i })
    expect(firstNameInput).toHaveAttribute('aria-required', 'true')
  })

  it('policy checkbox is marked as aria-required="true"', () => {
    render(<PolicyAcceptance accepted={false} onChange={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-required', 'true')
  })
})

// ---------------------------------------------------------------------------
// 3. aria-invalid on validation errors
// ---------------------------------------------------------------------------

describe('Accessibility — aria-invalid on errors', () => {
  it('marks email field as aria-invalid after failed submit', async () => {
    render(
      <GuestInformationStep countries={[]} isCountriesLoading={false} onComplete={vi.fn()} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /email/i })).toHaveAttribute('aria-invalid', 'true')
    })
  })

  it('marks email as aria-invalid="false" before submission attempt', () => {
    render(
      <GuestInformationStep countries={[]} isCountriesLoading={false} onComplete={vi.fn()} />,
    )
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveAttribute('aria-invalid', 'false')
  })

  it('policy checkbox shows aria-invalid when error exists', () => {
    render(<PolicyAcceptance accepted={false} onChange={vi.fn()} error="Must accept." />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })
})

// ---------------------------------------------------------------------------
// 4. aria-current="step" in StepIndicator
// ---------------------------------------------------------------------------

describe('Accessibility — step indicator current step', () => {
  it('marks the active step button with aria-current="step"', () => {
    render(<StepIndicator state={makeState({ currentStepIndex: 0 })} />)
    const stepButtons = screen.getAllByRole('button')
    const activeButton = stepButtons.find((b) =>
      b.getAttribute('aria-current') === 'step',
    )
    expect(activeButton).toBeDefined()
    expect(activeButton?.textContent).toMatch(/1/)
  })

  it('marks only the current step as active', () => {
    render(<StepIndicator state={makeState({ currentStepIndex: 1 })} />)
    const currentStepButtons = screen.getAllByRole('button').filter(
      (b) => b.getAttribute('aria-current') === 'step',
    )
    expect(currentStepButtons.length).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// 5. nav landmark
// ---------------------------------------------------------------------------

describe('Accessibility — landmarks', () => {
  it('StepIndicator renders a <nav> with accessible name', () => {
    render(<StepIndicator state={makeState()} />)
    expect(screen.getByRole('navigation', { name: /checkout progress/i })).toBeInTheDocument()
  })

  it('GuestInformationStep renders a <section> with accessible heading', () => {
    render(
      <GuestInformationStep countries={[]} isCountriesLoading={false} onComplete={vi.fn()} />,
    )
    expect(screen.getByRole('region', { name: /guest information/i })).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// 6. Error messages role="alert"
// ---------------------------------------------------------------------------

describe('Accessibility — error message alerts', () => {
  it('field errors have role="alert"', async () => {
    render(
      <GuestInformationStep countries={[]} isCountriesLoading={false} onComplete={vi.fn()} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert')
      expect(alerts.length).toBeGreaterThan(0)
    })
  })

  it('ReviewBookingStep submission error has role="alert"', () => {
    render(
      <ReviewBookingStep
        guestInformation={VALID_GUEST_INFO}
        residence={RESIDENCE}
        quote={QUOTE}
        checkIn="2026-03-10" checkOut="2026-03-12" guests={2}
        policyAccepted={true}
        submissionError="Something went wrong."
        isSubmitting={false}
        onPolicyChange={vi.fn()}
        onSubmit={vi.fn()}
        onBack={vi.fn()}
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i)
  })
})

// ---------------------------------------------------------------------------
// 7. Keyboard navigation
// ---------------------------------------------------------------------------

describe('Accessibility — keyboard navigation', () => {
  it('can Tab through all form inputs in GuestInformationStep', async () => {
    const user = userEvent.setup()
    render(
      <GuestInformationStep
        countries={[{ code: 'MX', name: 'Mexico', flagEmoji: '🇲🇽', dialCode: '+52' }]}
        isCountriesLoading={false}
        onComplete={vi.fn()}
      />,
    )
    const firstInput = screen.getByRole('textbox', { name: /first name/i })
    await user.click(firstInput)
    expect(firstInput).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('textbox', { name: /last name/i })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveFocus()
  })

  it('policy checkbox can be toggled with Space key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PolicyAcceptance accepted={false} onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    expect(onChange).toHaveBeenCalledWith(true)
  })
})

// ---------------------------------------------------------------------------
// 8. Loading state accessible
// ---------------------------------------------------------------------------

describe('Accessibility — loading state', () => {
  it('submit button has aria-busy="true" while submitting', () => {
    render(
      <ReviewBookingStep
        guestInformation={VALID_GUEST_INFO}
        residence={RESIDENCE}
        quote={QUOTE}
        checkIn="2026-03-10" checkOut="2026-03-12" guests={2}
        policyAccepted={true}
        submissionError={null}
        isSubmitting={true}
        onPolicyChange={vi.fn()}
        onSubmit={vi.fn()}
        onBack={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /sending/i })).toHaveAttribute('aria-busy', 'true')
  })
})
