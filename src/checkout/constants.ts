// ---------------------------------------------------------------------------
// checkout/constants.ts — Constantes del flujo de checkout
// ---------------------------------------------------------------------------

import type { GuestInformationValues, StepConfig } from './types'

// ── Pasos del stepper ─────────────────────────────────────────────────────

export const STEPS: readonly StepConfig[] = [
  { id: 'guest-information', label: 'Guest information', shortLabel: 'Info'         },
  { id: 'review-booking',    label: 'Review booking',   shortLabel: 'Review'        },
  { id: 'payment',           label: 'Payment',          shortLabel: 'Payment'       },
  { id: 'confirmation',      label: 'Confirmation',     shortLabel: 'Confirmation'  },
] as const

export const STEP_INDICES = {
  GUEST_INFORMATION: 0,
  REVIEW_BOOKING:    1,
  PAYMENT:           2,
  CONFIRMATION:      3,
} as const

// ── Valores vacíos del formulario de huésped ──────────────────────────────

export const EMPTY_GUEST_INFORMATION: GuestInformationValues = {
  firstName:        '',
  lastName:         '',
  email:            '',
  phoneCountryCode: '',
  phone:            '',
  country:          '',
  specialNotes:     '',
}

// ── Texto de políticas ────────────────────────────────────────────────────

export const POLICY_ACCEPTANCE_TEXT =
  'I have read and agree to the cancellation policy, house rules, and terms of service.'

// ── Limits ───────────────────────────────────────────────────────────────

export const FIELD_LIMITS = {
  NAME:          120,
  EMAIL:         254,
  PHONE:          50,
  PHONE_CODE:      8,
  COUNTRY:       120,
  SPECIAL_NOTES: 2000,
} as const
