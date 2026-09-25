/**
 * Preguntas frecuentes. Responden las objeciones típicas antes de pedir presupuesto
 * y se publican como datos estructurados FAQPage (vite.config.ts) para Google.
 * Texto plano: sin HTML ni markdown.
 */
export interface Faq {
  question: string
  answer: string
}

export const faqs: Faq[] = [
  {
    question: '¿Cuánto cuesta un sitio web o un sistema?',
    answer:
      'Depende del alcance: no cuesta lo mismo un sitio institucional que una tienda online o un sistema de gestión. Por eso primero entendemos qué necesitás y después te enviamos un presupuesto cerrado, con el detalle de lo que incluye, antes de empezar.',
  },
  {
    question: '¿Cuánto tiempo lleva el desarrollo?',
    answer:
      'El plazo se define en la propuesta según las funcionalidades. Trabajamos por etapas, así que vas viendo avances durante todo el proceso y no solo al final.',
  },
  {
    question: '¿Voy a poder actualizar el contenido yo mismo?',
    answer:
      'Sí, si lo necesitás. Podemos sumar un panel para que edites textos, productos o imágenes sin depender de nadie. Lo definimos juntos en la propuesta.',
  },
  {
    question: '¿Se encargan del dominio y el hosting?',
    answer:
      'Te ayudamos a registrar el dominio y a elegir el hosting adecuado, y dejamos todo configurado y publicado. El dominio y las cuentas quedan a tu nombre.',
  },
  {
    question: '¿El sitio va a aparecer en Google?',
    answer:
      'Cada sitio se entrega optimizado para buscadores: rápido, adaptado a celulares, con títulos, descripciones y datos estructurados, y dado de alta en Google Search Console.',
  },
  {
    question: '¿Qué pasa después de que se publica?',
    answer:
      'Podemos seguir con mantenimiento, soporte y nuevas funcionalidades a medida que el negocio crece. Si ya tenés un sitio o sistema hecho por otra persona, también podemos hacernos cargo.',
  },
  {
    question: '¿Trabajan con clientes fuera de Córdoba?',
    answer:
      'Sí. Trabajamos con empresas de todo el país y de forma remota: las reuniones son por videollamada y el seguimiento por WhatsApp o email.',
  },
]
