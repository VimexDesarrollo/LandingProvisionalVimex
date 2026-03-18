// ---------------------------------------------------------------------------
// checkout/utils.ts — Utilidades puras del flujo de checkout
//
// Todas las funciones son puras (sin side-effects) para facilitar testing.
// ---------------------------------------------------------------------------

// ── Formato de moneda ─────────────────────────────────────────────────────

/**
 * Formatea un número como precio en USD.
 * @example formatUsd(1234.5) → "$1,234.50"
 */
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// ── Formato de fechas ─────────────────────────────────────────────────────

/**
 * Formatea una fecha ISO (YYYY-MM-DD) a formato legible.
 * @example formatDate('2026-03-10') → "Mar 10, 2026"
 */
export function formatDate(isoDate: string): string {
  // Añadir T00:00:00 evita problemas de zona horaria al parsear solo la fecha
  const date = new Date(`${isoDate}T00:00:00`)
  if (!isFinite(date.getTime())) return isoDate
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  })
}

// ── Conteo de noches ──────────────────────────────────────────────────────

/**
 * Cuenta las noches entre dos fechas ISO.
 * Devuelve 0 si alguna es inválida o el orden es incorrecto.
 */
export function countNights(checkIn: string, checkOut: string): number {
  const start = new Date(`${checkIn}T00:00:00`)
  const end   = new Date(`${checkOut}T00:00:00`)
  if (!isFinite(start.getTime()) || !isFinite(end.getTime())) return 0
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000))
}

// ── Formato de teléfono ───────────────────────────────────────────────────

/**
 * Combina el código de país con el número para enviarlo al backend.
 * @example formatPhoneForSubmission('+52', '3312345678') → "+52 3312345678"
 */
export function formatPhoneForSubmission(
  phoneCountryCode: string,
  phone: string,
): string {
  return `${phoneCountryCode.trim()} ${phone.trim()}`.trim()
}

// ── Sanitización XSS básica ───────────────────────────────────────────────

/**
 * Escapa caracteres HTML peligrosos de un string para rendering seguro.
 * Úsalo antes de insertar texto del usuario en contextos HTML.
 */
export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#x27;')
}

/**
 * Verifica si un string contiene patrones típicos de XSS.
 * Usado en tests de seguridad, no en validación de producción
 * (la validación real la hace el backend).
 */
export function containsXssPattern(value: string): boolean {
  const patterns = [
    /<script[\s\S]*?>/i,
    /javascript:/i,
    /on\w+\s*=/i,        // onclick=, onload=, etc.
    /<iframe/i,
    /<img[^>]+src\s*=/i,
  ]
  return patterns.some((pattern) => pattern.test(value))
}
