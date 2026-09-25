import type { NeedValue } from './contact'

/**
 * Servicios. `slug` reserva la URL de la futura landing SEO de cada servicio
 * (ver src/config/routes.ts). Para modificar un servicio, editá este array.
 */
export interface Service {
  title: string
  description: string
  need: NeedValue
  slug?: string
}

export const services: Service[] = [
  {
    title: 'Desarrollo web',
    description:
      'Sitios institucionales, landing pages y sitios comerciales rápidos, responsive y optimizados.',
    need: 'sitio-web',
    slug: 'desarrollo-web',
  },
  {
    title: 'E-commerce',
    description: 'Tiendas online, catálogos, gestión de productos, pedidos y medios de pago.',
    need: 'ecommerce',
    slug: 'ecommerce',
  },
  {
    title: 'Sistemas web',
    description: 'Aplicaciones y sistemas internos desarrollados específicamente para cada negocio.',
    need: 'sistema-web',
    slug: 'sistemas-a-medida',
  },
  {
    title: 'Integraciones',
    description: 'Conexión entre APIs, CRM, formularios, sistemas externos y plataformas.',
    need: 'integracion',
    slug: 'integraciones',
  },
  {
    title: 'Automatización',
    description: 'Digitalización y automatización de procesos repetitivos.',
    need: 'automatizacion',
    slug: 'automatizacion',
  },
  {
    title: 'Mantenimiento y evolución',
    description: 'Soporte, mejoras, nuevas funcionalidades y evolución de sistemas existentes.',
    need: 'mantenimiento',
  },
]
