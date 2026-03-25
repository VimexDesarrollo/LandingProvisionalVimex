import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GuestDetailsPicker } from '@/design-system/components/GuestDetailsPicker'

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    prefersReducedMotion: true,
  }),
}))

vi.mock('@/animations/gsap', () => ({
  gsap: {
    context: (_fn: () => void) => ({ revert: vi.fn() }), // eslint-disable-line @typescript-eslint/no-unused-vars
    fromTo: vi.fn(),
  },
}))

const originalInnerHeight = window.innerHeight
const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect

describe('GuestDetailsPicker', () => {
  beforeEach(() => {
    window.innerHeight = 900
  })

  afterEach(() => {
    window.innerHeight = originalInnerHeight
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect
  })

  it('opens upward when near the viewport bottom', () => {
    HTMLElement.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 780,
      bottom: 820,
      left: 0,
      right: 240,
      width: 240,
      height: 40,
      x: 0,
      y: 780,
      toJSON: () => ({}),
    }))

    render(
      <GuestDetailsPicker
        label="Guests"
        value={{ adults: 2, children: 0, infants: 0, pets: false }}
        onChange={() => {}}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /guests/i }))

    expect(screen.getByRole('dialog', { name: /guests/i })).toHaveAttribute('data-direction', 'up')
  })
})
