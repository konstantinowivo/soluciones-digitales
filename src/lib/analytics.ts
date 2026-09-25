import { env } from '../config/env'

/**
 * Analytics opcional (GA4 y/o Google Tag Manager).
 * - Sin VITE_GA_ID ni VITE_GTM_ID no se carga ningún script y trackEvent no falla.
 * - Los eventos se envían a dataLayer (para disparadores de GTM) y a gtag (GA4 directo).
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export type ConversionEvent =
  | 'whatsapp_click'
  | 'generate_lead'
  | 'quote_cta_click'
  | 'view_services_click'
  | 'form_start'
  | 'form_error'
  | 'email_click'

type EventParams = Record<string, string | number | boolean | undefined>

let initialized = false

const injectScript = (src: string): void => {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

const loadTags = (): void => {
  window.dataLayer = window.dataLayer ?? []

  if (env.gtmId) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    injectScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(env.gtmId)}`)
  }

  if (env.gaId) {
    // gtag necesita recibir el objeto `arguments`, no un array.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', env.gaId)
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(env.gaId)}`)
  }
}

export const initAnalytics = (): void => {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  if (!env.gaId && !env.gtmId) return

  // Se carga después del primer render para no competir con el contenido.
  const schedule = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500))
  if (document.readyState === 'complete') schedule(loadTags)
  else window.addEventListener('load', () => schedule(loadTags), { once: true })
}

export const trackEvent = (name: ConversionEvent, params: EventParams = {}): void => {
  if (typeof window === 'undefined') return

  if (env.gtmId) {
    window.dataLayer = window.dataLayer ?? []
    window.dataLayer.push({ event: name, ...params })
  }
  if (env.gaId && window.gtag) {
    window.gtag('event', name, params)
  }
  if (env.isDev) {
    console.debug('[analytics]', name, params)
  }
}
