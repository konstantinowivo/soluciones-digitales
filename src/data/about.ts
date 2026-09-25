import { CodeXml, Cog, Megaphone, TrendingUp, type LucideIcon } from 'lucide-react'

/** Encabezado de la sección: la idea del cliente, el acompañamiento y la confianza. */
export const approach = {
  title: '¿Tenés una idea? Hablemos y la hacemos realidad',
  intro:
    'Ya sea un proyecto nuevo o el paso de tu empresa a lo digital, te acompañamos en todo el camino: desde la primera charla hasta mucho después del lanzamiento. Vas a tener un contacto directo que conoce tu proyecto de punta a punta.',
  points: [
    {
      title: 'Te escuchamos',
      description:
        'Contanos tu idea o el problema que querés resolver, aunque todavía no sepas qué solución necesitás. Lo definimos juntos.',
    },
    {
      title: 'La hacemos realidad',
      description:
        'Diseñamos y desarrollamos la solución a medida, con avances que podés ver y opinar en cada etapa.',
    },
    {
      title: 'Seguimos a tu lado',
      description:
        'Después de publicar seguimos acompañándote con soporte, mejoras y nuevas funcionalidades a medida que tu negocio crece.',
    },
  ],
}

/** Bloque "¿Quiénes somos?". Editá los párrafos y las disciplinas libremente. */
export const team = {
  title: '¿Quiénes somos?',
  paragraphs: [
    'Somos un equipo multidisciplinario de desarrolladores, ingenieros, comunicadores y licenciados en marketing. Nos une un mismo objetivo: ayudar a las empresas a trabajar mejor, perfeccionando sus procesos y sumando valor real a través de la tecnología.',
    'Esa combinación es nuestra diferencia: no solo construimos la herramienta, también pensamos cómo la va a usar tu equipo, cómo la van a encontrar tus clientes y cómo ayuda a que tu negocio crezca.',
  ],
  disciplines: [
    { title: 'Desarrollo', description: 'Sitios, tiendas y sistemas a medida.', icon: CodeXml },
    { title: 'Ingeniería', description: 'Procesos, datos e integraciones.', icon: Cog },
    { title: 'Comunicación', description: 'Mensajes claros para tus clientes.', icon: Megaphone },
    { title: 'Marketing', description: 'Estrategia para atraer y vender más.', icon: TrendingUp },
  ] satisfies { title: string; description: string; icon: LucideIcon }[],
}
