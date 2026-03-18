import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GuestInformationStep } from '../../steps/GuestInformationStep'
import type { CountryOption } from '@/types/booking'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@/components/booking-request/CountryCombobox', () => ({
  CountryCombobox: ({ label, onChange }: { label: string; onChange: (v: string) => void }) => (
    <button data-testid={`combobox-${label}`} onClick={() => onChange('MX')}>
      {label}
    </button>
  ),
}))

vi.mock('@/design-system/components/GlassPanel', () => ({
  GlassPanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/design-system/components/Button', () => ({
  Button: ({
    children,
    onClick,
    type,
  }: {
    children: React.ReactNode
    onClick?: () => void
    type?: string
  }) => (
    <button type={type as 'button' | 'submit' | undefined} onClick={onClick}>
      {children}
    </button>
  ),
}))

vi.mock('@/design-system/components/Typography', () => ({
  Typography: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h2 id={id}>{children}</h2>
  ),
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const COUNTRIES: CountryOption[] = [
  { code: 'MX', name: 'Mexico',        flagEmoji: '🇲🇽', dialCode: '+52' },
  { code: 'US', name: 'United States', flagEmoji: '🇺🇸', dialCode: '+1'  },
]

const VALID_VALUES = {
  firstName:        'Juan',
  lastName:         'Pérez',
  email:            'juan@example.com',
  phoneCountryCode: '+52',
  phone:            '3312345678',
  country:          'MX',
  specialNotes:     '',
}

function renderStep(props: Partial<Parameters<typeof GuestInformationStep>[0]> = {}) {
  const onComplete = vi.fn()
  render(
    <GuestInformationStep
      countries={COUNTRIES}
      isCountriesLoading={false}
      onComplete={onComplete}
      {...props}
    />,
  )
  return { onComplete }
}

function fillForm(values = VALID_VALUES) {
  fireEvent.change(screen.getByRole('textbox', { name: /first name/i }), {
    target: { value: values.firstName },
  })
  fireEvent.change(screen.getByRole('textbox', { name: /last name/i }), {
    target: { value: values.lastName },
  })
  fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
    target: { value: values.email },
  })
  fireEvent.change(screen.getByRole('textbox', { name: /phone number/i }), {
    target: { value: values.phone },
  })
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('GuestInformationStep — rendering', () => {
  it('renders all required fields', () => {
    renderStep()
    expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /last name/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /phone number/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /special/i })).toBeInTheDocument()
  })

  it('renders the continue button', () => {
    renderStep()
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
  })

  it('shows the section heading', () => {
    renderStep()
    expect(screen.getByText(/guest information/i)).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Validation — invalid submit
// ---------------------------------------------------------------------------

describe('GuestInformationStep — validation on empty submit', () => {
  it('does NOT call onComplete when form is empty', () => {
    const { onComplete } = renderStep()
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('shows error for empty first name', async () => {
    renderStep()
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })

  it('shows error for invalid email', async () => {
    renderStep()
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'not-valid' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument()
    })
  })

  it('clears an error when the user corrects the field', async () => {
    renderStep()
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => expect(screen.getAllByRole('alert').length).toBeGreaterThan(0))

    fireEvent.change(screen.getByRole('textbox', { name: /first name/i }), {
      target: { value: 'Juan' },
    })
    await waitFor(() => {
      const alerts = screen.queryAllByRole('alert')
      const firstNameError = alerts.find((a) => a.textContent?.match(/first name/i))
      expect(firstNameError).toBeUndefined()
    })
  })
})

// ---------------------------------------------------------------------------
// Valid submission
// ---------------------------------------------------------------------------

describe('GuestInformationStep — valid submission', () => {
  it('calls onComplete with the form values when all fields are valid', async () => {
    const { onComplete } = renderStep()
    fillForm()
    // Simulate combobox selections (both phone country code and country)
    fireEvent.click(screen.getByTestId('combobox-Phone country code'))
    fireEvent.click(screen.getByTestId('combobox-Country of residence'))

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledOnce()
    })
    const payload = onComplete.mock.calls[0][0]
    expect(payload.firstName).toBe('Juan')
    expect(payload.email).toBe('juan@example.com')
  })
})

// ---------------------------------------------------------------------------
// Prefill from checkout session
// ---------------------------------------------------------------------------

describe('GuestInformationStep — session prefill', () => {
  it('prefills the form when a checkout session with data is provided', () => {
    renderStep({
      checkoutSession: {
        token:             'tok-1',
        residenceSlug:     'villa-azul',
        checkIn:           '2026-03-10',
        checkOut:          '2026-03-12',
        guests:            2,
        firstName:         'Maria',
        lastName:          'Lopez',
        phone:             '3312345678',
        identityEmail:     'maria@example.com',
        quotedNights:      2,
        quotedSubtotal:    500,
        quotedCleaningFee: 80,
        quotedServiceFee:  45,
        quotedTotal:       625,
        currency:          'USD',
        accessState:       'guest',
        expiresAt:         '2026-03-10T12:00:00Z',
      },
    })

    expect(screen.getByRole('textbox', { name: /first name/i })).toHaveValue('Maria')
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('maria@example.com')
  })

  it('does NOT overwrite existing initialValues with session data', () => {
    renderStep({
      initialValues: { firstName: 'Existing' },
      checkoutSession: {
        token:             'tok-1',
        residenceSlug:     'villa-azul',
        checkIn:           '2026-03-10',
        checkOut:          '2026-03-12',
        guests:            2,
        firstName:         'FromSession',
        lastName:          '',
        phone:             '',
        identityEmail:     '',
        quotedNights:      2,
        quotedSubtotal:    500,
        quotedCleaningFee: 80,
        quotedServiceFee:  45,
        quotedTotal:       625,
        currency:          'USD',
        accessState:       'guest',
        expiresAt:         '2026-03-10T12:00:00Z',
      },
    })
    expect(screen.getByRole('textbox', { name: /first name/i })).toHaveValue('Existing')
  })
})
