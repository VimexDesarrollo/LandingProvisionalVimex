// "YYYY-MM-DD"
export type DateKey = string

// "YYYY-MM"
export type MonthKey = string

export interface CalendarState {
  checkIn: DateKey | null
  checkOut: DateKey | null
  visibleMonth: MonthKey
  // Mínimo de noches requerido — configurable por propiedad
  minNights: number
}

export type CalendarAction =
  | { type: 'SELECT_DATE'; date: DateKey }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_VISIBLE_MONTH'; month: MonthKey }

export const DEFAULT_MIN_NIGHTS = 3
