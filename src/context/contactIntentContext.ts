import { createContext } from 'react'
import type { NeedValue } from '../data/contact'

/**
 * Guarda qué necesidad eligió el visitante (tarjeta, servicio o formulario)
 * para preseleccionarla en el formulario y contextualizar el mensaje de WhatsApp.
 */
export interface ContactIntentValue {
  need: NeedValue | ''
  setNeed: (need: NeedValue | '') => void
}

export const ContactIntentContext = createContext<ContactIntentValue | null>(null)
