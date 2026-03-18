import { describe, expect, it } from 'vitest'
import {
  containsXssPattern,
  countNights,
  escapeHtml,
  formatDate,
  formatPhoneForSubmission,
  formatUsd,
} from '../../utils'

// ---------------------------------------------------------------------------
// formatUsd
// ---------------------------------------------------------------------------

describe('formatUsd', () => {
  it('formats zero as $0.00', () => {
    expect(formatUsd(0)).toBe('$0.00')
  })

  it('formats integer amounts with two decimal places', () => {
    expect(formatUsd(100)).toBe('$100.00')
  })

  it('formats thousands with comma separator', () => {
    expect(formatUsd(1234.56)).toBe('$1,234.56')
  })

  it('rounds to two decimal places', () => {
    expect(formatUsd(99.999)).toBe('$100.00')
  })

  it('handles large amounts', () => {
    expect(formatUsd(10_000)).toBe('$10,000.00')
  })
})

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------

describe('formatDate', () => {
  it('formats a valid ISO date', () => {
    expect(formatDate('2026-03-10')).toBe('Mar 10, 2026')
  })

  it('formats the first day of the year', () => {
    expect(formatDate('2026-01-01')).toBe('Jan 1, 2026')
  })

  it('returns the raw value if the date is invalid', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })

  it('handles leap year dates correctly', () => {
    expect(formatDate('2024-02-29')).toBe('Feb 29, 2024')
  })
})

// ---------------------------------------------------------------------------
// countNights
// ---------------------------------------------------------------------------

describe('countNights', () => {
  it('counts two nights correctly', () => {
    expect(countNights('2026-03-10', '2026-03-12')).toBe(2)
  })

  it('counts one night', () => {
    expect(countNights('2026-03-10', '2026-03-11')).toBe(1)
  })

  it('returns 0 when dates are the same', () => {
    expect(countNights('2026-03-10', '2026-03-10')).toBe(0)
  })

  it('returns 0 when checkout is before checkin', () => {
    expect(countNights('2026-03-12', '2026-03-10')).toBe(0)
  })

  it('returns 0 for invalid date strings', () => {
    expect(countNights('bad', '2026-03-12')).toBe(0)
    expect(countNights('2026-03-10', 'bad')).toBe(0)
  })

  it('counts across month boundaries', () => {
    expect(countNights('2026-01-30', '2026-02-02')).toBe(3)
  })
})

// ---------------------------------------------------------------------------
// formatPhoneForSubmission
// ---------------------------------------------------------------------------

describe('formatPhoneForSubmission', () => {
  it('combines country code and phone number with a space', () => {
    expect(formatPhoneForSubmission('+52', '3312345678')).toBe('+52 3312345678')
  })

  it('trims extra whitespace from both parts', () => {
    expect(formatPhoneForSubmission('  +1  ', '  5551234567  ')).toBe('+1 5551234567')
  })

  it('returns only the phone if code is empty', () => {
    expect(formatPhoneForSubmission('', '5551234567')).toBe('5551234567')
  })

  it('returns only the code if phone is empty (edge case)', () => {
    expect(formatPhoneForSubmission('+52', '')).toBe('+52')
  })
})

// ---------------------------------------------------------------------------
// escapeHtml
// ---------------------------------------------------------------------------

describe('escapeHtml', () => {
  it('escapes < and >', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
  })

  it('escapes ampersands', () => {
    expect(escapeHtml('A & B')).toBe('A &amp; B')
  })

  it('escapes double quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;')
  })

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#x27;s')
  })

  it('leaves safe text unchanged', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123')
  })
})

// ---------------------------------------------------------------------------
// containsXssPattern
// ---------------------------------------------------------------------------

describe('containsXssPattern', () => {
  it('detects <script> tags', () => {
    expect(containsXssPattern('<script>alert(1)</script>')).toBe(true)
  })

  it('detects javascript: protocol', () => {
    expect(containsXssPattern('javascript:alert(1)')).toBe(true)
  })

  it('detects inline event handlers', () => {
    expect(containsXssPattern('onclick=alert(1)')).toBe(true)
    expect(containsXssPattern('onload =evil()')).toBe(true)
  })

  it('detects iframes', () => {
    expect(containsXssPattern('<iframe src="evil.com">')).toBe(true)
  })

  it('returns false for clean text', () => {
    expect(containsXssPattern('Hello, my name is Juan')).toBe(false)
    expect(containsXssPattern('Special request: no smoking')).toBe(false)
  })
})
