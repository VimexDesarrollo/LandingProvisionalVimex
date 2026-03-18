// ---------------------------------------------------------------------------
// checkout/validators.ts — Validaciones Zod por paso del checkout
//
// Cada función de validación devuelve null si los datos son válidos,
// o un objeto de errores por campo si hay algún problema.
// Esto permite usarlas tanto en el componente como en tests unitarios.
// ---------------------------------------------------------------------------

import { z } from 'zod'
import { FIELD_LIMITS } from './constants'
import type { GuestInformationErrors, GuestInformationValues } from './types'

// ── Schema Zod ────────────────────────────────────────────────────────────

export const guestInformationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required.')
    .max(FIELD_LIMITS.NAME, `First name must be at most ${FIELD_LIMITS.NAME} characters.`),

  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required.')
    .max(FIELD_LIMITS.NAME, `Last name must be at most ${FIELD_LIMITS.NAME} characters.`),

  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.')
    .max(FIELD_LIMITS.EMAIL, `Email must be at most ${FIELD_LIMITS.EMAIL} characters.`),

  phoneCountryCode: z
    .string()
    .trim()
    .min(1, 'Phone code is required.')
    .max(FIELD_LIMITS.PHONE_CODE, 'Invalid phone code.'),

  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required.')
    .max(FIELD_LIMITS.PHONE, `Phone must be at most ${FIELD_LIMITS.PHONE} characters.`),

  country: z
    .string()
    .trim()
    .min(1, 'Country is required.')
    .max(FIELD_LIMITS.COUNTRY, `Country must be at most ${FIELD_LIMITS.COUNTRY} characters.`),

  specialNotes: z
    .string()
    .max(FIELD_LIMITS.SPECIAL_NOTES, `Special notes must be at most ${FIELD_LIMITS.SPECIAL_NOTES} characters.`),
})

export type GuestInformationSchema = z.infer<typeof guestInformationSchema>

// ── Función de validación ─────────────────────────────────────────────────

/**
 * Valida los valores del paso 1 (información del huésped).
 *
 * @returns null si todos los campos son válidos,
 *          o un objeto con el primer mensaje de error por campo si hay fallos.
 */
export function validateGuestInformation(
  values: GuestInformationValues,
): GuestInformationErrors | null {
  const result = guestInformationSchema.safeParse(values)
  if (result.success) return null

  const flat = result.error.flatten().fieldErrors
  const errors: GuestInformationErrors = {}

  for (const [key, messages] of Object.entries(flat)) {
    if (messages && messages.length > 0) {
      errors[key as keyof GuestInformationValues] = messages[0]
    }
  }

  return Object.keys(errors).length > 0 ? errors : null
}

/**
 * Devuelve true si los valores del paso 1 son completamente válidos.
 */
export function isGuestInformationValid(values: GuestInformationValues): boolean {
  return validateGuestInformation(values) === null
}

// ── Validación de OTP ─────────────────────────────────────────────────────

/**
 * Verifica que un código OTP sea exactamente 6 dígitos.
 */
export function isValidOtpCode(code: string): boolean {
  return /^\d{6}$/.test(code.trim())
}
