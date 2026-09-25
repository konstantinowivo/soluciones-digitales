import { Check, LayoutDashboard, Mail, ShoppingBag } from 'lucide-react'
import type { ReactNode } from 'react'
import { site } from '../../config/site'
import { trackEvent } from '../../lib/analytics'
import { ButtonLink } from '../ui/ButtonLink'
import { QuoteLink } from '../ui/QuoteLink'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="bg-surface pt-16">
      <div className="container-site grid grid-cols-[minmax(0,1fr)] items-center gap-14 pt-14 pb-20 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pt-24 lg:pb-28">
        <div>
          <p className="text-[15px] font-semibold text-accent">{site.heroEyebrow}</p>
          <h1
            id="hero-title"
            className="mt-4 text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.035em] text-navy sm:text-[3.4rem] lg:text-[4.1rem]"
          >
            {site.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            {site.heroSubtitle}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <QuoteLink location="hero" size="lg" />
            <ButtonLink
              href="#servicios"
              variant="secondary"
              size="lg"
              onClick={() => trackEvent('view_services_click', { location: 'hero' })}
            >
              Ver servicios
            </ButtonLink>
          </div>
        </div>

        <OperationsBoard />
      </div>
    </section>
  )
}

/**
 * Ilustración: cómo se conectan las piezas digitales de un negocio.
 * Es decorativa (aria-hidden) y no muestra datos ni métricas reales.
 */
function OperationsBoard() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[560px] select-none lg:mr-0">
      <div className="rounded-[20px] border border-line bg-canvas p-3 shadow-[0_30px_60px_-30px_rgba(15,42,74,0.35)] sm:p-4">
        <div className="rounded-[14px] border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
            <span className="text-[13px] font-semibold text-navy">Panel de gestión</span>
            <span className="flex items-center gap-1.5 text-[12px] text-signal">
              <span className="live-dot size-1.5 rounded-full bg-signal" />
              Todo conectado
            </span>
          </div>

          {/* Flujo: canal de venta → sistema → comunicación */}
          <div className="flex items-center px-4 pt-6 pb-5 sm:px-5">
            <FlowNode icon={<ShoppingBag className="size-4" />} label="Tienda online" />
            <Connector />
            <FlowNode icon={<LayoutDashboard className="size-4" />} label="Sistema" strong />
            <Connector />
            <FlowNode
              icon={
                <span className="flex gap-1">
                  <WhatsAppIcon className="size-4" />
                  <Mail className="size-4" />
                </span>
              }
              label="Avisos"
            />
          </div>

          <div className="grid gap-3 border-t border-line p-4 sm:grid-cols-[1.3fr_1fr] sm:p-5">
            <div className="rounded-xl border border-line p-3.5">
              <p className="text-[12px] font-medium text-muted">Pedidos</p>
              <ul className="mt-2.5 space-y-2">
                {[
                  { id: '#1042', state: 'Preparando', tone: 'bg-accent-soft text-accent-strong' },
                  { id: '#1041', state: 'Enviado', tone: 'bg-canvas text-ink' },
                  { id: '#1040', state: 'Entregado', tone: 'bg-signal-soft text-signal' },
                ].map((order) => (
                  <li key={order.id} className="flex items-center justify-between text-[13px]">
                    <span className="font-medium text-ink tabular-nums">{order.id}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11.5px] font-medium ${order.tone}`}>
                      {order.state}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden rounded-xl border border-line p-3.5 sm:block">
              <p className="text-[12px] font-medium text-muted">Consultas por canal</p>
              <div className="mt-3 flex h-[74px] items-end gap-2.5">
                {[
                  { label: 'Web', h: '62%' },
                  { label: 'WhatsApp', h: '92%' },
                  { label: 'Email', h: '40%' },
                ].map((bar) => (
                  <div key={bar.label} className="flex h-full flex-1 flex-col justify-end gap-1.5">
                    <div className="rounded-sm bg-navy/85" style={{ height: bar.h }} />
                    <span className="truncate text-center text-[10.5px] text-muted">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-5 left-4 flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-2.5 shadow-[0_12px_30px_-12px_rgba(15,42,74,0.35)] sm:-left-6">
        <span className="flex size-7 items-center justify-center rounded-full bg-signal text-white">
          <Check className="size-4" strokeWidth={2.6} />
        </span>
        <span className="text-[13px] leading-tight">
          <span className="block font-semibold text-navy">Nueva consulta registrada</span>
          <span className="text-muted">Formulario web al sistema</span>
        </span>
      </div>
    </div>
  )
}

function FlowNode({ icon, label, strong = false }: { icon: ReactNode; label: string; strong?: boolean }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <span
        className={`flex size-11 items-center justify-center rounded-xl sm:size-12 ${
          strong ? 'bg-navy text-white' : 'border border-line bg-canvas text-navy'
        }`}
      >
        {icon}
      </span>
      <span className="text-[12px] font-medium text-ink">{label}</span>
    </div>
  )
}

function Connector() {
  return (
    <svg viewBox="0 0 120 8" preserveAspectRatio="none" className="mb-6 h-2 min-w-4 flex-1">
      <line x1="2" y1="4" x2="118" y2="4" stroke="#b9c3d2" strokeWidth="1.5" strokeDasharray="3 4" />
      <line className="flow-line" x1="2" y1="4" x2="118" y2="4" stroke="#1d5bd6" strokeWidth="2" />
    </svg>
  )
}
