import { describe, expect, it } from 'vitest'
import { buildAuthHref, getCheckoutSessionTokenFromReturnUrl, getGuestDetailsUrlFromReturnUrl, sanitizeReturnUrl } from '@/lib/authNavigation'

describe('authNavigation', () => {
  it('keeps internal paths intact', () => {
    expect(sanitizeReturnUrl('/residences/villa-azul/checkout?checkoutSession=session-1')).toBe(
      '/residences/villa-azul/checkout?checkoutSession=session-1',
    )
  })

  it('rejects external absolute urls', () => {
    expect(sanitizeReturnUrl('https://evil.example/phish')).toBe('/')
  })

  it('rejects javascript urls', () => {
    expect(sanitizeReturnUrl('javascript:alert(1)')).toBe('/')
  })

  it('builds auth hrefs without adding home returnUrl noise', () => {
    expect(buildAuthHref('login', '/')).toBe('/auth/login')
  })

  it('builds auth hrefs with internal returnUrl preserved', () => {
    expect(buildAuthHref('register', '/residences/villa-azul')).toBe('/auth/register?returnUrl=%2Fresidences%2Fvilla-azul')
  })

  it('extracts checkout session tokens from the returnUrl', () => {
    expect(getCheckoutSessionTokenFromReturnUrl('/residences/villa-azul/checkout?checkoutSession=session-1')).toBe('session-1')
  })

  it('maps checkout urls to guest-details urls', () => {
    expect(getGuestDetailsUrlFromReturnUrl('/residences/villa-azul/checkout?checkoutSession=session-1')).toBe(
      '/residences/villa-azul/guest-details?checkoutSession=session-1',
    )
  })
})
