'use client'

import { useMemo, useState } from 'react'
import { z } from 'zod'
import { CountryCombobox } from '@/components/booking-request/CountryCombobox'
import { Button } from '@/design-system/components/Button'
import { useCountries } from '@/hooks/useCountries'
import { useAuth } from '@/context/auth-context'
import type { AuthServiceError } from '@/services/authService'
import type { CountryOption } from '@/types/booking'
import type { RegisterFormValues } from '@/types/auth'

// ---------------------------------------------------------------------------
// Schema de validación
// ---------------------------------------------------------------------------

const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.').max(100, 'First name is too long.'),
  lastName:  z.string().trim().min(1, 'Last name is required.').max(100, 'Last name is too long.'),
  email:     z.string().trim().email('Enter a valid email address.'),
  phoneCountryCode: z.string().trim().min(1, 'Phone code is required.').max(8, 'Phone code is invalid.'),
  phone:     z.string().trim().min(1, 'Phone is required.').max(50, 'Phone is too long.'),
  password:  z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password is too long.'),
})

type RegisterFieldErrors = Partial<Record<keyof RegisterFormValues, string>>

function buildFieldErrors(error: z.ZodError<RegisterFormValues>): RegisterFieldErrors {
  const flat = error.flatten().fieldErrors
  return {
    firstName: flat.firstName?.[0],
    lastName:  flat.lastName?.[0],
    email:     flat.email?.[0],
    phoneCountryCode: flat.phoneCountryCode?.[0],
    phone:     flat.phone?.[0],
    password:  flat.password?.[0],
  }
}

