import { readFileSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { routes } from './src/config/routes.ts'
import { site } from './src/config/site.ts'
import { faqs } from './src/data/faq.ts'

interface SeoEnv {
  siteUrl: string
  whatsappNumber: string
  contactEmail: string
}

/**
 * Datos estructurados para Google: negocio local (con teléfono y email si están
 * configurados), sitio web y preguntas frecuentes (rich result de FAQ).
 */
function buildJsonLd({ siteUrl, whatsappNumber, contactEmail }: SeoEnv): string {
  const url = `${siteUrl}/`
  const business = {
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}/#negocio`,
    name: site.brand,
    description:
      'Diseño y desarrollo de sitios web, tiendas online, sistemas web, integraciones y automatización de procesos para empresas y negocios.',
    url,
    image: `${siteUrl}/og-image.png`,
    logo: `${siteUrl}/icon-512.png`,
    ...(whatsappNumber && { telephone: `+${whatsappNumber}` }),
    ...(contactEmail && { email: contactEmail }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Córdoba',
      addressRegion: 'Córdoba',
      addressCountry: 'AR',
    },
    areaServed: [
      { '@type': 'City', name: 'Córdoba' },
      { '@type': 'Country', name: 'Argentina' },
    ],
    serviceType: ['Desarrollo web', 'Diseño web', 'E-commerce', 'Sistemas web', 'Integraciones', 'Automatización'],
  }
  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#sitio`,
    url,
    name: site.brand,
    inLanguage: 'es-AR',
    publisher: { '@id': `${siteUrl}/#negocio` },
  }
  const faqPage = {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
  const graph = { '@context': 'https://schema.org', '@graph': [business, website, faqPage] }
  // `<` escapado para que ningún texto pueda cerrar el <script>.
  const json = JSON.stringify(graph, null, 2).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">\n${json}\n</script>`
}

/** Política de privacidad estática (legal/privacidad.html) con la URL y el email del sitio. */
function buildPrivacyPage({ siteUrl, contactEmail }: SeoEnv): string {
  const template = readFileSync(new URL('./legal/privacidad.html', import.meta.url), 'utf8')
  const contact = contactEmail
    ? `, escribiendo a <a href="mailto:${contactEmail}">${contactEmail}</a>.`
    : ', a través del formulario de contacto del sitio.'
  return template.replaceAll('__SITE_URL__', siteUrl).replace('__CONTACT_SENTENCE__', contact)
}

/**
 * SEO en el build: inyecta la URL del sitio y el JSON-LD en index.html,
 * y genera robots.txt, sitemap.xml y /privacidad a partir de las variables VITE_.
 */
function seoPlugin(seo: SeoEnv): Plugin {
  const base = seo.siteUrl
  const absolute = (path: string) => (base ? `${base}${path}` : path)

  return {
    name: 'seo-files',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', base).replace('<!--__JSON_LD__-->', buildJsonLd(seo))
    },
    configureServer(server) {
      // En desarrollo, /privacidad se sirve igual que en producción.
      server.middlewares.use('/privacidad', (_req, res) => {
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(buildPrivacyPage(seo))
      })
    },
    generateBundle() {
      if (!base) {
        this.warn(
          'VITE_SITE_URL no está definida: sitemap.xml se omite y canonical/Open Graph quedan con rutas relativas.',
        )
      }

      this.emitFile({ type: 'asset', fileName: 'privacidad.html', source: buildPrivacyPage(seo) })

      const robots = ['User-agent: *', 'Allow: /', base ? `\nSitemap: ${base}/sitemap.xml` : '']
        .join('\n')
        .trim()
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots}\n` })

      if (base) {
        const today = new Date().toISOString().slice(0, 10)
        const urls = routes
          .filter((route) => route.published)
          .map(
            (route) =>
              `  <url>\n    <loc>${absolute(route.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority.toFixed(1)}</priority>\n  </url>`,
          )
          .join('\n')
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      }
    },
  }
}

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const email = (env.VITE_CONTACT_EMAIL ?? '').trim()
  const whatsapp = (env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')
  const seo: SeoEnv = {
    siteUrl: (env.VITE_SITE_URL ?? '').trim().replace(/\/+$/, ''),
    // Mismos criterios que src/config/env.ts.
    whatsappNumber: whatsapp.length >= 8 ? whatsapp : '',
    contactEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '',
  }
  return {
    // El build SSR (solo para el prerender) no necesita generar los archivos SEO.
    plugins: [react(), tailwindcss(), ...(isSsrBuild ? [] : [seoPlugin(seo)])],
    build: {
      target: 'es2020',
      cssMinify: true,
    },
  }
})
