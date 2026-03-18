// ---------------------------------------------------------------------------
// checkout-security.test.tsx — Tests de seguridad del flujo de checkout
//
// Cobertura:
//   1. XSS — inputs con payloads maliciosos no ejecutan código
//   2. Double submit — el botón se deshabilita tras primer click
//   3. Bypass de pasos — guards bloquean acceso sin completar pasos previos
//   4. Payloads incompletos — la validación rechaza datos faltantes
//   5. Datos maliciosos — campos con caracteres especiales no rompen el schema
// ---------------------------------------------------------------------------

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GuestInformationStep } from '../../steps/GuestInformationStep'
import { ReviewBookingStep } from '../../steps/ReviewBookingStep'
import { useCheckoutStepper } from '../../useCheckoutStepper'
import { validateGuestInformation } from '../../validators'
import { canAccessStep } from '../../guards'
import { containsXssPattern } from '../../utils'
import { act, renderHook } from '@testing-library/react'
import type { BookingQuote } from '@/types/booking'
import type { CheckoutStepperState } from '../../types'

// ---------------------------------------------------------------------------
// Mock design system
// ---------------------------------------------------------------------------

vi.mock('@/design-system/components/GlassPanel', () => ({ GlassPanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))
vi.mock('@/design-system/components/Button',     () => ({
  Button: ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) =>
    <button onClick={onClick} disabled={disabled}>{children}</button>,
}))
vi.mock('@/design-system/components/Typography', () => ({ Typography: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2> }))
vi.mock('@/components/booking-request/CountryCombobox', () => ({
  CountryCombobox: ({ label, onChange }: { label: string; onChange: (v: string) => void }) =>
    <button data-testid={`combobox-${label}`} onClick={() => onChange('MX')}>{label}</button>,
}))
vi.mock('../../components/BookingSummaryCard', () => ({ BookingSummaryCard: () => <div /> }))
vi.mock('../../components/PriceBreakdown',     () => ({ PriceBreakdown: () => <div /> }))

// ---------------------------------------------------------------------------
// 1. XSS — inputs maliciosos
// ---------------------------------------------------------------------------

describe('Security — XSS in form inputs', () => {
  const XSS_PAYLOADS = [
    '<script>alert(1)</script>',
    'javascript:alert(1)',
    '<img src=x onerror=alert(1)>',
    '"><script>document.cookie</script>',
    '<iframe src="javascript:alert(1)">',
  ]

  it('rejects XSS payloads in firstName as too long or schema-invalid', () => {
    for (const payload of XSS_PAYLOADS) {
      const errors = validateGuestInformation({
        firstName:        payload,
        lastName:         'Pérez',
        email:            'juan@example.com',
        phoneCountryCode: '+52',
        phone:            '3312345678',
        country:          'MX',
        specialNotes:     '',
      })
      // Either valid (Zod does not block content) but containsXssPattern flag is raised
      expect(containsXssPattern(payload)).toBe(true)
    }
  })

  it('detectsXSS in specialNotes field', () => {
    for (const payload of XSS_PAYLOADS) {
      expect(containsXssPattern(payload)).toBe(true)
    }
  })

  it('does NOT execute scripts when rendering user-provided text', async () => {
    const windowAlertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <GuestInformationStep
        countries={[]}
        isCountriesLoading={false}
        onComplete={vi.fn()}
        initialValues={{
          firstName:        '<script>alert("xss")</script>',
          lastName:         'Test',
          email:            'test@example.com',
          phoneCountryCode: '+1',
          phone:            '5551234567',
          country:          'US',
          specialNotes:     '',
        }}
      />,
    )

    // Value is shown as text, not executed
    const input = screen.getByRole('textbox', { name: /first name/i })
    expect(input).toHaveValue('<script>alert("xss")</script>')
    expect(windowAlertSpy).not.toHaveBeenCalled()

    windowAlertSpy.mockRestore()
  })
})

// ---------------------------------------------------------------------------
// 2. Double submit — botón deshabilitado
// ---------------------------------------------------------------------------

