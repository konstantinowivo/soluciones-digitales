/**
 * Rutas indexables del sitio. Lo usa vite.config.ts para generar sitemap.xml.
 *
 * Para publicar una landing SEO nueva (ej. /desarrollo-web):
 *   1. Crear la página (ver README → "Landing pages por servicio").
 *   2. Cambiar `published` a true acá.
 * Mientras `published` sea false, la ruta no aparece en el sitemap.
 */
export interface SiteRoute {
  path: string
  published: boolean
  priority: number
  changefreq: 'weekly' | 'monthly' | 'yearly'
}

export const routes: SiteRoute[] = [
  { path: '/', published: true, priority: 1.0, changefreq: 'monthly' },
  { path: '/privacidad', published: true, priority: 0.2, changefreq: 'yearly' },
  { path: '/desarrollo-web', published: false, priority: 0.8, changefreq: 'monthly' },
  { path: '/ecommerce', published: false, priority: 0.8, changefreq: 'monthly' },
  { path: '/sistemas-a-medida', published: false, priority: 0.8, changefreq: 'monthly' },
  { path: '/automatizacion', published: false, priority: 0.8, changefreq: 'monthly' },
  { path: '/integraciones', published: false, priority: 0.8, changefreq: 'monthly' },
]
