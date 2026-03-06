import type { CalendarAction, CalendarState, DateKey } from './types'

// ---------------------------------------------------------------------------
// Helpers puros — sin dependencias externas
// ---------------------------------------------------------------------------

// Cuenta cuántas noches hay entre checkIn y checkOut.
// Usa Date.UTC para evitar problemas de timezone.
function countNights(checkIn: DateKey, checkOut: DateKey): number {
  const [ciY, ciM, ciD] = checkIn.split('-').map(Number)
  const [coY, coM, coD] = checkOut.split('-').map(Number)
  const startMs = Date.UTC(ciY, ciM - 1, ciD)
  const endMs = Date.UTC(coY, coM - 1, coD)
  return Math.round((endMs - startMs) / 86_400_000)
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case 'SELECT_DATE': {
      const { date } = action

      // Si ya hay un rango completo, o no hay checkIn aún → la fecha clickeada
      // se convierte en el nuevo checkIn y se borra el checkOut.
      if (!state.checkIn || state.checkOut) {
        return { ...state, checkIn: date, checkOut: null }
      }

      // Solo hay checkIn. Evaluar si la fecha es válida como checkOut.

      // Regla 1: checkOut debe ser POSTERIOR a checkIn.
      if (date <= state.checkIn) {
        return { ...state, checkIn: date, checkOut: null }
      }

      // Regla 2: el rango debe cumplir el mínimo de noches.
      if (countNights(state.checkIn, date) < state.minNights) {
        return { ...state, checkIn: date, checkOut: null }
      }

      // Fecha válida como checkOut.
      return { ...state, checkOut: date }
    }

    case 'CLEAR_SELECTION':
      return { ...state, checkIn: null, checkOut: null }

    case 'SET_VISIBLE_MONTH':
      return { ...state, visibleMonth: action.month }
  }
}
