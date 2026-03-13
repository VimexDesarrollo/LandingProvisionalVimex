import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GlassSelect } from '@/design-system/components/GlassSelect'

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    prefersReducedMotion: true,
  }),
}))

vi.mock('@/animations/gsap', () => ({
  gsap: {
    context: (_fn: () => void) => ({ revert: vi.fn() }),
    fromTo: vi.fn(),
  },
}))

const originalInnerHeight = window.innerHeight
const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect

describe('GlassSelect', () => {
  beforeEach(() => {
    window.innerHeight = 900
  })

  afterEach(() => {
    window.innerHeight = originalInnerHeight
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect
  })

  it('opens downward when there is enough room below', () => {
    HTMLElement.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 100,
      bottom: 140,
      left: 0,
      right: 240,
      width: 240,
      height: 40,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    }))

    render(
      <GlassSelect
        label="Beds"
        value=""
        placeholder="Beds"
        onChange={() => {}}
        options={[{ label: '1+', value: '1+' }]}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /beds/i }))

    expect(screen.getByRole('listbox', { name: /beds/i })).toHaveAttribute('data-direction', 'down')
  })

  it('opens upward when space below is too tight', () => {
    HTMLElement.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 760,
      bottom: 800,
      left: 0,
      right: 240,
      width: 240,
      height: 40,
      x: 0,
      y: 760,
      toJSON: () => ({}),
    }))

    render(
      <GlassSelect
        label="Beds"
        value=""
        placeholder="Beds"
        onChange={() => {}}
        options={[{ label: '1+', value: '1+' }]}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /beds/i }))

    expect(screen.getByRole('listbox', { name: /beds/i })).toHaveAttribute('data-direction', 'up')
  })
})
