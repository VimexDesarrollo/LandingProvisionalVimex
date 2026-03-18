// ---------------------------------------------------------------------------
// GuestForm.tsx — Formulario de información del huésped (paso 1)
//
// Componente puramente presentacional: recibe valores, errores y callbacks.
// No tiene estado interno ni lógica de validación.
// La validación se hace en el step container (GuestInformationStep).
// ---------------------------------------------------------------------------

import { useState } from 'react'
import { CountryCombobox } from '@/components/booking-request/CountryCombobox'
import type { CountryOption } from '@/types/booking'
import type { GuestInformationErrors, GuestInformationValues } from '../types'

interface GuestFormProps {
  values: GuestInformationValues
  errors: GuestInformationErrors
  countries: CountryOption[]
  isCountriesLoading: boolean
  isSubmitting: boolean
  onChange: (field: keyof GuestInformationValues, value: string) => void
}

const fieldCls =
  'booking-field mt-1 h-12 w-full px-4 text-base text-ink hover:border-card-border/90 hover:bg-surface-muted/85 focus:border-accent focus:bg-surface-muted/96 focus-visible:border-accent focus-visible:bg-surface-muted/96'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1 text-xs font-medium text-red-700">
      {message}
    </p>
  )
}

export function GuestForm({
  values,
  errors,
  countries,
  isCountriesLoading,
  isSubmitting,
  onChange,
}: GuestFormProps) {
  const [isPhoneCodeExpanded, setIsPhoneCodeExpanded] = useState(false)

  return (
    <fieldset disabled={isSubmitting} className="grid gap-4 border-0 p-0 md:grid-cols-2">
      <legend className="sr-only">Guest contact information</legend>

      {/* First name */}
      <label className="text-sm font-medium text-ink">
        First name
        <input
          name="firstName"
          autoComplete="given-name"
          aria-required="true"
          aria-invalid={errors.firstName ? 'true' : 'false'}
          aria-describedby={errors.firstName ? 'error-firstName' : undefined}
          className={fieldCls}
          value={values.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
        />
        <FieldError message={errors.firstName} />
      </label>

      {/* Last name */}
      <label className="text-sm font-medium text-ink">
        Last name
        <input
          name="lastName"
          autoComplete="family-name"
          aria-required="true"
          aria-invalid={errors.lastName ? 'true' : 'false'}
          className={fieldCls}
          value={values.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
        />
        <FieldError message={errors.lastName} />
      </label>

      {/* Email */}
      <label className="text-sm font-medium text-ink md:col-span-2">
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          aria-required="true"
          aria-invalid={errors.email ? 'true' : 'false'}
          className={fieldCls}
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
        <FieldError message={errors.email} />
      </label>

      {/* Phone */}
      <div className="text-sm font-medium text-ink md:col-span-2">
        <span id="phone-label">Phone</span>
        <div
          aria-labelledby="phone-label"
          className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-start"
        >
          <CountryCombobox
            countries={countries}
            isLoading={isCountriesLoading}
            value={values.phoneCountryCode}
            label="Phone country code"
            placeholder="Code"
            error={errors.phoneCountryCode}
            className="px-2.5"
            wrapperClassName={
              isPhoneCodeExpanded
                ? 'w-full transition-[width,max-width,flex-basis] duration-300 ease-out sm:max-w-[14rem] sm:basis-[14rem]'
                : 'w-full transition-[width,max-width,flex-basis] duration-300 ease-out sm:max-w-[8.5rem] sm:basis-[4rem]'
            }
            getOptionValue={(c) => c.dialCode}
            getOptionLabel={(c) => `${c.flagEmoji} ${c.name} (${c.dialCode})`}
            getSelectedLabel={(c) => `${c.flagEmoji} ${c.dialCode}`}
            onOpenChange={setIsPhoneCodeExpanded}
            onChange={(value) => onChange('phoneCountryCode', value)}
          />
          <input
            name="phone"
            autoComplete="tel-national"
            aria-label="Phone number"
            aria-required="true"
            aria-invalid={errors.phone ? 'true' : 'false'}
            placeholder="Phone number"
            className="booking-field h-12 w-full flex-1 px-4 text-base text-ink hover:border-card-border/90 hover:bg-surface-muted/85 focus:border-accent focus:bg-surface-muted/96"
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>
        <FieldError message={errors.phoneCountryCode} />
        <FieldError message={errors.phone} />
      </div>

      {/* Country */}
      <div className="text-sm font-medium text-ink md:col-span-2">
        Country of residence
        <CountryCombobox
          countries={countries}
          isLoading={isCountriesLoading}
          value={values.country}
          label="Country of residence"
          error={errors.country}
          getOptionLabel={(c) => `${c.flagEmoji} ${c.name}`}
          getSelectedLabel={(c) => c.name}
          onChange={(value) => onChange('country', value)}
        />
        <FieldError message={errors.country} />
      </div>

      {/* Special notes */}
      <label className="text-sm font-medium text-ink md:col-span-2">
        Special requests or notes
        <textarea
          name="specialNotes"
          aria-invalid={errors.specialNotes ? 'true' : 'false'}
          rows={4}
          className="booking-field mt-1 min-h-28 w-full px-4 py-3 text-base text-ink hover:border-card-border/90 hover:bg-surface-muted/85 focus:border-accent focus:bg-surface-muted/96"
          value={values.specialNotes}
          onChange={(e) => onChange('specialNotes', e.target.value)}
        />
        <FieldError message={errors.specialNotes} />
      </label>
    </fieldset>
  )
}
