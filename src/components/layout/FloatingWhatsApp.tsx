import { useContactIntent } from '../../hooks/useContactIntent'
import { DEFAULT_WHATSAPP_MESSAGE, whatsappMessageByNeed } from '../../data/contact'
import { trackEvent } from '../../lib/analytics'
import { buildWhatsAppUrl } from '../../lib/whatsapp'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'

/** Botón flotante de WhatsApp. El mensaje se adapta a la necesidad elegida en el sitio. */
export function FloatingWhatsApp() {
  const { need } = useContactIntent()
  const href = buildWhatsAppUrl(need ? whatsappMessageByNeed[need] : DEFAULT_WHATSAPP_MESSAGE)
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp (se abre en una pestaña nueva)"
      onClick={() => trackEvent('whatsapp_click', { location: 'floating_button', need: need || undefined })}
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex h-14 items-center gap-2 rounded-full bg-whatsapp pr-5 pl-4 text-white shadow-[0_8px_24px_-6px_rgba(12,60,32,0.45)] transition-colors hover:bg-[#16733d] sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-7" />
      <span className="hidden text-[15px] font-semibold sm:inline">WhatsApp</span>
    </a>
  )
}
