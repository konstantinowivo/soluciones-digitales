import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { needs } from '../../data/needs'
import { useContactIntent } from '../../hooks/useContactIntent'
import { trackEvent } from '../../lib/analytics'

/** Avance automático mientras nadie interactúa. Se apaga para siempre al primer toque, clic o foco. */
const AUTOPLAY_MS = 5000
/** Desplazamiento mínimo (px) para que un arrastre cuente como swipe. */
const SWIPE_PX = 40

const total = needs.length

/** Distancia circular de una tarjeta a la activa: 0 = centro, ±1 = costados, el resto queda oculto. */
const offsetFrom = (position: number, active: number): number => {
  let offset = (position - active + total) % total
  if (offset > total / 2) offset -= total
  return offset
}

const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Needs() {
  const { setNeed } = useContactIntent()
  const sectionRef = useRef<HTMLElement>(null)
  const swipeStart = useRef<number | null>(null)
  /** Evita que el clic que sigue a un arrastre active la tarjeta que quedó debajo del puntero. */
  const swiped = useRef(false)
  const [active, setActive] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)

  const goTo = useCallback((target: number) => setActive((target + total) % total), [])
  const next = () => goTo(active + 1)
  const prev = () => goTo(active - 1)
  const stopAutoplay = () => setAutoplay(false)

  // Solo avanza solo cuando la sección está en pantalla.
  useEffect(() => {
    const section = sectionRef.current
    if (!section || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!autoplay || paused || !inView || prefersReducedMotion()) return
    const timer = window.setTimeout(() => goTo(active + 1), AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [autoplay, paused, inView, active, goTo])

  const onPointerDown = (event: PointerEvent) => {
    stopAutoplay()
    swiped.current = false
    swipeStart.current = event.clientX
  }
  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return
    const delta = event.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(delta) < SWIPE_PX) return
    swiped.current = true
    if (delta < 0) next()
    else prev()
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') next()
    else if (event.key === 'ArrowLeft') prev()
  }

  return (
    <section
      ref={sectionRef}
      id="que-necesitas"
      aria-labelledby="needs-title"
      className="overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="container-site">
        {/* Encabezado compacto: el protagonista del bloque son las tarjetas. */}
        <div className="mx-auto max-w-xl text-center">
          <h2
            id="needs-title"
            className="text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.025em] text-navy sm:text-[2.25rem]"
          >
            ¿Qué necesitás resolver?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
            Elegí la situación que más se parece a la tuya y te respondemos con una propuesta concreta.
          </p>
        </div>

        <div
          role="region"
          aria-roledescription="carrusel"
          aria-label="Situaciones que resolvemos. Usá las flechas para cambiar de tarjeta."
          tabIndex={0}
          onKeyDown={onKeyDown}
          onFocus={stopAutoplay}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          // --shift: cuánto se corren las tarjetas laterales (en % de su ancho). Mobile first.
          className="relative mt-8 grid touch-pan-y justify-items-center py-8 [--shift:50%] select-none sm:mt-10 sm:py-12 sm:[--shift:62%] lg:[--shift:68%]"
        >
          {/* Foco de luz detrás de la tarjeta del frente. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 mx-auto h-[85%] max-w-3xl -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--color-accent-soft),transparent)]"
          />
          {needs.map((item, position) => {
            const offset = offsetFrom(position, active)
            const distance = Math.abs(offset)
            const isActive = offset === 0
            const isSide = distance === 1
            const Icon = item.icon
            const style: CSSProperties = {
              gridArea: '1 / 1',
              transform: `translateX(calc(${offset} * var(--shift))) scale(${isActive ? 1 : isSide ? 0.85 : 0.7})`,
              zIndex: 30 - distance * 10,
              // Las laterales se atenúan con una capa encima (ver abajo), no con opacidad: así el texto
              // conserva su contraste real y solo las que quedan fuera de vista se ocultan.
              opacity: distance > 1 ? 0 : 1,
            }
            return (
              <article
                key={item.title}
                aria-roledescription="tarjeta"
                aria-label={`${position + 1} de ${total}: ${item.title}`}
                aria-hidden={isActive ? undefined : true}
                inert={distance > 1}
                onClick={isSide ? () => !swiped.current && goTo(position) : undefined}
                style={style}
                className={`w-[84%] max-w-[23rem] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[60%] sm:max-w-[26rem] lg:w-[40%] lg:max-w-[28rem] ${
                  isSide ? 'cursor-pointer' : ''
                }`}
              >
                <div
                  className={`relative flex h-full flex-col rounded-[var(--radius-card)] border bg-surface p-6 transition-shadow duration-500 sm:p-8 lg:p-9 ${
                    isActive
                      ? 'needs-float border-accent/30 shadow-[0_30px_60px_-28px_rgba(15,42,74,0.45)]'
                      : 'border-line shadow-[0_12px_30px_-24px_rgba(15,42,74,0.35)]'
                  }`}
                >
                  {/* Capa que "empuja hacia atrás" las tarjetas laterales. */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 z-10 rounded-[var(--radius-card)] bg-canvas transition-opacity duration-500 ${
                      isSide ? 'opacity-50' : 'opacity-0'
                    }`}
                  />
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex size-12 items-center justify-center rounded-xl transition-colors duration-500 sm:size-14 sm:rounded-2xl ${
                        isActive ? 'bg-accent text-white' : 'bg-accent-soft text-accent'
                      }`}
                    >
                      <Icon className="size-5 sm:size-6" aria-hidden="true" />
                    </span>
                    <span aria-hidden="true" className="text-[13px] font-semibold text-muted tabular-nums">
                      {String(position + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-6 text-[1.35rem] leading-snug font-semibold tracking-[-0.02em] text-navy sm:mt-8 sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted sm:text-base lg:text-lg">
                    {item.description}
                  </p>
                  <a
                    href="#contacto"
                    tabIndex={isActive ? undefined : -1}
                    onClick={(event) => {
                      // En las tarjetas de atrás, el clic solo las trae al frente.
                      if (!isActive || swiped.current) {
                        event.preventDefault()
                        return
                      }
                      setNeed(item.need)
                      trackEvent('quote_cta_click', { location: 'needs_card', need: item.need })
                    }}
                    className="group/cta mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-white transition-colors hover:bg-accent-strong sm:mt-8 sm:w-fit sm:text-base"
                  >
                    {item.cta}
                    <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-0.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-2 flex items-center justify-center gap-4 sm:gap-5">
          <ArrowButton
            direction="prev"
            onClick={() => {
              stopAutoplay()
              prev()
            }}
          />
          <div className="flex">
            {needs.map((item, dot) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Ver tarjeta ${dot + 1}: ${item.title}`}
                aria-current={dot === active ? 'true' : undefined}
                onClick={() => {
                  stopAutoplay()
                  goTo(dot)
                }}
                className="flex h-11 min-w-7 items-center justify-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    dot === active ? 'w-7 bg-accent' : 'w-1.5 bg-line hover:bg-muted/50'
                  }`}
                />
              </button>
            ))}
          </div>
          <ArrowButton
            direction="next"
            onClick={() => {
              stopAutoplay()
              next()
            }}
          />
        </div>

        {/* Lectores de pantalla: anuncia la tarjeta que pasa al frente. */}
        <p aria-live={autoplay ? 'off' : 'polite'} className="sr-only">
          {`Tarjeta ${active + 1} de ${total}: ${needs[active].title}`}
        </p>
      </div>
    </section>
  )
}

function ArrowButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Tarjeta anterior' : 'Tarjeta siguiente'}
      className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  )
}
