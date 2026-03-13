'use client'

// ---------------------------------------------------------------------------
// ResetPasswordPage.tsx — Establece la nueva contraseña
//
// Lee uid y token de los query params (enviados por el backend en el email).
// Muestra un formulario para ingresar y confirmar la nueva contraseña.
// En caso de token inválido o expirado, muestra el error del backend.
// ---------------------------------------------------------------------------

import { useState } from 'react'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiCheckCircle } from 'react-icons/fi'
import { Button } from '@/design-system/components/Button'
import { Container } from '@/design-system/components/Container'
import { Typography } from '@/design-system/components/Typography'
import { confirmPasswordReset } from '@/services/authService'

const resetSchema = z
  .object({
    password:        z.string().min(8, 'Password must be at least 8 characters.').max(128),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path:    ['confirmPassword'],
  })

type PageState = 'idle' | 'submitting' | 'success'

const fieldClassName =
  'booking-field mt-1 h-12 px-4 text-base text-ink hover:border-card-border/90 hover:bg-surface-muted/85 focus:border-accent focus:bg-surface-muted/96 focus-visible:border-accent focus-visible:bg-surface-muted/96'

export function ResetPasswordPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const uid   = searchParams.get('uid')   ?? ''
  const token = searchParams.get('token') ?? ''

  const [values, setValues] = useState({ password: '', confirmPassword: '' })
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [pageState, setPageState]     = useState<PageState>('idle')

  const handleChange = (field: 'password' | 'confirmPassword', value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    setSubmitError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const parsed = resetSchema.safeParse(values)
    if (!parsed.success) {
      const errs = parsed.error.flatten().fieldErrors
      setFieldErrors({
        password:        errs.password?.[0],
        confirmPassword: errs.confirmPassword?.[0],
      })
      return
    }

    if (!uid || !token) {
      setSubmitError('Invalid reset link. Please request a new one.')
      return
    }

    setSubmitError(null)
    setPageState('submitting')

    try {
      await confirmPasswordReset(uid, token, parsed.data.password)
      setPageState('success')
      setTimeout(() => router.replace('/auth/login'), 3000)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setPageState('idle')
    }
  }

  if (!uid || !token) {
    return (
      <main className="pb-section pt-28 md:pt-36">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <Typography as="h1" variant="h3" className="text-ink">
              Invalid reset link
            </Typography>
            <p className="mt-2 text-sm text-ink-soft">
              This link is missing required parameters. Please request a new one.
            </p>
            <Link
              href="/auth/forgot-password"
              className="mt-6 inline-block font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Request a new reset link
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="pb-section pt-28 md:pt-36">
      <Container>
        <div className="mx-auto max-w-md">
          <header className="mb-8 text-center">
            <Typography as="h1" variant="h3" className="text-ink">
              Set new password
            </Typography>
            <p className="mt-2 text-sm text-ink-soft">
              Choose a strong password for your account.
            </p>
          </header>

          <div className="rounded-2xl border border-white/70 bg-mist-gradient p-6 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-white/46">
            {pageState === 'success' ? (
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <FiCheckCircle className="h-6 w-6 text-green-600" aria-hidden />
                </div>
                <Typography as="h2" variant="h5" className="text-ink">
                  Password updated
                </Typography>
                <p className="mt-2 text-sm text-ink-soft">
                  Your password has been changed. Redirecting you to sign in…
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-label="Set new password form">
                {submitError ? (
                  <div role="alert" className="mb-5 rounded-xl border border-red-300/65 bg-red-100/70 px-4 py-3 text-sm font-medium text-red-900">
                    {submitError}
                    {submitError.toLowerCase().includes('expired') || submitError.toLowerCase().includes('invalid') ? (
                      <Link
                        href="/auth/forgot-password"
                        className="ml-1 underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                      >
                        Request a new link.
                      </Link>
                    ) : null}
                  </div>
                ) : null}

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-ink">
                    New password
                    <input
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      value={values.password}
                      aria-invalid={fieldErrors.password ? 'true' : 'false'}
                      aria-describedby={fieldErrors.password ? 'reset-password-error' : undefined}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className={fieldClassName}
                    />
                    {fieldErrors.password ? (
                      <p id="reset-password-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
                        {fieldErrors.password}
                      </p>
                    ) : null}
                  </label>

                  <label className="block text-sm font-medium text-ink">
                    Confirm new password
                    <input
                      type="password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={values.confirmPassword}
                      aria-invalid={fieldErrors.confirmPassword ? 'true' : 'false'}
                      aria-describedby={fieldErrors.confirmPassword ? 'reset-confirm-error' : undefined}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className={fieldClassName}
                    />
                    {fieldErrors.confirmPassword ? (
                      <p id="reset-confirm-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
                        {fieldErrors.confirmPassword}
                      </p>
                    ) : null}
                  </label>
                </div>

                <Button
                  type="submit"
                  className="mt-6 w-full"
                  disabled={pageState === 'submitting'}
                  aria-busy={pageState === 'submitting'}
                >
                  {pageState === 'submitting' ? 'Updating…' : 'Update password'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </main>
  )
}
