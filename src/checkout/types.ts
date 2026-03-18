// ---------------------------------------------------------------------------
// checkout/types.ts — Tipos del flujo de checkout por pasos
//
// Separación de responsabilidades:
//   - StepId / StepConfig → estructura de navegación
//   - GuestInformationValues → datos del formulario paso 1
//   - CheckoutStepperState → estado compartido entre pasos
//   - CheckoutMode → qué tipo de checkout es (booking-request | instant-payment)
// ---------------------------------------------------------------------------

// ── IDs de pasos ──────────────────────────────────────────────────────────

export type StepId =
  | 'guest-information'
  | 'review-booking'
  | 'payment'
  | 'confirmation'

export interface StepConfig {
  id: StepId
  label: string
  shortLabel: string
}

// ── Modo de checkout ──────────────────────────────────────────────────────
// 'booking-request' → MVP: no hay pago real, ReviewBooking hace el submit
// 'instant-payment' → futuro: PaymentStep hace el cobro antes de confirmar

export type CheckoutMode = 'booking-request' | 'instant-payment'

// ── Valores del formulario de información de huésped ─────────────────────

export interface GuestInformationValues {
  firstName: string
  lastName: string
  email: string
  phoneCountryCode: string
  phone: string
  country: string
  specialNotes: string
}

// Errores por campo — todos opcionales, solo los que fallaron
export type GuestInformationErrors = Partial<Record<keyof GuestInformationValues, string>>

// ── Estado global del stepper ─────────────────────────────────────────────

export interface CheckoutStepperState {
  /** Índice del paso activo (0-3) */
  currentStepIndex: number
  /** Formulario del paso 1 */
  guestInformation: GuestInformationValues
  /** El usuario aceptó las políticas en el paso 2 */
  policyAccepted: boolean
  /** ID del booking request una vez enviado */
  bookingRequestId: string | null
}

// ── Retorno del hook de navegación ───────────────────────────────────────

export interface UseCheckoutStepperReturn {
  state: CheckoutStepperState
  currentStepId: StepId
  canGoBack: boolean
  canGoForward: boolean
  goNext: () => void
  goBack: () => void
  goToStep: (index: number) => void
  setGuestInformation: (values: GuestInformationValues) => void
  setPolicyAccepted: (accepted: boolean) => void
  setBookingRequestId: (id: string) => void
  isStepAccessible: (index: number) => boolean
}
