export type AuthMode = 'login' | 'register'

const INTERNAL_ORIGIN = 'https://vimex.local'

export function sanitizeReturnUrl(returnUrl: string | null | undefined): string {
  if (!returnUrl) {
    return '/'
  }

  try {
    const parsed = new URL(returnUrl, INTERNAL_ORIGIN)

    if (parsed.origin !== INTERNAL_ORIGIN || !parsed.pathname.startsWith('/')) {
      return '/'
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return '/'
  }
}

export function buildAuthHref(mode: AuthMode, returnUrl?: string | null): string {
  const params = new URLSearchParams()
  const safeReturnUrl = sanitizeReturnUrl(returnUrl)

  if (safeReturnUrl !== '/') {
    params.set('returnUrl', safeReturnUrl)
  }

  const query = params.toString()
  return query ? `/auth/${mode}?${query}` : `/auth/${mode}`
}

export function getCheckoutSessionTokenFromReturnUrl(returnUrl: string): string | null {
  try {
    return new URL(returnUrl, INTERNAL_ORIGIN).searchParams.get('checkoutSession')
  } catch {
    return null
  }
}

export function getGuestDetailsUrlFromReturnUrl(returnUrl: string): string {
  const safeReturnUrl = sanitizeReturnUrl(returnUrl)
  return safeReturnUrl.replace('/checkout', '/guest-details')
}
