import type { LucideIcon } from 'lucide-react'
import {
  CircleAlert,
  CircleCheck,
  Hourglass,
  RotateCcw,
  ServerCrash,
  TimerOff,
  Unplug,
  WifiOff,
  X,
} from 'lucide-react'
import { useEffect, useRef, type MouseEvent } from 'react'
import { trackEvent } from '../../lib/analytics'
import type { InquiryErrorKind } from '../../lib/inquiry'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'

export type SubmitResult = { type: 'success' } | { type: 'error'; kind: InquiryErrorKind }

interface Copy {
  title: string
  message: string
  icon: LucideIcon
  /** Si tiene sentido ofrecer "Reintentar" con los mismos datos. */
  retry: boolean
}

const errorCopy: Record<InquiryErrorKind, Copy> = {
  offline: {
    title: 'Parece que no tenés conexión',
    message: 'Revisá tu conexión a internet y volvé a intentarlo. Tus datos siguen cargados en el formulario.',
    icon: WifiOff,
    retry: true,
  },
  network: {
    title: 'No pudimos conectarnos',
    message:
      'Puede ser una conexión inestable o una extensión del navegador (como un bloqueador de anuncios). Probá de nuevo o escribinos por WhatsApp.',
    icon: Unplug,
    retry: true,
  },
  timeout: {
    title: 'El envío está tardando demasiado',
    message: 'El servicio no respondió a tiempo. Esperá unos segundos y volvé a intentarlo.',
    icon: TimerOff,
    retry: true,
  },
  rate_limit: {
    title: 'Demasiados intentos seguidos',
    message: 'Por seguridad hay que esperar un momento antes de volver a enviar. Probá en un minuto o escribinos por WhatsApp.',
    icon: Hourglass,
    retry: true,
  },
  server: {
    title: 'El servicio de envío no está disponible',
    message: 'Es un problema momentáneo, no de tus datos. Probá en unos minutos o escribinos por WhatsApp.',
    icon: ServerCrash,
    retry: true,
  },
  rejected: {
    title: 'No pudimos enviar tu consulta',
    message: 'El envío fue rechazado. Revisá los datos e intentá de nuevo; si sigue pasando, escribinos por WhatsApp.',
    icon: CircleAlert,
    retry: true,
  },
  not_configured: {
    title: 'El formulario no está disponible',
    message: 'Por el momento no podemos recibir consultas desde acá. Escribinos por WhatsApp y te respondemos.',
    icon: CircleAlert,
    retry: false,
  },
}

const successCopy: Copy = {
  title: '¡Consulta enviada!',
  message: 'Gracias por escribirnos. Ya recibimos tu consulta y te vamos a responder por email con los próximos pasos.',
  icon: CircleCheck,
  retry: false,
}

interface Props {
  result: SubmitResult | null
  /** Link de WhatsApp con el mensaje según la necesidad elegida ('' si no está configurado). */
  whatsappUrl: string
  onClose: () => void
  onRetry: () => void
}

/**
 * Modal con el resultado del envío del formulario. Usa <dialog> nativo:
 * bloquea el fondo, atrapa el foco, cierra con Escape y devuelve el foco al botón de envío.
 */
export function ResultDialog({ result, whatsappUrl, onClose, onRetry }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (result && !dialog.open) dialog.showModal()
    if (!result && dialog.open) dialog.close()
  }, [result])

  // Clic en el fondo oscuro: cierra.
  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  const isSuccess = result?.type === 'success'
  const copy = !result ? null : result.type === 'success' ? successCopy : errorCopy[result.kind]
  const Icon = copy?.icon

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="result-title"
      aria-describedby="result-message"
      onClose={onClose}
      onClick={onBackdropClick}
      className="result-dialog m-auto w-[min(calc(100vw-2rem),30rem)] overflow-visible rounded-3xl bg-transparent p-0 text-ink backdrop:bg-navy-deep/70 backdrop:backdrop-blur-sm"
    >
      {copy && Icon && (
        <div className="relative rounded-3xl bg-surface px-6 pt-14 pb-7 text-center shadow-[0_40px_80px_-30px_rgba(10,30,54,0.6)] sm:px-9 sm:pb-9">
          {/* Ícono grande que "sobresale" del borde superior. */}
          <span
            className={`result-icon absolute -top-10 left-1/2 flex size-20 -translate-x-1/2 items-center justify-center rounded-full border-[6px] border-surface text-white shadow-lg ${
              isSuccess ? 'bg-signal' : 'bg-danger'
            }`}
          >
            <Icon className="size-9" strokeWidth={2.2} aria-hidden="true" />
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-navy"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          <h2 id="result-title" className="text-2xl leading-tight font-semibold tracking-[-0.02em] text-navy sm:text-[1.75rem]">
            {copy.title}
          </h2>
          <p id="result-message" className="mt-3 leading-relaxed text-muted">
            {copy.message}
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {copy.retry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-accent px-6 text-base font-semibold text-white transition-colors hover:bg-accent-strong"
              >
                <RotateCcw className="size-5" aria-hidden="true" />
                Reintentar
              </button>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('whatsapp_click', { location: isSuccess ? 'form_success' : 'form_error' })
                }
                className={`inline-flex h-13 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold transition-colors ${
                  copy.retry
                    ? 'border border-line text-ink hover:border-ink/40 hover:bg-canvas'
                    : 'bg-whatsapp text-white hover:bg-[#16733d]'
                }`}
              >
                <WhatsAppIcon className="size-5" />
                {isSuccess ? '¿Es urgente? Hablar por WhatsApp' : 'Escribir por WhatsApp'}
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-1 text-[15px] font-semibold text-muted underline-offset-4 hover:text-navy hover:underline"
            >
              {isSuccess ? 'Listo' : 'Cerrar'}
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
