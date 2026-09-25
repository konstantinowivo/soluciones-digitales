/**
 * Único punto de lectura de variables de entorno.
 * Ningún componente debe leer import.meta.env directamente.
 */

const clean = (value: string | undefined): string => (value ?? '').trim()

const digitsOnly = (value: string): string => value.replace(/\D/g, '')

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/i
const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/i
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Número por defecto: es público de todos modos (va en cada link wa.me) y asegura que los botones
 * de WhatsApp aparezcan aunque falte la variable en Vercel. La variable lo sigue pudiendo reemplazar.
 */
const DEFAULT_WHATSAPP_NUMBER = '5493415325391'
const rawWhatsApp = digitsOnly(clean(import.meta.env.VITE_WHATSAPP_NUMBER)) || DEFAULT_WHATSAPP_NUMBER
const rawEmail = clean(import.meta.env.VITE_CONTACT_EMAIL)
const rawGa = clean(import.meta.env.VITE_GA_ID)
const rawGtm = clean(import.meta.env.VITE_GTM_ID)

export const env = {
  siteUrl: clean(import.meta.env.VITE_SITE_URL).replace(/\/+$/, ''),
  /** Solo dígitos, listo para https://wa.me/<numero>. Vacío si no está configurado. */
  whatsappNumber: rawWhatsApp.length >= 8 ? rawWhatsApp : '',
  contactEmail: EMAIL_PATTERN.test(rawEmail) ? rawEmail : '',
  /**
   * La access key de Web3Forms es pública por diseño (viaja al navegador en cada envío).
   * El valor por defecto asegura que el formulario funcione aunque falte la variable en Vercel.
   */
  web3formsAccessKey:
    clean(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY) || '8c01977d-0b22-41ef-a1d5-b7468d32aa3b',
  gaId: GA_ID_PATTERN.test(rawGa) ? rawGa : '',
  gtmId: GTM_ID_PATTERN.test(rawGtm) ? rawGtm : '',
  isDev: import.meta.env.DEV,
} as const

/** Variables que faltan para que el sitio quede 100% operativo. */
export const missingEnv = (): string[] => {
  const missing: string[] = []
  if (!env.siteUrl) missing.push('VITE_SITE_URL')
  if (!env.whatsappNumber) missing.push('VITE_WHATSAPP_NUMBER')
  if (!env.web3formsAccessKey) missing.push('VITE_WEB3FORMS_ACCESS_KEY')
  return missing
}
