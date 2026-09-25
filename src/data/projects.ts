/**
 * Proyectos reales. Para agregar uno, sumá un objeto al array (ver README).
 *
 * - url: dejala vacía ('') hasta tener la URL pública. Sin URL no se muestra
 *   el botón "Ver proyecto".
 * - image: ruta a una captura en /public/projects/ (ej. '/projects/aghr.webp').
 *   Si no hay imagen, se muestra una vista genérica con el nombre del proyecto.
 * - status: 'en-desarrollo' muestra la etiqueta "En desarrollo".
 * - accent: color de la vista genérica cuando no hay captura.
 */
export interface Project {
  id: string
  name: string
  summary: string
  description?: string
  technologies: string[]
  url: string
  image?: string
  status: 'publicado' | 'en-desarrollo'
  accent: string
}

export const projects: Project[] = [
  {
    id: 'chevromax',
    name: 'Chevromax',
    summary: 'Sistema web para una red de concesionarias.',
    description:
      'Plataforma web integrada con herramientas de gestión para administrar información de productos, clientes y vehículos.',
    technologies: ['Vue', 'Nuxt', 'Node.js', 'Express'],
    url: '',
    status: 'publicado',
    accent: '#1D4E89',
  },
  {
    id: 'aghr',
    name: 'AGHR',
    summary: 'Plataforma digital para servicios de Recursos Humanos y mentoring.',
    description:
      'Sitio web y plataforma de gestión de contenidos orientada a servicios de Recursos Humanos.',
    technologies: ['Vue', 'Nuxt', 'Node.js', 'PostgreSQL'],
    url: '',
    status: 'publicado',
    accent: '#3B4A6B',
  },
  {
    id: 'noble-matafuegos',
    name: 'Noble Matafuegos',
    summary: 'Sitio web comercial para empresa especializada en seguridad contra incendios.',
    technologies: ['Vue', 'Nuxt', 'Vuetify'],
    url: '',
    status: 'publicado',
    accent: '#8A2E2A',
  },
  {
    id: 'hilos-de-luz',
    name: 'Hilos de Luz',
    summary: 'Catálogo digital para emprendimiento de iluminación artesanal.',
    technologies: ['React', 'Vite', 'Sanity'],
    url: '',
    status: 'publicado',
    accent: '#8C6A2F',
  },
  {
    id: 'ctis',
    name: 'CTIS',
    summary: 'Sitio web para clínica médica y servicios de salud y bienestar.',
    technologies: [],
    url: '',
    status: 'en-desarrollo',
    accent: '#1E6B64',
  },
]
