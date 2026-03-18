// ---------------------------------------------------------------------------
// checkout/guards.ts — Guards de navegación del stepper
//
// Cada guard determina si el usuario PUEDE acceder a un paso dado el estado
// actual del stepper. Separar esta lógica del componente permite testearla
// de forma aislada y reutilizarla en el hook de navegación.
// ---------------------------------------------------------------------------

import { STEP_INDICES } from './constants'
import { isGuestInformationValid } from './validators'
import type { CheckoutStepperState } from './types'

/**
 * Determina si el usuario puede acceder al paso indicado por `stepIndex`
 * dado el estado actual del stepper.
 *
 * Reglas:
 *   - Paso 0 (GuestInformation): siempre accesible
 *   - Paso 1 (ReviewBooking): requiere paso 0 válido
 *   - Paso 2 (Payment): requiere paso 1 completado (policyAccepted) O bookingRequestId
 *   - Paso 3 (Confirmation): requiere bookingRequestId
 *
 * Nunca lanza — devuelve false para índices fuera de rango.
 */
export function canAccessStep(
  stepIndex: number,
  state: CheckoutStepperState,
): boolean {
  switch (stepIndex) {
    case STEP_INDICES.GUEST_INFORMATION:
      return true

    case STEP_INDICES.REVIEW_BOOKING:
      return isGuestInformationValid(state.guestInformation)

    case STEP_INDICES.PAYMENT:
      // Accesible si el usuario completó la revisión (aceptó políticas)
      // o si ya hay una reserva (regresó del paso de confirmación)
      return state.policyAccepted || state.bookingRequestId !== null

    case STEP_INDICES.CONFIRMATION:
      return state.bookingRequestId !== null

    default:
      return false
  }
}

/**
 * Dado el estado actual, devuelve el índice del primer paso incompleto
 * al que el usuario debe ir. Útil para redirigir si alguien intenta
 * acceder a un paso por URL sin completar los anteriores.
 */
export function getFirstIncompleteStep(state: CheckoutStepperState): number {
  const totalSteps = 4
  for (let i = 0; i < totalSteps; i++) {
    if (!canAccessStep(i, state)) return Math.max(0, i - 1)
  }
  // All steps accessible — return the last step
  return totalSteps - 1
}

/**
 * Devuelve true si el paso indicado ya fue completado.
 * Un paso está completado si el siguiente es accesible.
 */
export function isStepCompleted(
  stepIndex: number,
  state: CheckoutStepperState,
): boolean {
  return canAccessStep(stepIndex + 1, state)
}
