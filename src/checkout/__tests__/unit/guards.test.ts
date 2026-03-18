import { describe, expect, it } from 'vitest'
import { canAccessStep, getFirstIncompleteStep, isStepCompleted } from '../../guards'
import { STEP_INDICES } from '../../constants'
import type { CheckoutStepperState, GuestInformationValues } from '../../types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const VALID_GUEST: GuestInformationValues = {
  firstName:        'Juan',
  lastName:         'Pérez',
  email:            'juan@example.com',
  phoneCountryCode: '+52',
  phone:            '3312345678',
  country:          'MX',
  specialNotes:     '',
}

const INVALID_GUEST: GuestInformationValues = {
  firstName: '', lastName: '', email: '',
  phoneCountryCode: '', phone: '', country: '', specialNotes: '',
}

function makeState(overrides: Partial<CheckoutStepperState> = {}): CheckoutStepperState {
  return {
    currentStepIndex: 0,
    guestInformation: INVALID_GUEST,
    policyAccepted:   false,
    bookingRequestId: null,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// canAccessStep — paso 0: guest-information
// ---------------------------------------------------------------------------

describe('canAccessStep — step 0 (guest-information)', () => {
  it('is always accessible, regardless of state', () => {
    expect(canAccessStep(STEP_INDICES.GUEST_INFORMATION, makeState())).toBe(true)
  })

  it('is accessible even when all fields are empty', () => {
    expect(canAccessStep(0, makeState({ guestInformation: INVALID_GUEST }))).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// canAccessStep — paso 1: review-booking
// ---------------------------------------------------------------------------

describe('canAccessStep — step 1 (review-booking)', () => {
  it('is accessible when guest information is valid', () => {
    expect(canAccessStep(STEP_INDICES.REVIEW_BOOKING, makeState({ guestInformation: VALID_GUEST }))).toBe(true)
  })

  it('is NOT accessible when guest information is invalid', () => {
    expect(canAccessStep(STEP_INDICES.REVIEW_BOOKING, makeState())).toBe(false)
  })

  it('is NOT accessible when email is missing even if other fields are filled', () => {
    const state = makeState({ guestInformation: { ...VALID_GUEST, email: '' } })
    expect(canAccessStep(STEP_INDICES.REVIEW_BOOKING, state)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// canAccessStep — paso 2: payment
// ---------------------------------------------------------------------------

describe('canAccessStep — step 2 (payment)', () => {
  it('is accessible when policy is accepted', () => {
    const state = makeState({ guestInformation: VALID_GUEST, policyAccepted: true })
    expect(canAccessStep(STEP_INDICES.PAYMENT, state)).toBe(true)
  })

  it('is accessible when booking request ID exists (already submitted)', () => {
    const state = makeState({ bookingRequestId: 'req-123' })
    expect(canAccessStep(STEP_INDICES.PAYMENT, state)).toBe(true)
  })

  it('is NOT accessible when policy not accepted and no booking ID', () => {
    const state = makeState({ policyAccepted: false, bookingRequestId: null })
    expect(canAccessStep(STEP_INDICES.PAYMENT, state)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// canAccessStep — paso 3: confirmation
// ---------------------------------------------------------------------------

describe('canAccessStep — step 3 (confirmation)', () => {
  it('is accessible when booking request ID exists', () => {
    const state = makeState({ bookingRequestId: 'req-abc' })
    expect(canAccessStep(STEP_INDICES.CONFIRMATION, state)).toBe(true)
  })

  it('is NOT accessible when booking request ID is null', () => {
    expect(canAccessStep(STEP_INDICES.CONFIRMATION, makeState())).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// canAccessStep — índices fuera de rango
// ---------------------------------------------------------------------------

describe('canAccessStep — out of range', () => {
  it('returns false for negative index', () => {
    expect(canAccessStep(-1, makeState())).toBe(false)
  })

  it('returns false for index beyond total steps', () => {
    expect(canAccessStep(10, makeState())).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// getFirstIncompleteStep
// ---------------------------------------------------------------------------

describe('getFirstIncompleteStep', () => {
  it('returns 0 when no data is filled', () => {
    expect(getFirstIncompleteStep(makeState())).toBe(0)
  })

  it('returns 1 when guest information is complete but policy not accepted', () => {
    const state = makeState({ guestInformation: VALID_GUEST })
    expect(getFirstIncompleteStep(state)).toBe(1)
  })

  it('returns 2 when policy accepted but no booking ID', () => {
    const state = makeState({ guestInformation: VALID_GUEST, policyAccepted: true })
    expect(getFirstIncompleteStep(state)).toBe(2)
  })

  it('returns 3 when booking ID exists', () => {
    const state = makeState({
      guestInformation: VALID_GUEST,
      policyAccepted:   true,
      bookingRequestId: 'req-123',
    })
    expect(getFirstIncompleteStep(state)).toBe(3)
  })
})

// ---------------------------------------------------------------------------
// isStepCompleted
// ---------------------------------------------------------------------------

describe('isStepCompleted', () => {
  it('step 0 is completed when guest info is valid', () => {
    expect(isStepCompleted(0, makeState({ guestInformation: VALID_GUEST }))).toBe(true)
  })

  it('step 0 is NOT completed when guest info is invalid', () => {
    expect(isStepCompleted(0, makeState())).toBe(false)
  })

  it('step 1 is completed when policy is accepted', () => {
    const state = makeState({ guestInformation: VALID_GUEST, policyAccepted: true })
    expect(isStepCompleted(1, state)).toBe(true)
  })

  it('step 2 is completed when booking request ID exists', () => {
    const state = makeState({ bookingRequestId: 'req-xyz' })
    expect(isStepCompleted(2, state)).toBe(true)
  })

  it('step 3 is never completed (last step)', () => {
    const state = makeState({ bookingRequestId: 'req-xyz' })
    expect(isStepCompleted(3, state)).toBe(false)
  })
})
