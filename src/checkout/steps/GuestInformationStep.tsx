// ---------------------------------------------------------------------------
// GuestInformationStep.tsx — Paso 1: Información del huésped
//
// Responsabilidades:
//   - Estado local del formulario (no sube al stepper hasta que el usuario avanza)
//   - Validación on-submit con Zod via validateGuestInformation()
//   - Prefill desde la checkoutSession si hay datos previos
//   - Llama onComplete con los valores validados → el stepper avanza
// ---------------------------------------------------------------------------

import { useEffect, useState } from 'react'
import { GlassPanel } from '@/design-system/components/GlassPanel'
import { Button } from '@/design-system/components/Button'
import { Typography } from '@/design-system/components/Typography'
import { GuestForm } from '../components/GuestForm'
import { validateGuestInformation } from '../validators'
import { EMPTY_GUEST_INFORMATION } from '../constants'
import type { CountryOption } from '@/types/booking'
import type { CheckoutSession } from '@/types/booking'
import type { GuestInformationErrors, GuestInformationValues } from '../types'

interface GuestInformationStepProps {
  initialValues?: Partial<GuestInformationValues>
  checkoutSession?: CheckoutSession | null
  countries: CountryOption[]
  isCountriesLoading: boolean
  onComplete: (values: GuestInformationValues) => void
}

export function GuestInformationStep({
  initialValues,
  checkoutSession,
  countries,
  isCountriesLoading,
  onComplete,
}: GuestInformationStepProps) {
  const [values, setValues] = useState<GuestInformationValues>(() => ({
    ...EMPTY_GUEST_INFORMATION,
    ...initialValues,
  }))
  const [errors, setErrors] = useState<GuestInformationErrors>({})

  // Prefill from checkout session if available and form is still empty
  useEffect(() => {
    if (!checkoutSession) return
    setValues((prev) => ({
      ...prev,
      firstName: prev.firstName || checkoutSession.firstName,
      lastName:  prev.lastName  || checkoutSession.lastName,
      phone:     prev.phone     || checkoutSession.phone,
      email:     prev.email     || checkoutSession.identityEmail,
    }))
  }, [checkoutSession])

  const handleChange = (field: keyof GuestInformationValues, value: string) => {
    setValues((prev) => {
      // Smart sync: when country changes, update phone code if it was set from the same country
      if (field === 'country') {
        const selected = countries.find((c) => c.code === value)
        const prevCountry = countries.find((c) => c.code === prev.country)
        const isPhoneCodeFromPrevCountry = prevCountry?.dialCode === prev.phoneCountryCode
        return {
          ...prev,
          country: value,
          phoneCountryCode:
            isPhoneCodeFromPrevCountry && selected
              ? selected.dialCode
              : prev.phoneCountryCode,
        }
      }
      return { ...prev, [field]: value }
    })
    // Clear the error for this field as the user types
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleContinue = () => {
    const validationErrors = validateGuestInformation(values)
    if (validationErrors) {
      setErrors(validationErrors)
      // Focus first error field for accessibility
      const firstErrorField = Object.keys(validationErrors)[0]
      const el = document.querySelector<HTMLElement>(`[name="${firstErrorField}"]`)
      el?.focus()
      return
    }
    setErrors({})
    onComplete(values)
  }

  return (
    <section aria-labelledby="guest-info-heading">
      <GlassPanel tone="mist" depth="elevated" radius="hero" padding="lg">
        <Typography
          id="guest-info-heading"
          as="h2"
          className="font-display text-2xl font-semibold text-ink"
        >
          Guest information
        </Typography>
        <p className="mt-2 text-sm text-ink-soft">
          We only use this to contact you about your reservation.
        </p>

        <div className="mt-6">
          <GuestForm
            values={values}
            errors={errors}
            countries={countries}
            isCountriesLoading={isCountriesLoading}
            isSubmitting={false}
            onChange={handleChange}
          />
        </div>

        <Button
          type="button"
          variant="brand"
          className="mt-8 w-full"
          onClick={handleContinue}
        >
          Continue to review →
        </Button>
      </GlassPanel>
    </section>
  )
}
