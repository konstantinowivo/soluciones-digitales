import { ChevronDown } from 'lucide-react'
import { faqs } from '../../data/faq'
import { QuoteLink } from '../ui/QuoteLink'
import { SectionHeading } from '../ui/SectionHeading'
import { WhatsAppLink } from '../ui/WhatsAppLink'

/** Preguntas frecuentes con <details>: funciona sin JavaScript y el texto queda en el HTML para Google. */
export function Faq() {
  return (
    <section id="preguntas" aria-labelledby="faq-title" className="section-pad">
      <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="faq-title"
            title="Preguntas frecuentes"
            intro="Lo que más nos consultan antes de empezar un proyecto. Si tu duda no está acá, escribinos."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <QuoteLink location="faq" />
            <WhatsAppLink location="faq" variant="secondary" />
          </div>
        </div>

        <div className="border-t border-line">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-lg font-semibold tracking-[-0.01em] text-navy [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <ChevronDown
                  className="mt-1 size-5 shrink-0 text-muted transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="-mt-2 pb-6 leading-relaxed text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
