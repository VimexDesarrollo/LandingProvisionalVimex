import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StatsSection } from '@/components/home/StatsSection'

vi.mock('@/hooks/useUI', () => ({
  useUI: () => ({
    prefersReducedMotion: false,
  }),
}))

vi.mock('@/i18n/LocaleContext', () => ({
  useLocale: () => ({
    t: {
      stats: {
        years: 'Anios en la Riviera Maya',
        properties: 'Propiedades en Gestion',
        guests: 'Huespedes Satisfechos',
        rating: 'Calificacion Promedio',
      },
    },
  }),
}))

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []

  callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  observe() {}

  disconnect() {}

  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }
}

describe('StatsSection', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = []

    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      value: MockIntersectionObserver,
    })

    let now = 0
    vi.spyOn(performance, 'now').mockImplementation(() => now)
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      now += 800
      callback(now)
      return now
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined)
  })

  it('starts at zero and counts up when the section enters the viewport', () => {
    const { container } = render(<StatsSection />)
    const counters = Array.from(container.querySelectorAll<HTMLElement>('[data-count]'))

    expect(counters).toHaveLength(4)
    expect(counters.map((counter) => counter.textContent)).toEqual(['0', '0', '0', '0'])

    act(() => {
      MockIntersectionObserver.instances[0]?.trigger(true)
    })

    expect(counters.map((counter) => counter.textContent)).toEqual(['20', '150', '10000', '4.9'])
  })
})
