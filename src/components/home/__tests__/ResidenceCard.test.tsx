import type React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResidenceCard } from '@/components/home/ResidenceCard'
import { DEFAULT_GUEST_DETAILS, type GuestDetails } from '@/types/guests'
import type { Residence } from '@/types/content'

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    prefersReducedMotion: true,
  }),
}))

vi.mock('@/animations/gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
  },
}))

vi.mock('@/design-system/components/ButtonLink', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ButtonLink: ({ href, children, ...rest }: any) => (
    <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </a>
  ),
}))

const baseResidence: Residence = {
  id: 'res-1',
  name: 'Villa Azul',
  location: 'Playa del Carmen',
  nightlyRateUsd: 450,
  rating: 5,
  imageUrl: 'https://example.com/villa-azul.jpg',
  slug: 'villa-azul',
}

function getDetailLinkHref(): string {
  const link = screen.getByRole('link', { name: /view details for villa azul/i })
  return link.getAttribute('href') ?? ''
}

describe('ResidenceCard', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('includes checkin, checkout, and guest details in the detail URL', () => {
    const guestDetails: GuestDetails = {
      adults: 3,
      children: 1,
      infants: 0,
      pets: true,
    }

    render(
      <ResidenceCard
        residence={baseResidence}
        checkin="2026-04-10"
        checkout="2026-04-15"
        guestDetails={guestDetails}
      />,
    )

    const url = new URL(getDetailLinkHref(), 'https://vimex.test')

    expect(url.pathname).toBe('/residences/villa-azul')
    expect(url.searchParams.get('checkin')).toBe('2026-04-10')
    expect(url.searchParams.get('checkout')).toBe('2026-04-15')
    expect(url.searchParams.get('adults')).toBe('3')
    expect(url.searchParams.get('children')).toBe('1')
    expect(url.searchParams.get('infants')).toBe('0')
    expect(url.searchParams.get('guests')).toBe('4+')
    expect(url.searchParams.get('pets')).toBe('true')
  })

  it('keeps only date params when guest details are default', () => {
    render(
      <ResidenceCard
        residence={baseResidence}
        checkin="2026-05-01"
        checkout="2026-05-03"
        guestDetails={DEFAULT_GUEST_DETAILS}
      />,
    )

    const url = new URL(getDetailLinkHref(), 'https://vimex.test')

    expect(url.searchParams.get('checkin')).toBe('2026-05-01')
    expect(url.searchParams.get('checkout')).toBe('2026-05-03')
    expect(url.searchParams.get('adults')).toBeNull()
    expect(url.searchParams.get('children')).toBeNull()
    expect(url.searchParams.get('infants')).toBeNull()
    expect(url.searchParams.get('guests')).toBeNull()
    expect(url.searchParams.get('pets')).toBeNull()
  })

  it('builds a clean detail URL when no booking filters are provided', () => {
    render(<ResidenceCard residence={baseResidence} />)

    expect(getDetailLinkHref()).toBe('/residences/villa-azul')
  })
})
