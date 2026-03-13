'use client'

import { useState } from 'react'
import { initiateGoogleAuth } from '@/services/authService'

interface GoogleAuthButtonProps {
  label?: string
  /** returnUrl que se preservará a través del flujo OAuth y se restaurará en /auth/callback */
  returnUrl?: string
}

export function GoogleAuthButton({ label = 'Continue with Google', returnUrl }: GoogleAuthButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setError(null)
    setIsRedirecting(true)
    try {
      await initiateGoogleAuth(returnUrl)
      // initiateGoogleAuth() redirige el navegador completo.
      // Si llegamos aquí significa que hubo un error antes de la redirección.
    } catch {
      setError('Could not connect to Google. Please try again.')
      setIsRedirecting(false)
    }
  }

  return (
    <div>
      {error ? (
        <p role="alert" className="mb-3 rounded-xl border border-red-300/65 bg-red-100/70 px-4 py-3 text-sm font-medium text-red-900">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleClick}
        disabled={isRedirecting}
        aria-busy={isRedirecting}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-pill border border-ink/12 bg-white px-6 font-body text-base font-semibold text-ink shadow-sm transition-all duration-200 hover:border-ink/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        {isRedirecting ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/20 border-t-ink" aria-hidden="true" />
        ) : (
          <GoogleLogo />
        )}
        <span>{isRedirecting ? 'Redirecting…' : label}</span>
      </button>
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}
