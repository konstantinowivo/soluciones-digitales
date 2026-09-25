/**
 * Único punto de lectura de variables de entorno.
 * Ningún componente debe leer import.meta.env directamente.
 */

const clean = (value: string | undefined): string => (value ?? '').trim()

const digitsOnly = (value: string): string => value.replace(/\D/g, '')

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/i
const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/i
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const rawWhatsApp = digitsOnly(clean(import.meta.env.VITE_WHATSAPP_NUMBER))
const rawEmail = clean(import.meta.env.VITE_CONTACT_EMAIL)
const rawGa = clean(import.meta.env.VITE_GA_ID)
const rawGtm = clean(import.meta.env.VITE_GTM_ID)

export const env = {
  siteUrl: clean(import.meta.env.VITE_SITE_URL).replace(/\/+$/, ''),
  /** Solo dígitos, listo para https://wa.me/<numero>. Vacío si no está configurado. */
  whatsappNumber: rawWhatsApp.length >= 8 ? rawWhatsApp : '',
  contactEmail: EMAIL_PATTERN.test(rawEmail) ? rawEmail : '',
  web3formsAccessKey: clean(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY),
  gaId: GA_ID_PATTERN.test(rawGa) ? rawGa : '',
  gtmId: GTM_ID_PATTERN.test(rawGtm) ? rawGtm : '',
  isDev: import.meta.env.DEV,
} as const

/** Variables que faltan para que el sitio quede 100% operativo. */
export const missingEnv = (): string[] => {
  const missing: string[] = []
  if (!env.siteUrl) missing.push('VITE_SITE_URL')
  if (!env.whatsappNumber) missing.push('VITE_WHATSAPP_NUMBER')
  if (!env.contactEmail) missing.push('VITE_CONTACT_EMAIL')
  if (!env.web3formsAccessKey) missing.push('VITE_WEB3FORMS_ACCESS_KEY')
  return missing
}
