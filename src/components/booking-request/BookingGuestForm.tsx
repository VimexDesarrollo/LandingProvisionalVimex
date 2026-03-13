import { Button } from '@/design-system/components/Button'
import { GlassPanel } from '@/design-system/components/GlassPanel'
import { Typography } from '@/design-system/components/Typography'
import { CountryCombobox } from '@/components/booking-request/CountryCombobox'
import { useState } from 'react'
import type { BookingGuestContactValues, BookingRequestFormValues, CountryOption } from '@/types/booking'

interface BookingGuestFormProps {
  countries?: CountryOption[]
  isCountriesLoading?: boolean
  values: BookingGuestContactValues | BookingRequestFormValues
  errors: Partial<Record<keyof BookingRequestFormValues, string>>
  isSubmitting: boolean
  onChange: (field: keyof BookingRequestFormValues, value: string) => void
  onSubmit?: () => void
  submitLabel?: string
  title?: string
  description?: string
  variant?: 'checkout' | 'preregistration'
}

const fieldClassName =
  'booking-field mt-1 h-12 px-4 text-base text-ink hover:border-card-border/90 hover:bg-surface-muted/85 focus:border-accent focus:bg-surface-muted/96 focus-visible:border-accent focus-visible:bg-surface-muted/96'

const textareaClassName =
  'booking-field mt-1 min-h-28 px-4 py-3 text-base text-ink hover:border-card-border/90 hover:bg-surface-muted/85 focus:border-accent focus:bg-surface-muted/96 focus-visible:border-accent focus-visible:bg-surface-muted/96'

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return <p className="mt-1 text-xs font-medium text-red-700">{message}</p>
}

export function BookingGuestForm({
  countries = [],
  isCountriesLoading = false,
  values,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
  submitLabel = 'Send booking request',
  title = 'Guest information',
  description = 'We only use this information to contact you about the request and confirm stay details.',
  variant = 'checkout',
}: BookingGuestFormProps) {
  const [isPhoneCodeExpanded, setIsPhoneCodeExpanded] = useState<boolean>(false)
  const isCheckoutVariant = variant === 'checkout'

  return (
    <GlassPanel tone="mist" depth="default" radius="glass" padding="md" className="supports-[backdrop-filter]:bg-white/28">
      <Typography as="h2" className="font-display text-2xl font-semibold text-ink">
        {title}
      </Typography>
      <Typography className="mt-2 text-sm text-ink-soft">
        {description}
      </Typography>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-ink">
          First name
          <input
            aria-invalid={errors.firstName ? 'true' : 'false'}
            className={fieldClassName}
            name="firstName"
            value={values.firstName}
            onChange={(event) => onChange('firstName', event.target.value)}
          />
          <FieldError message={errors.firstName} />
        </label>
        <label className="text-sm font-medium text-ink">
          Last name
          <input
            aria-invalid={errors.lastName ? 'true' : 'false'}
            className={fieldClassName}
            name="lastName"
            value={values.lastName}
            onChange={(event) => onChange('lastName', event.target.value)}
          />
          <FieldError message={errors.lastName} />
        </label>
        <label className="text-sm font-medium text-ink">
          Email
          <input
            aria-invalid={errors.email ? 'true' : 'false'}
            className={fieldClassName}
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => onChange('email', event.target.value)}
          />
          <FieldError message={errors.email} />
        </label>
        <div className={`text-sm font-medium text-ink ${isCheckoutVariant ? '' : 'md:col-span-2'}`}>
          Phone
          {isCheckoutVariant ? (
            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-start">
              <CountryCombobox
                countries={countries}
                isLoading={isCountriesLoading}
                value={'phoneCountryCode' in values ? values.phoneCountryCode : ''}
                label="Phone code"
                placeholder="Code"
                error={errors.phoneCountryCode}
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
                onChange={(value) => onChange('phoneCountryCode', value)}
              />
              <input
                aria-label="Phone number"
                aria-invalid={errors.phone ? 'true' : 'false'}
                className="booking-field h-12 w-full flex-1 px-4 text-base text-ink hover:border-card-border/90 hover:bg-surface-muted/85 focus:border-accent focus:bg-surface-muted/96 focus-visible:border-accent focus-visible:bg-surface-muted/96"
                name="phone"
                placeholder="Phone number"
                value={values.phone}
                onChange={(event) => onChange('phone', event.target.value)}
              />
            </div>
          ) : (
            <input
              aria-label="Phone"
              aria-invalid={errors.phone ? 'true' : 'false'}
              className={`${fieldClassName} w-full`}
              name="phone"
              value={values.phone}
              onChange={(event) => onChange('phone', event.target.value)}
            />
          )}
          {isCheckoutVariant ? <FieldError message={errors.phoneCountryCode} /> : null}
          <FieldError message={errors.phone} />
        </div>
        {isCheckoutVariant ? (
          <>
            <div className="text-sm font-medium text-ink md:col-span-2">
              Country
              <CountryCombobox
                countries={countries}
                isLoading={isCountriesLoading}
                value={'country' in values ? values.country : ''}
                label="Country"
                error={errors.country}
                getOptionLabel={(country) => `${country.flagEmoji} ${country.name}`}
                getSelectedLabel={(country) => country.name}
                onChange={(value) => onChange('country', value)}
              />
              <FieldError message={errors.country} />
            </div>
            <label className="text-sm font-medium text-ink md:col-span-2">
              Special notes
              <textarea
                aria-invalid={errors.specialNotes ? 'true' : 'false'}
                className={textareaClassName}
                name="specialNotes"
                value={'specialNotes' in values ? values.specialNotes : ''}
                onChange={(event) => onChange('specialNotes', event.target.value)}
              />
              <FieldError message={errors.specialNotes} />
            </label>
          </>
        ) : null}
      </div>

      {onSubmit ? (
        <Button className="mt-6 w-full" type="button" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Sending request…' : submitLabel}
        </Button>
      ) : null}
    </GlassPanel>
  )
}
