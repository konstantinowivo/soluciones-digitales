import { processSteps } from '../../data/process'
import { SectionHeading } from '../ui/SectionHeading'

export function Process() {
  return (
    <section id="como-trabajamos" aria-labelledby="process-title" className="section-pad bg-surface">
      <div className="container-site">
        <SectionHeading
          id="process-title"
          title="Del problema a una solución funcional"
          intro="Un proceso claro, con avances visibles en cada etapa."
        />

        <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-8">
          {/* Línea de tiempo: vertical en mobile, horizontal desde md */}
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[21px] w-px bg-line md:top-[22px] md:right-[12%] md:bottom-auto md:left-[22px] md:h-px md:w-auto" />
          {processSteps.map((step, index) => (
            <li key={step.title} className="relative grid grid-cols-[44px_1fr] gap-5 md:block">
              <span className="relative flex size-11 items-center justify-center rounded-full border border-line bg-surface text-[15px] font-semibold text-accent tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="md:mt-6">
                <h3 className="text-xl font-semibold tracking-[-0.015em] text-navy">{step.title}</h3>
                <p className="mt-2.5 leading-relaxed text-muted">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