const fieldClassName =
  'booking-field mt-1 h-12 px-4 text-base text-ink hover:border-card-border/90 hover:bg-surface-muted/85 focus:border-accent focus:bg-surface-muted/96 focus-visible:border-accent focus-visible:bg-surface-muted/96'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register } = useAuth()
  const { countries, isLoading: isCountriesLoading } = useCountries()
  const [isPhoneCodeExpanded, setIsPhoneCodeExpanded] = useState(false)

  const [values, setValues] = useState<RegisterFormValues>({
    firstName: '',
    lastName:  '',
    email:     '',
    phoneCountryCode: '',
    phone: '',
    password:  '',
  })
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const phoneCodeOptions = useMemo<CountryOption[]>(() => {
    const uniqueDialCodes = new Map<string, CountryOption>()
    countries.forEach((country) => {
      if (!uniqueDialCodes.has(country.dialCode)) {
        uniqueDialCodes.set(country.dialCode, country)
      }
    })
    return Array.from(uniqueDialCodes.values())
  }, [countries])

  const handleChange = (field: keyof RegisterFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    setSubmissionError(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const parsed = registerSchema.safeParse(values)
    if (!parsed.success) {
      setFieldErrors(buildFieldErrors(parsed.error))
      return
    }

    setSubmissionError(null)
    setIsSubmitting(true)

    try {
      await register({
        firstName: parsed.data.firstName,
        lastName:  parsed.data.lastName,
        email:     parsed.data.email,
        phone:     `${parsed.data.phoneCountryCode.trim()} ${parsed.data.phone.trim()}`.trim(),
        password:  parsed.data.password,
      })
      onSuccess?.()
    } catch (error) {
      const authError = error as AuthServiceError
      // Los errores de campo del backend se mezclan con los de Zod del frontend
      setFieldErrors((prev) => ({
        ...prev,
        ...(authError.fieldErrors ?? {}),
      }))
      if (authError.nonFieldErrors) {
        setSubmissionError(authError.nonFieldErrors)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Create account form">
      <div className="space-y-4">
        {submissionError ? (
          <p role="alert" className="rounded-xl border border-red-300/65 bg-red-100/70 px-4 py-3 text-sm font-medium text-red-900">
            {submissionError}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-ink">
            First name
            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              value={values.firstName}
              aria-invalid={fieldErrors.firstName ? 'true' : 'false'}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={fieldClassName}
            />
            {fieldErrors.firstName ? (
              <p role="alert" className="mt-1 text-xs font-medium text-red-700">{fieldErrors.firstName}</p>
            ) : null}
          </label>

          <label className="block text-sm font-medium text-ink">
            Last name
            <input
              type="text"
              name="lastName"
              autoComplete="family-name"
              value={values.lastName}
              aria-invalid={fieldErrors.lastName ? 'true' : 'false'}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={fieldClassName}
            />
            {fieldErrors.lastName ? (
              <p role="alert" className="mt-1 text-xs font-medium text-red-700">{fieldErrors.lastName}</p>
            ) : null}
          </label>
        </div>

        <label className="block text-sm font-medium text-ink">
          Email address
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            aria-invalid={fieldErrors.email ? 'true' : 'false'}
            onChange={(e) => handleChange('email', e.target.value)}
            className={fieldClassName}
          />
          {fieldErrors.email ? (
            <p role="alert" className="mt-1 text-xs font-medium text-red-700">{fieldErrors.email}</p>
          ) : null}
        </label>

        <div className="text-sm font-medium text-ink">
          Phone
          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-start">
            <CountryCombobox
              countries={phoneCodeOptions}
              isLoading={isCountriesLoading}
              value={values.phoneCountryCode}
              label="Phone code"
              placeholder="Code"
              error={fieldErrors.phoneCountryCode}
              className="px-2.5"
              wrapperClassName={
                isPhoneCodeExpanded
                  ? 'w-full transition-[width,max-width,flex-basis] duration-300 ease-out sm:max-w-[14rem] sm:basis-[14rem]'
                  : 'w-full transition-[width,max-width,flex-basis] duration-300 ease-out sm:max-w-[8.5rem] sm:basis-[4rem]'
              }
              getOptionValue={(country) => country.dialCode}
              getOptionLabel={(country) => `${country.flagEmoji} ${country.name} (${country.dialCode})`}
              getSelectedLabel={(country) => `${country.flagEmoji} ${country.dialCode}`}
              onOpenChange={setIsPhoneCodeExpanded}
              onChange={(value) => handleChange('phoneCountryCode', value)}
            />
            <input
              type="tel"
              name="phone"
              autoComplete="tel-national"
              aria-label="Phone number"
              value={values.phone}
              aria-invalid={fieldErrors.phone ? 'true' : 'false'}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="booking-field h-12 w-full flex-1 px-4 text-base text-ink hover:border-card-border/90 hover:bg-surface-muted/85 focus:border-accent focus:bg-surface-muted/96 focus-visible:border-accent focus-visible:bg-surface-muted/96"
            />
          </div>
          {fieldErrors.phoneCountryCode ? (
            <p role="alert" className="mt-1 text-xs font-medium text-red-700">{fieldErrors.phoneCountryCode}</p>
          ) : null}
          {fieldErrors.phone ? (
            <p role="alert" className="mt-1 text-xs font-medium text-red-700">{fieldErrors.phone}</p>
          ) : null}
        </div>

        <label className="block text-sm font-medium text-ink">
          Password
          <input
            type="password"
            name="password"
            aria-label="Password"
            autoComplete="new-password"
            value={values.password}
            aria-invalid={fieldErrors.password ? 'true' : 'false'}
            onChange={(e) => handleChange('password', e.target.value)}
            className={fieldClassName}
          />
          {fieldErrors.password ? (
            <p role="alert" className="mt-1 text-xs font-medium text-red-700">{fieldErrors.password}</p>
          ) : null}
          <p className="mt-1 text-xs text-ink-soft">Minimum 8 characters.</p>
        </label>
      </div>

      <Button
        type="submit"
        variant="brand"
        className="mt-6 w-full"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="mt-4 text-center text-xs text-ink-soft">
        By creating an account you agree to our terms of service.
        Your data is only used to manage your reservations.
      </p>
    </form>
  )
}
