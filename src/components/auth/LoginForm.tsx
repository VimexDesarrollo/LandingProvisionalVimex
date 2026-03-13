'use client'

import { useState } from 'react'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/design-system/components/Button'
import { useAuth } from '@/context/auth-context'
import type { AuthServiceError } from '@/services/authService'
import type { LoginFormValues } from '@/types/auth'

// ---------------------------------------------------------------------------
// Schema de validación
// ---------------------------------------------------------------------------

const loginSchema = z.object({
  email:    z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.').max(128, 'Password is too long.'),
})

type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string>>

function buildFieldErrors(error: z.ZodError<LoginFormValues>): LoginFieldErrors {
  const flat = error.flatten().fieldErrors
  return {
    email:    flat.email?.[0],
    password: flat.password?.[0],
  }
}

const fieldClassName =
  'booking-field mt-1 h-12 px-4 text-base text-ink hover:border-card-border/90 hover:bg-surface-muted/85 focus:border-accent focus:bg-surface-muted/96 focus-visible:border-accent focus-visible:bg-surface-muted/96'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()

  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof LoginFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    setSubmissionError(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const parsed = loginSchema.safeParse(values)
    if (!parsed.success) {
      setFieldErrors(buildFieldErrors(parsed.error))
      return
    }

    setSubmissionError(null)
    setIsSubmitting(true)

    try {
      await login({ email: parsed.data.email, password: parsed.data.password })
      onSuccess?.()
    } catch (error) {
      const authError = error as AuthServiceError
      setSubmissionError(
        authError.nonFieldErrors ?? 'Something went wrong. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Sign in form">
      <div className="space-y-4">
        {submissionError ? (
          <p role="alert" className="rounded-xl border border-red-300/65 bg-red-100/70 px-4 py-3 text-sm font-medium text-red-900">
            {submissionError}
          </p>
        ) : null}

        <label className="block text-sm font-medium text-ink">
          Email address
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            aria-invalid={fieldErrors.email ? 'true' : 'false'}
            aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
            onChange={(e) => handleChange('email', e.target.value)}
            className={fieldClassName}
          />
          {fieldErrors.email ? (
            <p id="login-email-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
              {fieldErrors.email}
            </p>
          ) : null}
        </label>

        <label className="block text-sm font-medium text-ink">
          <span className="flex items-center justify-between">
            Password
            <Link
              href="/auth/forgot-password"
              className="text-xs font-normal text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              Forgot password?
            </Link>
          </span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={values.password}
            aria-invalid={fieldErrors.password ? 'true' : 'false'}
            aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
            onChange={(e) => handleChange('password', e.target.value)}
            className={fieldClassName}
          />
          {fieldErrors.password ? (
            <p id="login-password-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
              {fieldErrors.password}
            </p>
          ) : null}
        </label>
      </div>

      <Button
        type="submit"
        variant="brand"
        className="mt-6 w-full"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
