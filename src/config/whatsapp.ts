export const WHATSAPP_NUMBER = '529841311019'

export function buildWhatsAppUrl(message: string): string | null {
  if (!WHATSAPP_NUMBER) return null
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

interface ContactFields {
  locale?: 'en' | 'es'
  name: string
  email: string
  phone?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  message?: string
}

export function buildContactMessage(f: ContactFields): string {
  const isSpanish = (f.locale ?? 'es') === 'es'
  const lines: string[] = [isSpanish ? 'Hola Vimex! 👋' : 'Hello Vimex! 👋', '']
  lines.push(`*${isSpanish ? 'Nombre' : 'Name'}:* ${f.name}`)
  lines.push(`*Email:* ${f.email}`)
  if (f.phone) lines.push(`*${isSpanish ? 'Teléfono' : 'Phone'}:* ${f.phone}`)
  if (f.checkIn) lines.push(`*${isSpanish ? 'Llegada' : 'Check-in'}:* ${f.checkIn}`)
  if (f.checkOut) lines.push(`*${isSpanish ? 'Salida' : 'Check-out'}:* ${f.checkOut}`)
  if (f.guests) lines.push(`*${isSpanish ? 'Huéspedes' : 'Guests'}:* ${f.guests}`)
  if (f.message) { lines.push(''); lines.push(`*${isSpanish ? 'Mensaje' : 'Message'}:*\n${f.message}`) }
  return lines.join('\n')
}
