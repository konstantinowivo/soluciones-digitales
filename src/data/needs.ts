import type { LucideIcon } from 'lucide-react'
import { Cable, ClipboardList, Globe, LayoutDashboard, ShoppingBag, Wrench } from 'lucide-react'
import type { NeedValue } from './contact'

/** Tarjetas de la sección "¿Qué necesitás resolver?". */
export interface Need {
  title: string
  description: string
  cta: string
  /** Opción que queda preseleccionada en el formulario al hacer clic. */
  need: NeedValue
  icon: LucideIcon
}

export const needs: Need[] = [
  {
    title: 'Necesito presencia online',
    description: 'Sitio web profesional para mostrar mi empresa, servicios y medios de contacto.',
    cta: 'Quiero una web',
    need: 'sitio-web',
    icon: Globe,
  },
  {
    title: 'Quiero vender por Internet',
    description: 'Tienda online con catálogo, productos, pagos y gestión de pedidos.',
    cta: 'Quiero vender online',
    need: 'ecommerce',
    icon: ShoppingBag,
  },
  {
    title: 'Tengo procesos manuales',
    description:
      'Planillas, formularios en papel o tareas repetitivas que se pueden digitalizar y automatizar para ahorrar tiempo.',
    cta: 'Automatizar mi proceso',
    need: 'automatizacion',
    icon: ClipboardList,
  },
  {
    title: 'Necesito un sistema propio',
    description:
      'Desarrollo de aplicaciones web adaptadas a las necesidades específicas de la empresa.',
    cta: 'Consultar sistema',
    need: 'sistema-web',
    icon: LayoutDashboard,
  },
  {
    title: 'Necesito conectar herramientas',
    description:
      'Integraciones entre sistemas, APIs, CRM, formularios, plataformas y servicios externos.',
    cta: 'Consultar integración',
    need: 'integracion',
    icon: Cable,
  },
  {
    title: 'Ya tengo un sitio o sistema',
    description:
      'Mantenimiento, mejoras, nuevas funcionalidades o hacernos cargo de un desarrollo existente.',
    cta: 'Mejorar lo que tengo',
    need: 'mantenimiento',
    icon: Wrench,
  },
]
