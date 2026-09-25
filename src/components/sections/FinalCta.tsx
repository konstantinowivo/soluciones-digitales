import { QuoteLink } from '../ui/QuoteLink'
import { WhatsAppLink } from '../ui/WhatsAppLink'

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="bg-navy">
      <div className="container-site grid gap-10 py-20 sm:py-24 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <h2
            id="final-cta-title"
            className="text-[2rem] leading-[1.1] font-semibold tracking-[-0.025em] text-white sm:text-[2.6rem]"
          >
            Demos el primer paso juntos
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            Contanos qué necesitás y analizamos juntos qué solución puede tener sentido para tu negocio.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <QuoteLink location="final_cta" size="lg" variant="light">
            Quiero consultar mi proyecto
          </QuoteLink>
          <WhatsAppLink location="final_cta" variant="ghost-light" size="lg" />
        </div>
      </div>
    </section>
  )
}
