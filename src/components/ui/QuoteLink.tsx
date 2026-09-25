import type { ReactNode } from 'react'
import type { NeedValue } from '../../data/contact'
import { useContactIntent } from '../../hooks/useContactIntent'
import { trackEvent } from '../../lib/analytics'
import { ButtonLink } from './ButtonLink'

interface Props {
  location: string
  need?: NeedValue
  variant?: 'primary' | 'secondary' | 'light' | 'ghost-light'
  size?: 'md' | 'lg'
  className?: string
  children?: ReactNode
  /** Acción extra al hacer clic (ej. cerrar el menú mobile). */
  onNavigate?: () => void
}

/** CTA "Solicitar presupuesto": lleva al formulario y, si corresponde, preselecciona la necesidad. */
export function QuoteLink({
  location,
  need,
  variant = 'primary',
  size = 'md',
  className,
  children,
  onNavigate,
}: Props) {
  const { setNeed } = useContactIntent()
  return (
    <ButtonLink
      href="#contacto"
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        if (need) setNeed(need)
        trackEvent('quote_cta_click', { location, need })
        onNavigate?.()
      }}
    >
      {children ?? 'Solicitar presupuesto'}
    </ButtonLink>
  )
}
