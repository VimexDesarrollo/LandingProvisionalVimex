'use client'

// ---------------------------------------------------------------------------
// ForgotPasswordPage.tsx — Solicitud de recuperación de contraseña
//
// El usuario ingresa su email. Si existe en el sistema, recibirá un correo
// con un enlace para restablecer su contraseña.
//
// Anti-enumeración: el mensaje de confirmación es idéntico sin importar
// si el email existe o no — el backend tampoco revela esta información.
// ---------------------------------------------------------------------------

import { useState } from 'react'
import { z } from 'zod'
import Link from 'next/link'
import { FiArrowLeft, FiMail } from 'react-icons/fi'
import { Button } from '@/design-system/components/Button'
import { Container } from '@/design-system/components/Container'
import { GlassPanel } from '@/design-system/components/GlassPanel'
import { Typography } from '@/design-system/components/Typography'
import { requestPasswordReset } from '@/services/authService'

const emailSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
})

type PageState = 'idle' | 'submitting' | 'sent'

export function ForgotPasswordPage() {
  const [email, setEmail]           = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [networkError, setNetworkError] = useState<string | null>(null)
  const [pageState, setPageState]   = useState<PageState>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const parsed = emailSchema.safeParse({ email })
    if (!parsed.success) {
      setEmailError(parsed.error.flatten().fieldErrors.email?.[0] ?? 'Invalid email.')
      return
    }

    setEmailError(null)
    setNetworkError(null)
    setPageState('submitting')

    try {
      await requestPasswordReset(parsed.data.email)
      setPageState('sent')
    } catch {
      setNetworkError('Could not send the reset link. Please check your connection and try again.')
      setPageState('idle')
    }
  }

  return (
    <main className="pb-section pt-28 md:pt-36">
      <Container>
        <div className="mx-auto max-w-md">
          <header className="mb-8 text-center">
            <Typography as="h1" variant="h3" className="text-ink">
              Reset your password
            </Typography>
            <p className="mt-2 text-sm text-ink-soft">
              Enter your email and we'll send you a reset link.
            </p>
          </header>

          <GlassPanel radius="hero" depth="elevated" padding="lg">
            {pageState === 'sent' ? (
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                  <FiMail className="h-6 w-6 text-accent" aria-hidden />
                </div>
                <Typography as="h2" variant="h5" className="text-ink">
                  Check your inbox
                </Typography>
                <p className="mt-2 text-sm text-ink-soft">
                  If that email is registered, you'll receive a reset link shortly.
                  Check your spam folder if you don't see it.
                </p>
                <Link
                  href="/auth/login"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                >
                  <FiArrowLeft aria-hidden className="h-4 w-4" />
                  Back to Sign in
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-label="Password reset form">
                {networkError ? (
                  <p role="alert" className="mb-4 rounded-xl border border-red-300/65 bg-red-100/70 px-4 py-3 text-sm font-medium text-red-900">
                    {networkError}
                  </p>
                ) : null}
                <label className="block text-sm font-medium text-ink">
                  Email address
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    aria-invalid={emailError ? 'true' : 'false'}
                    aria-describedby={emailError ? 'forgot-email-error' : undefined}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(null) }}
                    className="booking-field mt-1 h-12 px-4 text-base text-ink hover:border-card-border/90 hover:bg-surface-muted/85 focus:border-accent focus:bg-surface-muted/96 focus-visible:border-accent focus-visible:bg-surface-muted/96"
                  />
                  {emailError ? (
                    <p id="forgot-email-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
                      {emailError}
                    </p>
                  ) : null}
                </label>

                <Button
                  type="submit"
                  variant="brand"
                  className="mt-6 w-full"
                  disabled={pageState === 'submitting'}
                  aria-busy={pageState === 'submitting'}
                >
                  {pageState === 'submitting' ? 'Sending…' : 'Send reset link'}
                </Button>
              </form>
            )}
          </GlassPanel>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Remember your password?{' '}
            <Link href="/auth/login" className="font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
              Sign in
            </Link>
          </p>
        </div>
      </Container>
    </main>
  )
}
