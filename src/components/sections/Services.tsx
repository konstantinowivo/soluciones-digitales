import { services } from '../../data/services'
import { techGroups, type Technology } from '../../data/technologies'
import { QuoteLink } from '../ui/QuoteLink'
import { SectionHeading } from '../ui/SectionHeading'
import { WhatsAppLink } from '../ui/WhatsAppLink'

export function Services() {
  return (
    <section id="servicios" aria-labelledby="services-title" className="section-pad bg-surface">
      <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="services-title"
            title="Soluciones digitales a medida"
            intro="Cada proyecto arranca por lo que el negocio necesita. Estos son los tipos de trabajo que hacemos; si el tuyo combina varios, también."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <QuoteLink location="services" />
            <WhatsAppLink location="services" variant="secondary" />
          </div>
        </div>

        <ul className="border-t border-line">
          {services.map((service) => (
            <li
              key={service.title}
              className="grid gap-2 border-b border-line py-7 sm:grid-cols-[13rem_1fr] sm:gap-8"
            >
              <h3 className="text-lg font-semibold tracking-[-0.01em] text-navy">{service.title}</h3>
              <p className="leading-relaxed text-muted">{service.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Technology() {
  return (
    <section aria-labelledby="tech-title" className="border-y border-line bg-canvas py-16 sm:py-20">
      <div className="container-site">
        <div className="max-w-2xl">
          <h2 id="tech-title" className="text-2xl font-semibold tracking-[-0.02em] text-navy sm:text-[2rem]">
            Tecnología que se adapta al proyecto
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Trabajamos con tecnologías modernas y con las plataformas que tu negocio ya usa. La
            tecnología se define según las necesidades de cada proyecto, no al revés.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-12 lg:gap-6">
          {techGroups.map((group) => (
            <section
              key={group.label}
              aria-label={group.label}
              className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-7"
            >
              <h3 className="text-lg font-semibold tracking-[-0.01em] text-navy">{group.label}</h3>
              <p className="mt-1 text-[15px] text-muted">{group.description}</p>
              <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {group.items.map((tech) => (
                  <li
                    key={tech.name}
                    className="flex min-w-0 items-center gap-2.5 rounded-lg border border-line bg-canvas/60 px-3 py-2.5"
                  >
                    <TechLogo tech={tech} />
                    <span className="truncate text-[14px] font-medium text-ink">{tech.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

function TechLogo({ tech }: { tech: Technology }) {
  if ('src' in tech) {
    return <img src={tech.src} alt="" width={20} height={20} loading="lazy" className="size-5 shrink-0 object-contain" />
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 shrink-0" fill={`#${tech.icon.hex}`}>
      <path d={tech.icon.path} />
    </svg>
  )
}
