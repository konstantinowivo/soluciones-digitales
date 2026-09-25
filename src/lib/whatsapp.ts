import { env } from '../config/env'
import { DEFAULT_WHATSAPP_MESSAGE } from '../data/contact'

export const isWhatsAppConfigured = (): boolean => env.whatsappNumber.length > 0

/** https://wa.me/<numero>?text=<mensaje>. Devuelve '' si el número no está configurado. */
export const buildWhatsAppUrl = (message: string = DEFAULT_WHATSAPP_MESSAGE): string => {
  if (!isWhatsAppConfigured()) return ''
  return `https://wa.me/${env.whatsappNumber}?text=${encodeURIComponent(message)}`
}
