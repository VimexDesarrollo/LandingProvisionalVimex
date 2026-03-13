import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { LEGAL_PAGE_LINKS } from '@/content/legal'
import { adaptHomeContent } from '@/services/adapters/homeContent.adapter'
import { homeMock } from '@/services/mocks/home.mock'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children),
}))

describe('SiteFooter', () => {
  it('renders the legal section with all public links', () => {
    render(<SiteFooter content={adaptHomeContent(homeMock).footer} />)

    expect(screen.getByRole('heading', { level: 3, name: 'Legal' })).toBeInTheDocument()

    for (const link of LEGAL_PAGE_LINKS) {
      const footerLink = screen.getByRole('link', { name: link.label })
      expect(footerLink).toHaveAttribute('href', link.href)
    }
  })

  it('exposes stable destinations for checkout consent links', async () => {
    const user = userEvent.setup()

    render(<SiteFooter content={adaptHomeContent(homeMock).footer} />)

    const termsLink = screen.getByRole('link', { name: 'Terms of Service' })
    const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' })

    await user.click(termsLink)
    await user.click(privacyLink)

    expect(new URL((termsLink as HTMLAnchorElement).href, 'https://vimex.test').pathname).toBe('/terms')
    expect(new URL((privacyLink as HTMLAnchorElement).href, 'https://vimex.test').pathname).toBe('/privacy-policy')
  })
})
