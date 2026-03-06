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
  ownerLogin: `${apiBaseUrl}/owners/login`,
  residences: `${apiBaseUrl}/residences/`,
  residenceDetail: (slug: string) => `${apiBaseUrl}/residences/${encodeURIComponent(slug)}`,
  residenceAvailability: (slug: string) => `${apiBaseUrl}/residences/${encodeURIComponent(slug)}/availability/`,
  residencePricing: (slug: string, checkin: string, checkout: string) =>
    `${apiBaseUrl}/residences/${encodeURIComponent(slug)}/pricing/?checkin=${encodeURIComponent(checkin)}&checkout=${encodeURIComponent(checkout)}`,
} as const
