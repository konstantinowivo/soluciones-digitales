import { testimonials } from '../../data/testimonials'
import { SectionHeading } from '../ui/SectionHeading'

/** Solo se renderiza cuando hay testimonios reales cargados en data/testimonials.ts. */
export function Testimonials() {
  if (testimonials.length === 0) return null
  return (
    <section aria-labelledby="testimonials-title" className="section-pad">
      <div className="container-site">
        <SectionHeading id="testimonials-title" title="Lo que dicen nuestros clientes" />
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.author} className="rounded-[var(--radius-card)] border border-line bg-surface p-7">
              <figure>
                <blockquote className="leading-relaxed text-ink">“{item.quote}”</blockquote>
                <figcaption className="mt-5 text-[15px]">
                  <span className="font-semibold text-navy">{item.author}</span>
                  {(item.role || item.company) && (
                    <span className="block text-muted">{[item.role, item.company].filter(Boolean).join(', ')}</span>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
