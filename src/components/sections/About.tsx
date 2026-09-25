import { approach, team } from '../../data/about'
import { QuoteLink } from '../ui/QuoteLink'
import { SectionHeading } from '../ui/SectionHeading'
import { WhatsAppLink } from '../ui/WhatsAppLink'

export function About() {
  return (
    <section id="nosotros" aria-labelledby="about-title" className="section-pad bg-surface">
      <div className="container-site">
        <SectionHeading id="about-title" title={approach.title} intro={approach.intro} />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <QuoteLink location="about">Contanos tu idea</QuoteLink>
          <WhatsAppLink location="about" variant="secondary" />
        </div>

        <ul className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {approach.points.map((point) => (
            <li key={point.title} className="border-t-2 border-navy pt-6">
              <h3 className="text-lg font-semibold tracking-[-0.01em] text-navy">{point.title}</h3>
              <p className="mt-2.5 leading-relaxed text-muted">{point.description}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-10 rounded-[var(--radius-card)] border border-line bg-canvas p-7 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.02em] text-navy sm:text-[1.75rem]">{team.title}</h3>
            <div className="mt-4 space-y-3 leading-relaxed text-ink">
              {team.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4">
            {team.disciplines.map((discipline) => {
              const Icon = discipline.icon
              return (
                <li key={discipline.title} className="rounded-xl border border-line bg-surface p-4 sm:p-5">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="mt-3 font-semibold text-navy">{discipline.title}</p>
                  <p className="mt-1 text-[14px] leading-snug text-muted">{discipline.description}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
