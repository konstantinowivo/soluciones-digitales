/** Normaliza texto de formularios: quita caracteres de control, espacios extremos y limita largo. */
export const sanitizeText = (value: string, maxLength: number): string =>
  value
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength)

export const sanitizeSingleLine = (value: string, maxLength: number): string =>
  sanitizeText(value.replace(/\s+/g, ' '), maxLength)
