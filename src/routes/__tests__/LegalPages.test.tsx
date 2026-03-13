import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { legalPages } from '@/content/legal'
import PrivacyPolicyPage, { generateMetadata as generatePrivacyMetadata } from '../../../app/(legal)/privacy-policy/page'
import TermsPage, { generateMetadata as generateTermsMetadata } from '../../../app/(legal)/terms/page'
import CancellationPolicyPage, { generateMetadata as generateCancellationMetadata } from '../../../app/(legal)/cancellation-policy/page'
import PaymentPolicyPage, { generateMetadata as generatePaymentMetadata } from '../../../app/(legal)/payment-policy/page'
import CookiePolicyPage, { generateMetadata as generateCookieMetadata } from '../../../app/(legal)/cookie-policy/page'
import HouseRulesPage, { generateMetadata as generateHouseRulesMetadata } from '../../../app/(legal)/house-rules/page'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children),
}))

const routeFixtures = [
  {
    page: legalPages.privacyPolicy,
    Component: PrivacyPolicyPage,
    generateMetadata: generatePrivacyMetadata,
    expectedSection: 'Information We Collect',
  },
  {
    page: legalPages.terms,
    Component: TermsPage,
    generateMetadata: generateTermsMetadata,
    expectedSection: 'Acceptance of Terms',
  },
  {
    page: legalPages.cancellationPolicy,
    Component: CancellationPolicyPage,
    generateMetadata: generateCancellationMetadata,
    expectedSection: 'Cancellation Windows',
  },
  {
    page: legalPages.paymentPolicy,
    Component: PaymentPolicyPage,
    generateMetadata: generatePaymentMetadata,
    expectedSection: 'Payment Methods',
  },
  {
    page: legalPages.cookiePolicy,
    Component: CookiePolicyPage,
    generateMetadata: generateCookieMetadata,
    expectedSection: 'What Cookies Are',
  },
  {
    page: legalPages.houseRules,
    Component: HouseRulesPage,
    generateMetadata: generateHouseRulesMetadata,
    expectedSection: 'Guest Conduct',
  },
] as const

describe('legal route pages', () => {
  it.each(routeFixtures)('renders $page.title at $page.href with semantic content', async ({ page, Component, expectedSection }) => {
    render(await Component())

    expect(screen.getByRole('heading', { level: 1, name: page.title })).toBeInTheDocument()
    expect(screen.getByText((_, node) => node?.textContent === `Last updated: ${page.updatedAt}`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: expectedSection })).toBeInTheDocument()
  })

  it.each(routeFixtures)('exposes stable metadata for $page.href', async ({ page, generateMetadata }) => {
    const metadata = await generateMetadata()
    expect(metadata.title).toBe(`${page.title} — Vimex`)
    expect(metadata.description).toBe(page.description)
    expect(metadata.alternates?.canonical).toBe(page.href)
  })
})
