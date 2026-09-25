import {
  siDocker,
  siFirebase,
  siGooglecloud,
  siGoogleanalytics,
  siHubspot,
  siMercadopago,
  siMongodb,
  siMysql,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siNuxt,
  siPostgresql,
  siReact,
  siSanity,
  siShopify,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVuedotjs,
  siWhatsapp,
  siWoocommerce,
  siWordpress,
  siZapier,
  type SimpleIcon,
} from 'simple-icons'
import awsLogo from '../assets/logos/aws.svg'
import salesforceLogo from '../assets/logos/salesforce.svg'
import tiendanubeLogo from '../assets/logos/tiendanube.svg'

/**
 * Tecnologías de la sección "Tecnología que se adapta al proyecto", agrupadas por sector.
 * Logos oficiales con su color de marca:
 * - `icon`: de simple-icons (https://simpleicons.org).
 * - `src`: SVG propio en src/assets/logos/, para marcas que no están en simple-icons
 *   (AWS y Salesforce vienen de devicon; Tiendanube, de su sitio oficial).
 * Para agregar una: sumala al grupo que corresponda. Mostrá solo tecnologías que usás de verdad.
 */
export type Technology = { name: string } & ({ icon: SimpleIcon } | { src: string })

export interface TechGroup {
  label: string
  description: string
  items: Technology[]
}

export const techGroups: TechGroup[] = [
  {
    label: 'Desarrollo web',
    description: 'Sitios y aplicaciones rápidas, modernas y fáciles de mantener.',
    items: [
      { name: 'React', icon: siReact },
      { name: 'Next.js', icon: siNextdotjs },
      { name: 'Vue', icon: siVuedotjs },
      { name: 'Nuxt', icon: siNuxt },
      { name: 'TypeScript', icon: siTypescript },
      { name: 'Node.js', icon: siNodedotjs },
      { name: 'Tailwind CSS', icon: siTailwindcss },
    ],
  },
  {
    label: 'Datos e infraestructura',
    description: 'Bases de datos y servidores en la nube, seguros y escalables.',
    items: [
      { name: 'PostgreSQL', icon: siPostgresql },
      { name: 'MongoDB', icon: siMongodb },
      { name: 'MySQL', icon: siMysql },
      { name: 'Docker', icon: siDocker },
      { name: 'AWS', src: awsLogo },
      { name: 'Google Cloud', icon: siGooglecloud },
      { name: 'Vercel', icon: siVercel },
      { name: 'Firebase', icon: siFirebase },
    ],
  },
  {
    label: 'E-commerce y contenidos',
    description: 'Tiendas online, cobros y contenidos que podés administrar vos.',
    items: [
      { name: 'Tiendanube', src: tiendanubeLogo },
      { name: 'Shopify', icon: siShopify },
      { name: 'WooCommerce', icon: siWoocommerce },
      { name: 'WordPress', icon: siWordpress },
      { name: 'Mercado Pago', icon: siMercadopago },
      { name: 'Sanity', icon: siSanity },
    ],
  },
  {
    label: 'CRM, integraciones y automatización',
    description: 'Conectamos las herramientas que tu negocio ya usa.',
    items: [
      { name: 'Salesforce', src: salesforceLogo },
      { name: 'HubSpot', icon: siHubspot },
      { name: 'WhatsApp', icon: siWhatsapp },
      { name: 'n8n', icon: siN8n },
      { name: 'Zapier', icon: siZapier },
      { name: 'Google Analytics', icon: siGoogleanalytics },
    ],
  },
]
