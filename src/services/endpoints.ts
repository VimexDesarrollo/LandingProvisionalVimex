import { env } from '@/config/env'

const fallbackBaseUrl = '/api'

function sanitizeBaseUrl(baseUrl: string | undefined): string {
  if (!baseUrl || !baseUrl.trim()) {
    return fallbackBaseUrl
  }

  return baseUrl.replace(/\/$/, '')
}

const apiBaseUrl = sanitizeBaseUrl(env.apiBaseUrl)

export const endpoints = {
  home: `${apiBaseUrl}/content/home`,
  legalDocument: (hrefOrSlug: string) => `${apiBaseUrl}/content/legal/${encodeURIComponent(hrefOrSlug.replace(/^\//, ''))}/`,
  ownerLogin: `${apiBaseUrl}/owners/login`,
  countries: `${apiBaseUrl}/countries/`,
  quotes: `${apiBaseUrl}/quotes/`,
  bookingRequests: `${apiBaseUrl}/booking-requests/`,
  residences: `${apiBaseUrl}/residences/`,
  residenceDetail: (slug: string) => `${apiBaseUrl}/residences/${encodeURIComponent(slug)}`,
  residenceAvailability: (residenceId: string, start: string, end: string) =>
    `${apiBaseUrl}/residences/${encodeURIComponent(residenceId)}/availability/?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
  residencePricing: (slug: string, checkin: string, checkout: string) =>
    `${apiBaseUrl}/residences/${encodeURIComponent(slug)}/pricing/?checkin=${encodeURIComponent(checkin)}&checkout=${encodeURIComponent(checkout)}`,

  // ---------------------------------------------------------------------------
  // Auth — clientes del motor de reservas
  // ---------------------------------------------------------------------------
  authRegister:   `${apiBaseUrl}/auth/register/`,
  authLogin:      `${apiBaseUrl}/auth/login/`,
  authLogout:     `${apiBaseUrl}/auth/logout/`,
  authMe:         `${apiBaseUrl}/auth/me/`,
  authRefresh:    `${apiBaseUrl}/auth/refresh/`,
  authGoogleInit:           `${apiBaseUrl}/auth/google/`,
  authPasswordReset:        `${apiBaseUrl}/auth/password-reset/`,
  authPasswordResetConfirm: `${apiBaseUrl}/auth/password-reset/confirm/`,
  authCheckoutSessions: `${apiBaseUrl}/auth/checkout-sessions/`,
  authCheckoutSessionDetail: (token: string) => `${apiBaseUrl}/auth/checkout-sessions/${encodeURIComponent(token)}/`,
  authCheckoutSessionGuest: `${apiBaseUrl}/auth/checkout-sessions/guest/`,
  authCheckoutSessionOtpRequest: `${apiBaseUrl}/auth/checkout-sessions/otp/request/`,
  authCheckoutSessionOtpVerify: `${apiBaseUrl}/auth/checkout-sessions/otp/verify/`,
} as const
