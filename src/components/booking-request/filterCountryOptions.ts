import type { CountryOption } from '@/types/booking'

export function filterCountryOptions(countries: CountryOption[], query: string): CountryOption[] {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return countries
  }

  return countries.filter((country) =>
    country.name.toLowerCase().includes(normalizedQuery) ||
    country.code.toLowerCase().includes(normalizedQuery) ||
    country.dialCode.includes(normalizedQuery),
  )
}
