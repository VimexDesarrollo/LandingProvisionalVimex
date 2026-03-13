'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { GuestContinueSection } from '@/components/auth/GuestContinueSection'
import { BookingGuestForm } from '@/components/booking-request/BookingGuestForm'
import { Container } from '@/design-system/components/Container'
import { Button } from '@/design-system/components/Button'
import { GlassPanel } from '@/design-system/components/GlassPanel'
import { Typography } from '@/design-system/components/Typography'
import { useCheckoutSession } from '@/hooks/useCheckoutSession'
import { bookingRequestService } from '@/services/bookingRequestService'
import type { BookingGuestContactValues, BookingRequestFormValues } from '@/types/booking'

const guestRegistrationSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.').max(100, 'First name is too long.'),
  lastName: z.string().trim().min(1, 'Last name is required.').max(100, 'Last name is too long.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().min(7, 'Enter a valid phone number.').max(50, 'Phone is too long.'),
})

type GuestRegistrationValues = z.infer<typeof guestRegistrationSchema>
type GuestAuthTab = 'login' | 'register'

const CARIBBEAN_BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=2400&q=80'

const EMPTY_VALUES: GuestRegistrationValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}

function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (!(error instanceof Error)) {
    return fallbackMessage
  }
  return error.message || fallbackMessage
}

