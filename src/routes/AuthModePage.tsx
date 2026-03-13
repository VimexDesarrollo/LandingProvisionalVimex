'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiCheckCircle } from 'react-icons/fi'
import { GuestContinueSection } from '@/components/auth/GuestContinueSection'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Button } from '@/design-system/components/Button'
import { Container } from '@/design-system/components/Container'
import { GlassPanel } from '@/design-system/components/GlassPanel'
import { Typography } from '@/design-system/components/Typography'
import { useAuth } from '@/context/auth-context'
import { buildAuthHref, getCheckoutSessionTokenFromReturnUrl, getGuestDetailsUrlFromReturnUrl, sanitizeReturnUrl, type AuthMode } from '@/lib/authNavigation'

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_state: 'Authentication was interrupted. Please try again.',
  token_exchange_failed: 'Could not connect to Google. Please try again.',
  user_info_failed: 'Could not retrieve your Google profile. Please try again.',
  incomplete_google_profile: 'Your Google account is missing required information.',
  account_creation_failed: 'Could not create your account. Please try again or use email.',
}

type PageState = 'idle' | 'registered'

interface AuthModePageProps {
  mode: AuthMode
}

export function AuthModePage({ mode }: AuthModePageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status, isAuthenticated } = useAuth()

  const returnUrl = sanitizeReturnUrl(searchParams.get('returnUrl'))
  const oauthError = searchParams.get('error')
  const checkoutSessionToken = getCheckoutSessionTokenFromReturnUrl(returnUrl)
  const isCheckoutAuthFlow = Boolean(checkoutSessionToken)
  const hasReservationContext = returnUrl !== '/'

  const [pageState, setPageState] = useState<PageState>('idle')
  const [countdown, setCountdown] = useState(15)
  const justRegisteredRef = useRef(false)

  useEffect(() => {
    if (status !== 'loading' && isAuthenticated && pageState === 'idle' && !justRegisteredRef.current) {
      router.replace(returnUrl)
    }
  }, [status, isAuthenticated, pageState, returnUrl, router])

  useEffect(() => {
    if (pageState !== 'registered') return
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [pageState])

  useEffect(() => {
    if (pageState === 'registered' && countdown === 0) {
      router.replace(returnUrl)
    }
  }, [countdown, pageState, returnUrl, router])

  useEffect(() => {
    if (!isCheckoutAuthFlow) {
      return
    }

    router.replace(getGuestDetailsUrlFromReturnUrl(returnUrl))
  }, [isCheckoutAuthFlow, returnUrl, router])

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center pb-section pt-44">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" aria-label="Loading…" />
      </main>
    )
  }

  if (isAuthenticated && pageState === 'idle') {
    return null
  }

  if (isCheckoutAuthFlow) {
    return (
      <main className="pb-section pt-28 md:pt-36">
        <Container>
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" aria-label="Loading…" />
          </div>
        </Container>
      </main>
    )
  }

  if (pageState === 'registered') {
    return (
      <main className="pb-section pt-28 md:pt-36">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <GlassPanel radius="glass" depth="elevated" padding="lg" className="p-10 supports-[backdrop-filter]:bg-white/30">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <FiCheckCircle className="h-8 w-8 text-green-600" aria-hidden />
              </div>
              <Typography as="h1" variant="h3" className="text-ink">
                Account created!
              </Typography>
              <p className="mt-3 text-sm text-ink-soft">
                Welcome to Vimex. Your account is ready — let&apos;s finish your reservation.
              </p>
              <Button type="button" variant="brand" className="mt-8 w-full" onClick={() => router.replace(returnUrl)}>
                Continue with your reservation →
              </Button>
              <p className="mt-3 text-xs text-ink-soft">Redirecting automatically in {countdown}s…</p>
            </GlassPanel>
          </div>
        </Container>
      </main>
    )
  }

  const oauthErrorMessage = oauthError ? (OAUTH_ERROR_MESSAGES[oauthError] ?? OAUTH_ERROR_MESSAGES.token_exchange_failed) : null
  const isLogin = mode === 'login'
  const switchHref = buildAuthHref(isLogin ? 'register' : 'login', returnUrl)

  const handleLoginSuccess = () => {
    router.replace(returnUrl)
  }

  const handleRegisterSuccess = () => {
    if (hasReservationContext) {
      justRegisteredRef.current = true
      setPageState('registered')
      return
    }

    router.replace(returnUrl)
  }

  return (
    <main className="pb-section pt-28 md:pt-36">
      <Container>
        <div className="mx-auto max-w-md">
          <header className="mb-8 text-center">
            <Typography as="h1" variant="h3" className="text-ink">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </Typography>
            <p className="mt-2 text-sm text-ink-soft">
              {isLogin ? 'Sign in to manage your reservations.' : 'Join Vimex to book your vacation home.'}
            </p>
          </header>

          <GlassPanel radius="hero" depth="elevated" padding="lg">
            {oauthErrorMessage ? (
              <div role="alert" className="mb-5 rounded-xl border border-amber-300/65 bg-amber-100/70 px-4 py-3 text-sm font-medium text-amber-950">
                {oauthErrorMessage}
              </div>
            ) : null}

            <GoogleAuthButton
              label={isLogin ? 'Sign in with Google' : 'Sign up with Google'}
              returnUrl={returnUrl}
            />

            <div className="my-5 flex items-center gap-3" aria-hidden="true">
              <div className="h-px flex-1 bg-ink/10" />
              <span className="text-xs text-ink-soft">or</span>
              <div className="h-px flex-1 bg-ink/10" />
            </div>

            {isLogin ? <LoginForm onSuccess={handleLoginSuccess} /> : <RegisterForm onSuccess={handleRegisterSuccess} />}

            <p className="mt-5 text-center text-sm text-ink-soft">
              {isLogin ? 'New to Vimex?' : 'Already have an account?'}{' '}
              <Link href={switchHref} className="font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                {isLogin ? 'Create account' : 'Sign in'}
              </Link>
            </p>
          </GlassPanel>

          {hasReservationContext ? (
            <div className="mt-4">
              <GuestContinueSection onContinueAsGuest={() => router.push(returnUrl)} />
            </div>
          ) : null}

          <p className="mt-6 text-center text-xs text-ink-soft">
            We only collect the information necessary to process your reservation.
            Your data is never sold or shared for marketing purposes without your explicit consent.
          </p>
        </div>
      </Container>
    </main>
  )
}
