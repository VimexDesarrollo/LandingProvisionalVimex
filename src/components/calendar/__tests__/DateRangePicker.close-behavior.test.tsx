import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DateRangePicker } from '@/components/calendar/DateRangePicker'
import type { SearchDateRangeValue } from '@/types/search'

describe('DateRangePicker close behavior', () => {
  it('keeps modal open after first date click and closes after second valid date', async () => {
    const user = userEvent.setup()

    let range: SearchDateRangeValue = {}
    const handleChange = (next: SearchDateRangeValue) => {
      range = next
      rerender(
        <DateRangePicker
          label="Dates"
          value={range}
          onChange={handleChange}
        />,
      )
    }

    const { rerender } = render(
      <DateRangePicker
        label="Dates"
        value={range}
        onChange={handleChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Dates' }))
    expect(screen.getByRole('dialog', { name: 'Date range modal' })).toBeDefined()

    await user.click(screen.getByRole('button', { name: /March 10.*2026/i }))
    expect(screen.getByRole('dialog', { name: 'Date range modal' })).toBeDefined()

    await user.click(screen.getByRole('button', { name: /March 13.*2026/i }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Date range modal' })).toBeNull()
    })
  })

  it('applies start-range visual class after first date click', async () => {
    const user = userEvent.setup()

    let range: SearchDateRangeValue = {}
    const handleChange = (next: SearchDateRangeValue) => {
      range = next
      rerender(
        <DateRangePicker
          label="Dates"
          value={range}
          onChange={handleChange}
        />,
      )
    }

    const { rerender } = render(
      <DateRangePicker
        label="Dates"
        value={range}
        onChange={handleChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Dates' }))
    await user.click(screen.getByRole('button', { name: /March 10.*2026/i }))

    expect(screen.getByRole('button', { name: 'Dates' }).textContent).toContain('Mar 10')
    expect(screen.getByRole('button', { name: 'Dates' }).textContent).not.toContain('—')
    expect(document.querySelector('.vimex-range-start, .vimex-selected-day')).not.toBeNull()
  })

  it('shows shaded preview range while selecting checkout on hover', async () => {
    const user = userEvent.setup()

    let range: SearchDateRangeValue = {}
    const handleChange = (next: SearchDateRangeValue) => {
      range = next
      rerender(
        <DateRangePicker
          label="Dates"
          value={range}
          onChange={handleChange}
        />,
      )
    }

    const { rerender } = render(
      <DateRangePicker
        label="Dates"
        value={range}
        onChange={handleChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Dates' }))
    await user.click(screen.getByRole('button', { name: /March 10.*2026/i }))
    const beforePreviewCount = document.querySelectorAll('.vimex-range-middle, .vimex-range-end').length
    await user.hover(screen.getByRole('button', { name: /March 13.*2026/i }))

    const afterPreviewCount = document.querySelectorAll('.vimex-range-middle, .vimex-range-end').length
    expect(afterPreviewCount).toBeGreaterThan(beforePreviewCount)
  })

  it('reopening and clicking a date resets previous range and starts new check-in', async () => {
    const user = userEvent.setup()

    let range: SearchDateRangeValue = {}
    const handleChange = (next: SearchDateRangeValue) => {
      range = next
      rerender(
        <DateRangePicker
          label="Dates"
          value={range}
          onChange={handleChange}
        />,
      )
    }

    const { rerender } = render(
      <DateRangePicker
        label="Dates"
        value={range}
        onChange={handleChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Dates' }))
    await user.click(screen.getByRole('button', { name: /March 10.*2026/i }))
    await user.click(screen.getByRole('button', { name: /March 13.*2026/i }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Date range modal' })).toBeNull()
    })
    expect(screen.getByRole('button', { name: 'Dates' }).textContent).toContain('Mar 10 — Mar 13')

    await user.click(screen.getByRole('button', { name: 'Dates' }))
    expect(screen.getByRole('button', { name: 'Dates' }).textContent).toContain('Select dates')
    expect(document.querySelector('.vimex-range-start, .vimex-range-middle, .vimex-range-end')).toBeNull()
    await user.click(screen.getByRole('button', { name: /March 19.*2026/i }))

    expect(screen.getByRole('button', { name: 'Dates' }).textContent).toContain('Mar 19')
    expect(screen.getByRole('button', { name: 'Dates' }).textContent).not.toContain('—')
    expect(screen.getByRole('dialog', { name: 'Date range modal' })).toBeDefined()
  })

  it('keeps previous committed range when reopening and closing after only one new click', async () => {
    const user = userEvent.setup()

    let range: SearchDateRangeValue = {}
    const handleChange = (next: SearchDateRangeValue) => {
      range = next
      rerender(
        <DateRangePicker
          label="Dates"
          value={range}
          onChange={handleChange}
        />,
      )
    }

    const { rerender } = render(
      <DateRangePicker
        label="Dates"
        value={range}
        onChange={handleChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Dates' }))
    await user.click(screen.getByRole('button', { name: /March 10.*2026/i }))
    await user.click(screen.getByRole('button', { name: /March 13.*2026/i }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Date range modal' })).toBeNull()
    })
    expect(screen.getByRole('button', { name: 'Dates' }).textContent).toContain('Mar 10 — Mar 13')

    await user.click(screen.getByRole('button', { name: 'Dates' }))
    await user.click(screen.getByRole('button', { name: /March 19.*2026/i }))
    await user.click(screen.getByRole('button', { name: 'Close calendar' }))

    expect(screen.getByRole('button', { name: 'Dates' }).textContent).toContain('Mar 10 — Mar 13')
  })
})
