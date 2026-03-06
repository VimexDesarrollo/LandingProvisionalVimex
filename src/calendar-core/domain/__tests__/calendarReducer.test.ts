import { describe, expect, it } from 'vitest'
import { calendarReducer } from '../calendarReducer'
import type { CalendarState } from '../types'

// Estado base reutilizable en todos los tests
const base: CalendarState = {
  checkIn: null,
  checkOut: null,
  visibleMonth: '2026-03',
  minNights: 3,
}

// ---------------------------------------------------------------------------
// Selección de fechas
// ---------------------------------------------------------------------------

describe('calendarReducer — selectDate', () => {
  it('sets checkIn when no date is selected yet', () => {
    const next = calendarReducer(base, { type: 'SELECT_DATE', date: '2026-03-10' })

    expect(next.checkIn).toBe('2026-03-10')
    expect(next.checkOut).toBeNull()
  })

  it('sets checkOut when date is after checkIn and meets minNights', () => {
    // checkIn=Mar 10, checkOut=Mar 13 → 3 noches ✓
    const state: CalendarState = { ...base, checkIn: '2026-03-10' }
    const next = calendarReducer(state, { type: 'SELECT_DATE', date: '2026-03-13' })

    expect(next.checkIn).toBe('2026-03-10')
    expect(next.checkOut).toBe('2026-03-13')
  })

  it('restarts selection when selected date is before checkIn', () => {
    const state: CalendarState = { ...base, checkIn: '2026-03-10' }
    const next = calendarReducer(state, { type: 'SELECT_DATE', date: '2026-03-08' })

    expect(next.checkIn).toBe('2026-03-08')
    expect(next.checkOut).toBeNull()
  })

  it('restarts selection when selected date equals checkIn', () => {
    const state: CalendarState = { ...base, checkIn: '2026-03-10' }
    const next = calendarReducer(state, { type: 'SELECT_DATE', date: '2026-03-10' })

    expect(next.checkIn).toBe('2026-03-10')
    expect(next.checkOut).toBeNull()
  })

  it('restarts as new checkIn when checkout does not meet minNights', () => {
    // checkIn=Mar 10, checkOut=Mar 12 → solo 2 noches, minNights=3 ✗
    const state: CalendarState = { ...base, checkIn: '2026-03-10' }
    const next = calendarReducer(state, { type: 'SELECT_DATE', date: '2026-03-12' })

    expect(next.checkIn).toBe('2026-03-12')
    expect(next.checkOut).toBeNull()
  })

  it('accepts checkout when nights equal minNights exactly', () => {
    // Mar 10 → Mar 13 = exactamente 3 noches = minNights ✓
    const state: CalendarState = { ...base, checkIn: '2026-03-10' }
    const next = calendarReducer(state, { type: 'SELECT_DATE', date: '2026-03-13' })

    expect(next.checkOut).toBe('2026-03-13')
  })

  it('accepts checkout when nights exceed minNights', () => {
    // Mar 10 → Mar 17 = 7 noches > 3 ✓
    const state: CalendarState = { ...base, checkIn: '2026-03-10' }
    const next = calendarReducer(state, { type: 'SELECT_DATE', date: '2026-03-17' })

    expect(next.checkOut).toBe('2026-03-17')
  })

  it('restarts as new checkIn when both dates are set and user clicks again', () => {
    const state: CalendarState = { ...base, checkIn: '2026-03-10', checkOut: '2026-03-13' }
    const next = calendarReducer(state, { type: 'SELECT_DATE', date: '2026-03-20' })

    expect(next.checkIn).toBe('2026-03-20')
    expect(next.checkOut).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Limpiar selección
// ---------------------------------------------------------------------------

describe('calendarReducer — clearSelection', () => {
  it('clears checkIn and checkOut without touching visibleMonth or minNights', () => {
    const state: CalendarState = { ...base, checkIn: '2026-03-10', checkOut: '2026-03-13' }
    const next = calendarReducer(state, { type: 'CLEAR_SELECTION' })

    expect(next.checkIn).toBeNull()
    expect(next.checkOut).toBeNull()
    expect(next.visibleMonth).toBe('2026-03')
    expect(next.minNights).toBe(3)
  })
})

// ---------------------------------------------------------------------------
// Mes visible
// ---------------------------------------------------------------------------

describe('calendarReducer — setVisibleMonth', () => {
  it('changes visibleMonth without affecting checkIn or checkOut', () => {
    const state: CalendarState = { ...base, checkIn: '2026-03-10', visibleMonth: '2026-03' }
    const next = calendarReducer(state, { type: 'SET_VISIBLE_MONTH', month: '2026-04' })

    expect(next.visibleMonth).toBe('2026-04')
    expect(next.checkIn).toBe('2026-03-10')
    expect(next.checkOut).toBeNull()
  })
})
