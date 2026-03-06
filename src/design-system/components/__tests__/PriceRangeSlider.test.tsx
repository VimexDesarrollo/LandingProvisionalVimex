import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PriceRangeSlider } from '@/design-system/components/PriceRangeSlider'

describe('PriceRangeSlider', () => {
  it('keeps drag interaction local and emits filter update on pointer release', () => {
    const onChange = vi.fn()

    render(
      <PriceRangeSlider
        prices={[100, 200, 300]}
        onChange={onChange}
      />,
    )

    const minInput = screen.getByLabelText('Minimum nightly price')

    fireEvent.pointerDown(minInput)
    fireEvent.change(minInput, { target: { value: '200' } })
    expect(onChange).not.toHaveBeenCalled()

    fireEvent.pointerUp(minInput)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith({ min: 200, max: undefined })
  })

  it('still emits updates immediately for non-drag interactions', () => {
    const onChange = vi.fn()

    render(
      <PriceRangeSlider
        prices={[100, 200, 300]}
        onChange={onChange}
      />,
    )

    const minInput = screen.getByLabelText('Minimum nightly price')
    fireEvent.change(minInput, { target: { value: '200' } })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith({ min: 200, max: undefined })
  })
})
