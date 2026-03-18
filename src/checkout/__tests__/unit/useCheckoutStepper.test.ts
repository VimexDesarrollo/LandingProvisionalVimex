import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCheckoutStepper } from '../../useCheckoutStepper'
import type { GuestInformationValues } from '../../types'

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

const VALID_GUEST: GuestInformationValues = {
  firstName:        'Ana',
  lastName:         'García',
  email:            'ana@example.com',
  phoneCountryCode: '+52',
  phone:            '3312345678',
  country:          'MX',
  specialNotes:     '',
}

// ---------------------------------------------------------------------------
// Estado inicial
// ---------------------------------------------------------------------------

describe('useCheckoutStepper — initial state', () => {
  it('starts on step 0', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    expect(result.current.state.currentStepIndex).toBe(0)
    expect(result.current.currentStepId).toBe('guest-information')
  })

  it('starts with empty guest information', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    expect(result.current.state.guestInformation.firstName).toBe('')
    expect(result.current.state.guestInformation.email).toBe('')
  })

  it('starts with policy not accepted', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    expect(result.current.state.policyAccepted).toBe(false)
  })

  it('starts with no booking request ID', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    expect(result.current.state.bookingRequestId).toBeNull()
  })

  it('cannot go back from step 0', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    expect(result.current.canGoBack).toBe(false)
  })

  it('cannot go forward from step 0 without valid guest info', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    expect(result.current.canGoForward).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// setGuestInformation + navegación
// ---------------------------------------------------------------------------

describe('useCheckoutStepper — navigation after guest information', () => {
  it('allows goNext after valid guest information is set', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.setGuestInformation(VALID_GUEST))
    expect(result.current.canGoForward).toBe(true)
  })

  it('advances to step 1 when goNext is called with valid guest info', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.setGuestInformation(VALID_GUEST))
    act(() => result.current.goNext())
    expect(result.current.state.currentStepIndex).toBe(1)
    expect(result.current.currentStepId).toBe('review-booking')
  })

  it('does NOT advance to step 1 with invalid guest info', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.goNext())
    expect(result.current.state.currentStepIndex).toBe(0)
  })

  it('can go back from step 1 to step 0', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.setGuestInformation(VALID_GUEST))
    act(() => result.current.goNext())
    expect(result.current.canGoBack).toBe(true)
    act(() => result.current.goBack())
    expect(result.current.state.currentStepIndex).toBe(0)
  })

  it('preserves guest information when going back to step 0', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.setGuestInformation(VALID_GUEST))
    act(() => result.current.goNext())
    act(() => result.current.goBack())
    expect(result.current.state.guestInformation.firstName).toBe('Ana')
    expect(result.current.state.guestInformation.email).toBe('ana@example.com')
  })
})

// ---------------------------------------------------------------------------
// setPolicyAccepted
// ---------------------------------------------------------------------------

describe('useCheckoutStepper — policy acceptance', () => {
  function setupAtStep1() {
    const hook = renderHook(() => useCheckoutStepper())
    act(() => hook.result.current.setGuestInformation(VALID_GUEST))
    act(() => hook.result.current.goNext())
    return hook
  }

  it('cannot advance from step 1 until policy is accepted', () => {
    const { result } = setupAtStep1()
    expect(result.current.canGoForward).toBe(false)
  })

  it('can advance from step 1 after accepting policy', () => {
    const { result } = setupAtStep1()
    act(() => result.current.setPolicyAccepted(true))
    expect(result.current.canGoForward).toBe(true)
  })

  it('advances to step 2 (payment) after policy accepted', () => {
    const { result } = setupAtStep1()
    act(() => result.current.setPolicyAccepted(true))
    act(() => result.current.goNext())
    expect(result.current.state.currentStepIndex).toBe(2)
    expect(result.current.currentStepId).toBe('payment')
  })
})

// ---------------------------------------------------------------------------
// setBookingRequestId
// ---------------------------------------------------------------------------

describe('useCheckoutStepper — booking request ID', () => {
  it('sets booking request ID', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.setBookingRequestId('req-abc123'))
    expect(result.current.state.bookingRequestId).toBe('req-abc123')
  })

  it('step 3 becomes accessible after booking request ID is set', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.setBookingRequestId('req-abc123'))
    expect(result.current.isStepAccessible(3)).toBe(true)
  })

  it('cannot go back after booking request ID is set', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.setGuestInformation(VALID_GUEST))
    act(() => result.current.goNext())
    act(() => result.current.setPolicyAccepted(true))
    act(() => result.current.setBookingRequestId('req-abc123'))
    expect(result.current.canGoBack).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// goToStep — navegación directa
// ---------------------------------------------------------------------------

describe('useCheckoutStepper — goToStep', () => {
  it('can jump to step 0 at any time', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.setGuestInformation(VALID_GUEST))
    act(() => result.current.goNext())
    act(() => result.current.goToStep(0))
    expect(result.current.state.currentStepIndex).toBe(0)
  })

  it('cannot jump to step 1 without valid guest info', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.goToStep(1))
    expect(result.current.state.currentStepIndex).toBe(0)
  })

  it('cannot jump to step 3 without booking request ID', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.setGuestInformation(VALID_GUEST))
    act(() => result.current.goToStep(3))
    expect(result.current.state.currentStepIndex).toBe(0) // guard blocks it
  })

  it('ignores negative index', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.goToStep(-1))
    expect(result.current.state.currentStepIndex).toBe(0)
  })

  it('ignores out-of-range index', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.goToStep(99))
    expect(result.current.state.currentStepIndex).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// isStepAccessible
// ---------------------------------------------------------------------------

describe('useCheckoutStepper — isStepAccessible', () => {
  it('step 0 is always accessible', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    expect(result.current.isStepAccessible(0)).toBe(true)
  })

  it('step 1 is not accessible with empty form', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    expect(result.current.isStepAccessible(1)).toBe(false)
  })

  it('step 1 becomes accessible after filling guest info', () => {
    const { result } = renderHook(() => useCheckoutStepper())
    act(() => result.current.setGuestInformation(VALID_GUEST))
    expect(result.current.isStepAccessible(1)).toBe(true)
  })
})
