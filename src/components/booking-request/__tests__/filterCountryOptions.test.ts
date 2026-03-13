import { describe, expect, it } from 'vitest'
import { filterCountryOptions } from '@/components/booking-request/filterCountryOptions'
import type { CountryOption } from '@/types/booking'

const countries: CountryOption[] = [
  { code: 'MX', name: 'Mexico', flagEmoji: '🇲🇽', dialCode: '+52' },
  { code: 'US', name: 'United States', flagEmoji: '🇺🇸', dialCode: '+1' },
  { code: 'DE', name: 'Germany', flagEmoji: '🇩🇪', dialCode: '+49' },
]

describe('filterCountryOptions', () => {
  it('returns all options when the query is empty', () => {
    expect(filterCountryOptions(countries, '')).toEqual(countries)
  })

  it('matches by country name, code and dial code', () => {
    expect(filterCountryOptions(countries, 'mex')).toEqual([countries[0]])
    expect(filterCountryOptions(countries, 'us')).toEqual([countries[1]])
    expect(filterCountryOptions(countries, '+49')).toEqual([countries[2]])
  })
})