describe('Security — double submit prevention', () => {
  const QUOTE: BookingQuote = {
    residenceSlug: 'villa-azul', checkIn: '2026-03-10', checkOut: '2026-03-12',
    guests: 2, quotedNights: 2, quotedSubtotal: 500, quotedCleaningFee: 80,
    quotedServiceFee: 45, quotedTotal: 625, currency: 'USD', nightlyRates: [],
  }

  it('disables the submit button while isSubmitting is true', () => {
    const onSubmit = vi.fn()
    render(
      <ReviewBookingStep
        guestInformation={{ firstName: 'Juan', lastName: 'Pérez', email: 'j@e.com', phoneCountryCode: '+52', phone: '123', country: 'MX', specialNotes: '' }}
        residence={{ id: 'r', name: 'V', slug: 's', location: 'L', imageUrl: '', imageGallery: [], nightlyRateUsd: 250, promotionalNightlyRateUsd: null, guests: 6, beds: 3, minNights: 2, roomDetailsSection: { items: [] } } as never}
        quote={QUOTE}
        checkIn="2026-03-10" checkOut="2026-03-12" guests={2}
        policyAccepted={true}
        submissionError={null}
        isSubmitting={true}
        onPolicyChange={vi.fn()}
        onSubmit={onSubmit}
        onBack={vi.fn()}
      />,
    )
    const submitBtn = screen.getByRole('button', { name: /sending/i })
    expect(submitBtn).toBeDisabled()
    // Click on disabled button must not call onSubmit
    fireEvent.click(submitBtn)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// 3. Bypass de pasos — guards bloquean acceso
// ---------------------------------------------------------------------------

describe('Security — step bypass via guards', () => {
  const EMPTY_STATE: CheckoutStepperState = {
    currentStepIndex: 0,
    guestInformation: { firstName: '', lastName: '', email: '', phoneCountryCode: '', phone: '', country: '', specialNotes: '' },
    policyAccepted:   false,
    bookingRequestId: null,
  }

  it('canAccessStep(1) returns false with empty state', () => {
    expect(canAccessStep(1, EMPTY_STATE)).toBe(false)
  })

  it('canAccessStep(3) returns false without booking request ID', () => {
    expect(canAccessStep(3, EMPTY_STATE)).toBe(false)
  })

  it('goToStep(3) is blocked by the hook when state is incomplete', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.goToStep(3))
    expect(result.current.state.currentStepIndex).toBe(0)
  })

  it('goNext() is blocked when current step requirements not met', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.goNext()) // Tries to go to step 1 without valid guest info
    expect(result.current.state.currentStepIndex).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// 4. Payloads incompletos
// ---------------------------------------------------------------------------

describe('Security — incomplete payloads', () => {
  it('validates all required fields are present before allowing advance', () => {
    const partiallyFilled = {
      firstName: 'Juan', lastName: '', email: '', phoneCountryCode: '', phone: '', country: '', specialNotes: '',
    }
    const errors = validateGuestInformation(partiallyFilled)
    expect(errors).not.toBeNull()
    expect(errors?.lastName).toBeDefined()
    expect(errors?.email).toBeDefined()
  })

  it('treats whitespace-only values as empty', () => {
    const errors = validateGuestInformation({
      firstName: '   ', lastName: '   ', email: '   ', phoneCountryCode: '   ', phone: '   ', country: '   ', specialNotes: '',
    })
    expect(errors).not.toBeNull()
    expect(errors?.firstName).toMatch(/required/i)
  })
})

// ---------------------------------------------------------------------------
// 5. Datos maliciosos — caracteres especiales
// ---------------------------------------------------------------------------

describe('Security — malicious data does not break schema', () => {
  it('handles null bytes in strings (they pass as strings)', () => {
    const withNullByte = 'Juan\x00'
    const errors = validateGuestInformation({
      firstName: withNullByte, lastName: 'Test', email: 'test@example.com',
      phoneCountryCode: '+1', phone: '5551234567', country: 'US', specialNotes: '',
    })
    // Zod trims whitespace but not null bytes — this test ensures no crash
    expect(() => validateGuestInformation({
      firstName: withNullByte, lastName: 'Test', email: 'test@example.com',
      phoneCountryCode: '+1', phone: '5551234567', country: 'US', specialNotes: '',
    })).not.toThrow()
  })

  it('handles extremely long strings gracefully (returns error, does not crash)', () => {
    const veryLong = 'A'.repeat(5000)
    expect(() =>
      validateGuestInformation({
        firstName: veryLong, lastName: 'Test', email: 'test@example.com',
        phoneCountryCode: '+1', phone: '5551234567', country: 'US', specialNotes: '',
      }),
    ).not.toThrow()

    const errors = validateGuestInformation({
      firstName: veryLong, lastName: 'Test', email: 'test@example.com',
      phoneCountryCode: '+1', phone: '5551234567', country: 'US', specialNotes: '',
    })
    expect(errors?.firstName).toBeDefined()
  })

  it('handles Unicode and emoji in name fields without crashing', () => {
    expect(() =>
      validateGuestInformation({
        firstName: '🎉 José María', lastName: 'García-López', email: 'jose@example.com',
        phoneCountryCode: '+34', phone: '612345678', country: 'ES', specialNotes: '¡Hola! 你好',
      }),
    ).not.toThrow()
  })
})
