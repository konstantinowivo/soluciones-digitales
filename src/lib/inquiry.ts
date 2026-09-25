import { env } from '../config/env'
import { site } from '../config/site'
import { needLabel, needOptions, type NeedValue } from '../data/contact'
import { sanitizeSingleLine, sanitizeText } from './sanitize'

export interface InquiryInput {
  name: string
  company: string
  email: string
  whatsapp: string
  need: NeedValue | ''
  message: string
}

export type InquiryField = keyof InquiryInput
export type InquiryErrors = Partial<Record<InquiryField, string>>

export const LIMITS = { name: 80, company: 100, email: 120, whatsapp: 25, message: 1500 } as const

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const URL_PATTERN = /(https?:\/\/|www\.)/gi

export const emptyInquiry: InquiryInput = {
  name: '',
  company: '',
  email: '',
  whatsapp: '',
  need: '',
  message: '',
}

const isNeed = (value: string): value is NeedValue => needOptions.some((option) => option.value === value)

export function validateField(field: InquiryField, values: InquiryInput): string | undefined {
  const value = values[field].trim()
  switch (field) {
    case 'name':
      if (!value) return 'Ingresá tu nombre.'
      if (value.length < 2) return 'El nombre es demasiado corto.'
      if (value.length > LIMITS.name) return `Usá hasta ${LIMITS.name} caracteres.`
      return undefined
    case 'company':
      if (value.length > LIMITS.company) return `Usá hasta ${LIMITS.company} caracteres.`
      return undefined
    case 'email':
      if (!value) return 'Ingresá tu email para poder responderte.'
      if (!EMAIL_PATTERN.test(value) || value.length > LIMITS.email)
        return 'Revisá el email: debería tener el formato nombre@empresa.com.'
      return undefined
    case 'whatsapp': {
      if (!value) return undefined
      const digits = value.replace(/\D/g, '')
      if (!/^[\d\s()+-]+$/.test(value) || digits.length < 8 || digits.length > 15)
        return 'Ingresá un número válido, con código de área. Ejemplo: 351 123 4567.'
      return undefined
    }
    case 'need':
      if (!value || !isNeed(value)) return 'Elegí qué necesitás. Si no estás seguro, elegí la última opción.'
      return undefined
    case 'message':
      if (!value) return 'Contanos brevemente tu proyecto.'
      if (value.length < 10) return 'Sumá un poco más de detalle (al menos 10 caracteres).'
      if (value.length > LIMITS.message) return `Usá hasta ${LIMITS.message} caracteres.`
      if ((value.match(URL_PATTERN) ?? []).length > 3) return 'El mensaje puede incluir hasta 3 enlaces.'
      return undefined
  }
}

export function validateInquiry(values: InquiryInput): InquiryErrors {
  const errors: InquiryErrors = {}
  ;(Object.keys(values) as InquiryField[]).forEach((field) => {
    const error = validateField(field, values)
    if (error) errors[field] = error
  })
  return errors
}

export const isFormConfigured = (): boolean => env.web3formsAccessKey.length > 0

export class InquiryError extends Error {}

/**
 * Envía la consulta a Web3Forms (https://web3forms.com).
 * Solo se envían los datos que el visitante escribió; no se guardan en el navegador.
 */
export async function submitInquiry(values: InquiryInput, honeypot: boolean): Promise<void> {
  if (!isFormConfigured()) {
    throw new InquiryError('El formulario todavía no está habilitado.')
  }

  const need = values.need && isNeed(values.need) ? values.need : 'asesoramiento'
  const payload = {
    access_key: env.web3formsAccessKey,
    subject: `Nueva consulta: ${needLabel(need)}`,
    from_name: site.brand,
    botcheck: honeypot,
    // Campos visibles en el email que recibís:
    name: sanitizeSingleLine(values.name, LIMITS.name),
    email: sanitizeSingleLine(values.email, LIMITS.email),
    Empresa: sanitizeSingleLine(values.company, LIMITS.company) || 'No indicada',
    WhatsApp: sanitizeSingleLine(values.whatsapp, LIMITS.whatsapp) || 'No indicado',
    Necesidad: needLabel(need),
    message: sanitizeText(values.message, LIMITS.message),
  }

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    const data = (await response.json().catch(() => null)) as { success?: boolean } | null
    if (!response.ok || !data?.success) {
      throw new InquiryError('No pudimos enviar la consulta.')
    }
  } catch (error) {
    if (error instanceof InquiryError) throw error
    throw new InquiryError('No pudimos enviar la consulta. Revisá tu conexión e intentá de nuevo.')
  } finally {
    window.clearTimeout(timeout)
  }
}
