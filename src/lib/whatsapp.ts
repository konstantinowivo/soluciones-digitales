import { env } from '../config/env'
import { DEFAULT_WHATSAPP_MESSAGE } from '../data/contact'

export const isWhatsAppConfigured = (): boolean => env.whatsappNumber.length > 0

/** https://wa.me/<numero>?text=<mensaje>. Devuelve '' si el número no está configurado. */
export const buildWhatsAppUrl = (message: string = DEFAULT_WHATSAPP_MESSAGE): string => {
  if (!isWhatsAppConfigured()) return ''
  return `https://wa.me/${env.whatsappNumber}?text=${encodeURIComponent(message)}`
}

/** Formato legible para mostrar el número (+54 9 351 ...). Solo presentación. */
export const formatWhatsAppNumber = (digits: string): string => {
  if (digits.startsWith('549') && digits.length === 13) {
    return `+54 9 ${digits.slice(3, 6)} ${digits.slice(6, 9)}-${digits.slice(9)}`
  }
  return `+${digits}`
}
