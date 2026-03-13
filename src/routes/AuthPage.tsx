'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { buildAuthHref, sanitizeReturnUrl, type AuthMode } from '@/lib/authNavigation'

export function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const requestedMode = searchParams.get('tab') === 'register' ? 'register' : 'login'
    const nextHref = buildAuthHref(requestedMode as AuthMode, sanitizeReturnUrl(searchParams.get('returnUrl')))
    const oauthError = searchParams.get('error')
    const finalHref = oauthError ? `${nextHref}${nextHref.includes('?') ? '&' : '?'}error=${encodeURIComponent(oauthError)}` : nextHref
    router.replace(finalHref)
  }, [router, searchParams])

  return (
    <main className="flex min-h-screen items-center justify-center pb-section pt-44">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" aria-label="Loading…" />
    </main>
  )
}
