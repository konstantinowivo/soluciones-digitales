import type { ReactNode } from 'react'
import { useContactIntent } from '../../hooks/useContactIntent'
import { DEFAULT_WHATSAPP_MESSAGE, whatsappMessageByNeed } from '../../data/contact'
import { trackEvent } from '../../lib/analytics'
import { buildWhatsAppUrl } from '../../lib/whatsapp'
import { ButtonLink } from './ButtonLink'
import { WhatsAppIcon } from './WhatsAppIcon'

interface Props {
  /** Dónde está el botón (para analytics). */
  location: string
  variant?: 'whatsapp' | 'secondary' | 'ghost-light'
  size?: 'md' | 'lg'
  className?: string
  children?: ReactNode
}

/** CTA "Hablar por WhatsApp". No se renderiza si VITE_WHATSAPP_NUMBER no está configurado. */
export function WhatsAppLink({ location, variant = 'whatsapp', size = 'md', className, children }: Props) {
  const { need } = useContactIntent()
  const message = need ? whatsappMessageByNeed[need] : DEFAULT_WHATSAPP_MESSAGE
  const href = buildWhatsAppUrl(message)
  if (!href) return null

  return (
    <ButtonLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      size={size}
      className={className}
      onClick={() => trackEvent('whatsapp_click', { location, need: need || undefined })}
    >
      <WhatsAppIcon className="size-5" />
      {children ?? 'Hablar por WhatsApp'}
    </ButtonLink>
  )
}
