import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import type { CountryOption } from '@/types/booking'
import { filterCountryOptions } from '@/components/booking-request/filterCountryOptions'

interface CountryComboboxProps {
  countries: CountryOption[]
  isLoading: boolean
  value: string
  onChange: (value: string) => void
  label: string
  error?: string
  placeholder?: string
  getOptionValue?: (country: CountryOption) => string
  getOptionLabel?: (country: CountryOption) => string
  getSelectedLabel?: (country: CountryOption) => string
  className?: string
  wrapperClassName?: string
  onOpenChange?: (isOpen: boolean) => void
}

export function CountryCombobox({
  countries,
  isLoading,
  value,
  onChange,
  label,
  error,
  placeholder,
  getOptionValue = (country) => country.code,
  getOptionLabel = (country) => `${country.flagEmoji} ${country.name} (${country.dialCode})`,
  getSelectedLabel = (country) => `${country.flagEmoji} ${country.name} (${country.dialCode})`,
  className,
  wrapperClassName,
  onOpenChange,
}: CountryComboboxProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listboxId = useId()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('')

  const selectedCountry = useMemo(
    () => countries.find((country) => getOptionValue(country) === value) ?? null,
    [countries, getOptionValue, value],
  )
  const selectedLabel = selectedCountry ? getSelectedLabel(selectedCountry) : ''

  const filteredCountries = useMemo(() => filterCountryOptions(countries, query), [countries, query])

  useEffect(() => {
    if (!isOpen) {
      setQuery(selectedLabel)
    }
  }, [isOpen, selectedLabel])

  useEffect(() => {
    onOpenChange?.(isOpen)
  }, [isOpen, onOpenChange])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div ref={wrapperRef} className={cn('relative', wrapperClassName)} data-open={isOpen ? 'true' : 'false'}>
      <input
        ref={inputRef}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-invalid={error ? 'true' : 'false'}
        aria-label={label}
        aria-haspopup="listbox"
        aria-activedescendant={undefined}
        className={cn(
          'booking-field booking-field--control h-11 w-full px-3 text-base text-ink shadow-none',
          'placeholder:text-ink-soft/70',
          className,
        )}
        role="combobox"
        value={query}
        placeholder={isLoading ? 'Loading countries…' : (placeholder ?? 'Select a country')}
        autoComplete="off"
        onFocus={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
          if (value) {
            onChange('')
          }
        }}
      />

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.45rem)] z-[120] max-h-72 w-full origin-top overflow-auto rounded-xl border border-white/95 bg-white p-1 shadow-soft transition-transform duration-200 ease-out"
        >
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <button
                key={`${getOptionValue(country)}-${country.code}`}
                role="option"
                aria-selected={getOptionValue(country) === value}
                type="button"
                className={cn(
                  'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200',
                  getOptionValue(country) === value ? 'bg-surface-muted text-ink' : 'text-ink-soft hover:bg-surface-muted/70 hover:text-ink',
                )}
                onClick={() => {
                  onChange(getOptionValue(country))
                  setQuery(getSelectedLabel(country))
                  setIsOpen(false)
                  inputRef.current?.blur()
                }}
              >
                {getOptionLabel(country)}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-ink-soft">No countries match that search.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
