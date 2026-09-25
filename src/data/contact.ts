/**
 * Opciones del formulario "¿Qué necesitás?" y mensajes de WhatsApp asociados.
 * Datos de contacto reales (número, email): ver .env → VITE_WHATSAPP_NUMBER / VITE_CONTACT_EMAIL.
 */

export const needOptions = [
  { value: 'sitio-web', label: 'Sitio web' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'sistema-web', label: 'Sistema web' },
  { value: 'automatizacion', label: 'Automatización' },
  { value: 'integracion', label: 'Integración' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'asesoramiento', label: 'No estoy seguro / quiero asesoramiento' },
] as const

export type NeedValue = (typeof needOptions)[number]['value']

export const needLabel = (value: NeedValue): string =>
  needOptions.find((option) => option.value === value)?.label ?? value

export const DEFAULT_WHATSAPP_MESSAGE =
  'Hola, quiero consultar por una solución digital para mi negocio.'

/** Mensaje inicial de WhatsApp según la necesidad que eligió el visitante. */
export const whatsappMessageByNeed: Record<NeedValue, string> = {
  'sitio-web': 'Hola, quiero consultar por el desarrollo de un sitio web para mi negocio.',
  ecommerce: 'Hola, quiero consultar por el desarrollo de un e-commerce.',
  'sistema-web': 'Hola, quiero consultar por el desarrollo de un sistema web a medida.',
  automatizacion: 'Hola, quiero consultar por la digitalización o automatización de un proceso.',
  integracion: 'Hola, quiero consultar por una integración entre herramientas.',
  mantenimiento: 'Hola, quiero consultar por mantenimiento y mejoras de un sitio o sistema.',
  asesoramiento: DEFAULT_WHATSAPP_MESSAGE,
}
