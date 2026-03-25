export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  useMocks: (process.env.NEXT_PUBLIC_USE_MOCKS ?? 'true') !== 'false',
  usePricingMocks: (process.env.NEXT_PUBLIC_USE_PRICING_MOCKS ?? 'false') !== 'false',
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
} as const
