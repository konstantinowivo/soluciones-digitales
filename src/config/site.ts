/**
 * Identidad del sitio. Cambiá acá nombre, marca y textos institucionales;
 * navbar, footer, contacto y SEO leen de este archivo.
 */
export const site = {
  brand: 'Soluciones Digitales',
  /** Bajada del logo y de la ficha de contacto. */
  tagline: 'Desarrollo web y software a medida',
  shortDescription:
    'Sitios web, tiendas online, sistemas y herramientas digitales a medida para empresas, comercios y profesionales.',
  location: 'Córdoba, Argentina',
  coverage: 'Argentina y clientes remotos',
  /** Hero: la línea superior y el H1 llevan las palabras clave que busca el cliente (SEO local). */
  heroEyebrow: 'Desarrollo a medida',
  heroTitle: 'Soluciones digitales para tu negocio',
  heroSubtitle:
    'Sitios web, tiendas online, sistemas y automatizaciones desarrollados a medida para vender más, ordenar la gestión y ahorrar tiempo.',
  copyrightYear: 2026,
} as const

/**
 * Secciones de la home, en el orden en que aparecen. El id es el ancla (#id) que usa la navegación.
 * "Inicio" no va en el menú: el logo ya lleva arriba de todo.
 */
export const navItems = [
  { id: 'servicios', label: 'Servicios' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'como-trabajamos', label: 'Cómo trabajamos' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'preguntas', label: 'Preguntas' },
  { id: 'contacto', label: 'Contacto' },
] as const

export type SectionId = (typeof navItems)[number]['id']