export function GuestRegistrationPage() {
  const params = useParams<{ slug: string }>()
  const slugParam = params?.slug
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkoutSessionToken = searchParams.get('checkoutSession') ?? undefined
  const { checkoutSession, isLoading, error } = useCheckoutSession(checkoutSessionToken)

  const [values, setValues] = useState<GuestRegistrationValues>(EMPTY_VALUES)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof GuestRegistrationValues, string>>>({})
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [otpCode, setOtpCode] = useState('')
  const [isOtpStep, setIsOtpStep] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<GuestAuthTab>('register')
  const [isFormTransitioning, setIsFormTransitioning] = useState(false)

  useEffect(() => {
    if (!checkoutSession) return
    setValues({
      firstName: checkoutSession.firstName ?? '',
      lastName: checkoutSession.lastName ?? '',
      email: checkoutSession.identityEmail ?? '',
      phone: checkoutSession.phone ?? '',
    })
  }, [checkoutSession])

  const buildCheckoutUrl = () => {
    const nextParams = new URLSearchParams(searchParams.toString())
    return `/residences/${slug}/checkout?${nextParams.toString()}`
  }

  const validateValues = (): GuestRegistrationValues | null => {
    const parsed = guestRegistrationSchema.safeParse(values)
    if (!parsed.success) {
      const nextErrors = parsed.error.flatten().fieldErrors
      setFieldErrors({
        firstName: nextErrors.firstName?.[0],
        lastName: nextErrors.lastName?.[0],
        email: nextErrors.email?.[0],
        phone: nextErrors.phone?.[0],
      })
      return null
    }

    setFieldErrors({})
    return parsed.data
  }

  const handleChange = (field: keyof GuestRegistrationValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
    setSubmissionError(null)
  }

  const handleFormChange = (field: keyof BookingRequestFormValues, value: string) => {
    if (!['firstName', 'lastName', 'email', 'phone'].includes(field)) {
      return
    }

    handleChange(field as keyof BookingGuestContactValues, value)
  }

  const handleTabChange = (tab: GuestAuthTab) => {
    if (tab === activeTab) {
      return
    }

    setIsFormTransitioning(true)
    setActiveTab(tab)
    window.setTimeout(() => {
      setIsFormTransitioning(false)
    }, 220)
  }

  const handleRequestOtp = async () => {
    if (!checkoutSessionToken) return
    const parsed = validateValues()
    if (!parsed) return

    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      await bookingRequestService.requestCheckoutOtp({
        checkoutSessionToken,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        phone: parsed.phone,
      })
      setIsOtpStep(true)
    } catch (errorValue) {
      setSubmissionError(getApiErrorMessage(errorValue, 'We could not send the verification code.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinueAsGuest = async () => {
    if (!checkoutSessionToken) return

    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      await bookingRequestService.continueCheckoutAsGuest({
        checkoutSessionToken,
      })
      router.push(buildCheckoutUrl())
    } catch (errorValue) {
      setSubmissionError(getApiErrorMessage(errorValue, 'We could not continue as guest.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!checkoutSessionToken) return
    const parsed = validateValues()
    if (!parsed) return
    if (!/^\d{6}$/.test(otpCode.trim())) {
      setSubmissionError('Enter the 6-digit code.')
      return
    }

    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      await bookingRequestService.verifyCheckoutOtp({
        checkoutSessionToken,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        phone: parsed.phone,
        code: otpCode.trim(),
      })
      router.push(buildCheckoutUrl())
    } catch (errorValue) {
      setSubmissionError(getApiErrorMessage(errorValue, 'We could not verify your code.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="pb-section pt-44">
        <Container>
          <div className="mx-auto h-80 max-w-xl animate-pulse rounded-2xl bg-white/65" />
        </Container>
      </main>
    )
  }

  if (!checkoutSession || error || checkoutSession.residenceSlug !== slug) {
    return (
      <main className="pb-section pt-44">
        <Container>
          <section className="mx-auto max-w-xl rounded-2xl border border-white/70 bg-mist-gradient p-6 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/46">
            <Typography as="h1" variant="h3">Guest details</Typography>
            <Typography className="mt-3 text-base text-ink-soft">
              {error ?? 'We could not load this checkout session. Please start again from the residence page.'}
            </Typography>
            <Button className="mt-5" onClick={() => router.push(slug ? `/residences/${slug}` : '/residences')}>
              Return to residence
            </Button>
          </section>
        </Container>
      </main>
    )
  }

  return (
    <main className="relative isolate overflow-hidden pb-section pt-28 md:pt-36">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${CARIBBEAN_BACKGROUND_IMAGE})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(233,244,249,0.62)_0%,rgba(215,232,242,0.78)_42%,rgba(205,224,236,0.9)_100%)] backdrop-blur-[10px]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-white/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-10 -z-10 h-64 w-64 rounded-full bg-cyan-100/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute right-0 top-1/3 -z-10 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl"
      />

      <Container>
        <div className="mx-auto max-w-xl">
          <header className="mb-8 text-center">
            <Typography as="h1" variant="h3" className="text-ink">
              {isOtpStep
                ? 'Verify your email'
                : activeTab === 'login'
                  ? 'Log in to continue'
                  : 'Create account to continue'}
            </Typography>
            <p className="mt-2 text-sm text-ink-soft">
              {isOtpStep
                ? `We sent a 6-digit code to ${values.email}.`
                : activeTab === 'login'
                  ? 'Use your email code to continue with your reservation.'
                  : 'Add your contact details to create your account and continue to checkout.'}
            </p>
          </header>

          {submissionError ? (
            <div role="alert" className="mb-5 rounded-xl border border-amber-300/65 bg-amber-100/70 px-4 py-3 text-sm font-medium text-amber-950">
              {submissionError}
            </div>
          ) : null}

          <GlassPanel tone="mist" depth="elevated" radius="hero" padding="lg">
            <div
              role="tablist"
              className="relative mb-5 grid grid-cols-2 rounded-full border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.44)_0%,rgba(228,238,245,0.34)_100%)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]"
              aria-label="Guest authentication mode"
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-[linear-gradient(135deg,rgba(72,191,214,0.95)_0%,rgba(13,77,157,0.96)_58%,rgba(8,56,118,0.98)_100%)] shadow-[0_16px_34px_-18px_rgba(11,44,105,0.62)] ring-1 ring-white/28 transition-transform duration-300 ease-out ${
                  activeTab === 'login' ? 'translate-x-1' : 'translate-x-[calc(100%+0.25rem)]'
                }`}
              />
              <button
                role="tab"
                type="button"
                aria-selected={activeTab === 'login'}
                onClick={() => handleTabChange('login')}
                className={`relative z-10 rounded-full py-2.5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  activeTab === 'login' ? 'text-white' : 'text-ink-soft hover:text-ink'
                }`}
              >
                Login
              </button>
              <button
                role="tab"
                type="button"
                aria-selected={activeTab === 'register'}
                onClick={() => handleTabChange('register')}
                className={`relative z-10 rounded-full py-2.5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  activeTab === 'register' ? 'text-white' : 'text-ink-soft hover:text-ink'
                }`}
              >
                Create account
              </button>
            </div>

            <div
              className={`transition-all duration-200 ease-out ${
                isFormTransitioning ? 'translate-y-1 opacity-70' : 'translate-y-0 opacity-100'
              }`}
            >
              <BookingGuestForm
                values={values}
                errors={fieldErrors}
                isSubmitting={isOtpStep || isSubmitting}
                onChange={handleFormChange}
                variant="preregistration"
                title="Guest information"
                description={
                  activeTab === 'login'
                    ? 'Use the email on your existing account. We will send a one-time verification code to continue.'
                    : 'We only use this information to contact you about the request and confirm stay details.'
                }
              />
            </div>
          </GlassPanel>

          <GlassPanel
            tone="mist"
            depth="elevated"
            radius="hero"
            padding="lg"
            className="mt-4 supports-[backdrop-filter]:bg-white/22"
          >
            {isOtpStep ? (
              <div>
                <label className="text-sm font-medium text-ink">
                  Verification code
                  <input
                    inputMode="numeric"
                    className="booking-field mt-1 h-12 w-full px-4 text-base tracking-[0.3em] text-ink"
                    value={otpCode}
                    onChange={(event) => {
                      setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                      setSubmissionError(null)
                    }}
                    disabled={isSubmitting}
                  />
                </label>
                <Button variant="brand" className="mt-6 w-full" onClick={handleVerifyOtp} disabled={isSubmitting}>
                  {isSubmitting ? 'Verifying…' : 'Verify and continue'}
                </Button>
                <button
                  type="button"
                  className="mt-4 w-full text-sm text-ink-soft underline-offset-2 hover:text-ink hover:underline"
                  onClick={handleRequestOtp}
                  disabled={isSubmitting}
                >
                  Resend code
                </button>
              </div>
            ) : (
              <>
                <Button variant="brand" className="mt-6 w-full" onClick={handleRequestOtp} disabled={isSubmitting}>
                  {isSubmitting
                    ? 'Sending code…'
                    : activeTab === 'login'
                      ? 'Continue with login verification'
                      : 'Continue with email verification'}
                </Button>
                <div className="mt-4">
                  <GuestContinueSection onContinueAsGuest={handleContinueAsGuest} />
                </div>
              </>
            )}
          </GlassPanel>
        </div>
      </Container>
    </main>
  )
}
