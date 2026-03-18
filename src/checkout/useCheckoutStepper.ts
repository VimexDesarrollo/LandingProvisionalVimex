// ---------------------------------------------------------------------------
// checkout/useCheckoutStepper.ts — Hook de navegación del stepper
//
// Responsabilidades:
//   - Mantener el estado compartido entre pasos (formulario, policy, bookingId)
//   - Exponer navegación (next/back/goto) con validación via guards
//   - No sabe nada de API, formularios concretos ni UI
// ---------------------------------------------------------------------------

import { useCallback, useState } from 'react'
import { EMPTY_GUEST_INFORMATION, STEPS, STEP_INDICES } from './constants'
import { canAccessStep } from './guards'
import type {
  CheckoutStepperState,
  GuestInformationValues,
  StepId,
  UseCheckoutStepperReturn,
} from './types'

const TOTAL_STEPS = STEPS.length

function buildInitialState(): CheckoutStepperState {
  return {
    currentStepIndex: STEP_INDICES.GUEST_INFORMATION,
    guestInformation: { ...EMPTY_GUEST_INFORMATION },
    policyAccepted:   false,
    bookingRequestId: null,
  }
}

export function useCheckoutStepper(): UseCheckoutStepperReturn {
  const [state, setState] = useState<CheckoutStepperState>(buildInitialState)

  // ── Navegación ──────────────────────────────────────────────────────────

  const goToStep = useCallback((index: number) => {
    setState((prev) => {
      if (index < 0 || index >= TOTAL_STEPS) return prev
      if (!canAccessStep(index, prev)) return prev
      return { ...prev, currentStepIndex: index }
    })
  }, [])

  const goNext = useCallback(() => {
    setState((prev) => {
      const next = prev.currentStepIndex + 1
      if (next >= TOTAL_STEPS) return prev
      if (!canAccessStep(next, prev)) return prev
      return { ...prev, currentStepIndex: next }
    })
  }, [])

  const goBack = useCallback(() => {
    setState((prev) => {
      const back = prev.currentStepIndex - 1
      if (back < 0) return prev
      return { ...prev, currentStepIndex: back }
    })
  }, [])

  // ── Mutaciones de estado ────────────────────────────────────────────────

  const setGuestInformation = useCallback((values: GuestInformationValues) => {
    setState((prev) => ({ ...prev, guestInformation: values }))
  }, [])

  const setPolicyAccepted = useCallback((accepted: boolean) => {
    setState((prev) => ({ ...prev, policyAccepted: accepted }))
  }, [])

  const setBookingRequestId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, bookingRequestId: id }))
  }, [])

  // ── Derivados ───────────────────────────────────────────────────────────

  const currentStepId: StepId = STEPS[state.currentStepIndex].id

  const canGoBack =
    state.currentStepIndex > 0 &&
    state.bookingRequestId === null // no se puede retroceder después de confirmar

  const canGoForward = canAccessStep(state.currentStepIndex + 1, state)

  const isStepAccessible = useCallback(
    (index: number) => canAccessStep(index, state),
    [state],
  )

  return {
    state,
    currentStepId,
    canGoBack,
    canGoForward,
    goNext,
    goBack,
    goToStep,
    setGuestInformation,
    setPolicyAccepted,
    setBookingRequestId,
    isStepAccessible,
  }
}
