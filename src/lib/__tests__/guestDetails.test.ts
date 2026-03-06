import { describe, expect, it } from 'vitest'
import {
  parseGuestDetailsFromSearchParams,
  writeGuestDetailsToSearchParams,
} from '@/lib/guestDetails'
import { DEFAULT_GUEST_DETAILS } from '@/types/guests'

describe('guestDetails utils', () => {
  it('parses structured guest params from URLSearchParams', () => {
    const params = new URLSearchParams('adults=3&children=2&infants=1&pets=true')
    const parsed = parseGuestDetailsFromSearchParams(params)

    expect(parsed).toEqual({
      adults: 3,
      children: 2,
      infants: 1,
      pets: true,
    })
  })

  it('parses legacy guests param as adults', () => {
    const params = new URLSearchParams('guests=4%2B')
    const parsed = parseGuestDetailsFromSearchParams(params)

    expect(parsed).toEqual({
      adults: 4,
      children: 0,
      infants: 0,
      pets: false,
    })
  })

  it('removes all guest params when details are default', () => {
    const params = new URLSearchParams('adults=3&children=1&infants=0&guests=4%2B&pets=true')
    writeGuestDetailsToSearchParams(params, DEFAULT_GUEST_DETAILS)

    expect(params.get('adults')).toBeNull()
    expect(params.get('children')).toBeNull()
    expect(params.get('infants')).toBeNull()
    expect(params.get('guests')).toBeNull()
    expect(params.get('pets')).toBeNull()
  })

  it('writes structured guest params and total guests marker', () => {
    const params = new URLSearchParams()
    writeGuestDetailsToSearchParams(params, {
      adults: 3,
      children: 1,
      infants: 0,
      pets: true,
    })

    expect(params.get('adults')).toBe('3')
    expect(params.get('children')).toBe('1')
    expect(params.get('infants')).toBe('0')
    expect(params.get('guests')).toBe('4+')
    expect(params.get('pets')).toBe('true')
  })
})
