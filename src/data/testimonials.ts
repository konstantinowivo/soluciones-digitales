/**
 * Testimonios reales de clientes. La sección solo se muestra si este array
 * tiene al menos un elemento. No cargar testimonios sin autorización del cliente.
 */
export interface Testimonial {
  quote: string
  author: string
  role?: string
  company?: string
}

export const testimonials: Testimonial[] = []
