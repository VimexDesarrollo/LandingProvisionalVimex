import { describe, expect, it } from 'vitest'
import {
  isGuestInformationValid,
  isValidOtpCode,
  validateGuestInformation,
} from '../../validators'
import type { GuestInformationValues } from '../../types'

// ---------------------------------------------------------------------------
// Fixture: valores válidos de base
// ---------------------------------------------------------------------------

const VALID: GuestInformationValues = {
  firstName:        'Juan',
  lastName:         'Pérez',
  email:            'juan@example.com',
  phoneCountryCode: '+52',
  phone:            '3312345678',
  country:          'MX',
  specialNotes:     '',
}

// ---------------------------------------------------------------------------
// validateGuestInformation — campos requeridos
// ---------------------------------------------------------------------------

describe('validateGuestInformation — required fields', () => {
  it('returns null for a valid payload', () => {
    expect(validateGuestInformation(VALID)).toBeNull()
  })

  it('returns error when firstName is empty', () => {
    const errors = validateGuestInformation({ ...VALID, firstName: '' })
    expect(errors?.firstName).toMatch(/required/i)
  })

  it('returns error when firstName is only whitespace', () => {
    const errors = validateGuestInformation({ ...VALID, firstName: '   ' })
    expect(errors?.firstName).toMatch(/required/i)
  })

  it('returns error when lastName is empty', () => {
    const errors = validateGuestInformation({ ...VALID, lastName: '' })
    expect(errors?.lastName).toMatch(/required/i)
  })

  it('returns error when email is empty', () => {
    const errors = validateGuestInformation({ ...VALID, email: '' })
    expect(errors?.email).toBeDefined()
  })

  it('returns error when email is malformed', () => {
    const errors = validateGuestInformation({ ...VALID, email: 'not-an-email' })
    expect(errors?.email).toMatch(/valid email/i)
  })

  it('returns error when phoneCountryCode is empty', () => {
    const errors = validateGuestInformation({ ...VALID, phoneCountryCode: '' })
    expect(errors?.phoneCountryCode).toBeDefined()
  })

  it('returns error when phone is empty', () => {
    const errors = validateGuestInformation({ ...VALID, phone: '' })
    expect(errors?.phone).toBeDefined()
  })

  it('returns error when country is empty', () => {
    const errors = validateGuestInformation({ ...VALID, country: '' })
    expect(errors?.country).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// validateGuestInformation — límites de longitud
// ---------------------------------------------------------------------------

describe('validateGuestInformation — field length limits', () => {
  it('returns error when firstName exceeds 120 characters', () => {
    const errors = validateGuestInformation({ ...VALID, firstName: 'A'.repeat(121) })
    expect(errors?.firstName).toBeDefined()
  })

  it('allows firstName exactly at 120 characters', () => {
    const errors = validateGuestInformation({ ...VALID, firstName: 'A'.repeat(120) })
    expect(errors?.firstName).toBeUndefined()
  })

  it('returns error when specialNotes exceeds 2000 characters', () => {
    const errors = validateGuestInformation({ ...VALID, specialNotes: 'X'.repeat(2001) })
    expect(errors?.specialNotes).toBeDefined()
  })

  it('allows specialNotes exactly at 2000 characters', () => {
    const errors = validateGuestInformation({ ...VALID, specialNotes: 'X'.repeat(2000) })
    expect(errors?.specialNotes).toBeUndefined()
  })
})

// ---------------------------------------------------------------------------
// validateGuestInformation — múltiples errores
// ---------------------------------------------------------------------------

describe('validateGuestInformation — multiple errors', () => {
  it('reports all invalid fields at once', () => {
    const errors = validateGuestInformation({
      firstName:        '',
      lastName:         '',
      email:            'bad',
      phoneCountryCode: '',
      phone:            '',
      country:          '',
      specialNotes:     '',
    })
    expect(errors?.firstName).toBeDefined()
    expect(errors?.lastName).toBeDefined()
    expect(errors?.email).toBeDefined()
    expect(errors?.phoneCountryCode).toBeDefined()
    expect(errors?.phone).toBeDefined()
    expect(errors?.country).toBeDefined()
  })

  it('reports only the first error per field', () => {
    const errors = validateGuestInformation({ ...VALID, email: '' })
    // Only one message string per field, not an array
    expect(typeof errors?.email).toBe('string')
  })
})

// ---------------------------------------------------------------------------
// isGuestInformationValid
// ---------------------------------------------------------------------------

describe('isGuestInformationValid', () => {
  it('returns true for valid values', () => {
    expect(isGuestInformationValid(VALID)).toBe(true)
  })

  it('returns false when any required field is missing', () => {
    expect(isGuestInformationValid({ ...VALID, email: '' })).toBe(false)
  })

  it('returns false for an entirely empty form', () => {
    const empty: GuestInformationValues = {
      firstName: '', lastName: '', email: '',
      phoneCountryCode: '', phone: '', country: '', specialNotes: '',
    }
    expect(isGuestInformationValid(empty)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// isValidOtpCode
// ---------------------------------------------------------------------------

describe('isValidOtpCode', () => {
  it('returns true for exactly 6 digits', () => {
    expect(isValidOtpCode('123456')).toBe(true)
  })

  it('returns false for fewer than 6 digits', () => {
    expect(isValidOtpCode('12345')).toBe(false)
  })

  it('returns false for more than 6 digits', () => {
    expect(isValidOtpCode('1234567')).toBe(false)
  })

  it('returns false when it contains letters', () => {
    expect(isValidOtpCode('12345a')).toBe(false)
  })

  it('returns false for an empty string', () => {
    expect(isValidOtpCode('')).toBe(false)
  })

  it('trims whitespace before checking', () => {
    expect(isValidOtpCode('  123456  ')).toBe(true)
  })
})
