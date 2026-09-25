import { ExternalLink } from 'lucide-react'
import { projects, type Project } from '../../data/projects'
import { QuoteLink } from '../ui/QuoteLink'
import { SectionHeading } from '../ui/SectionHeading'
import { WhatsAppLink } from '../ui/WhatsAppLink'

export function Projects() {
  return (
    <section id="proyectos" aria-labelledby="projects-title" className="section-pad">
      <div className="container-site">
        <SectionHeading
          id="projects-title"
          title="Proyectos realizados"
          intro="Sitios, catálogos y sistemas desarrollados para negocios reales."
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          {projects.map((project, index) => (
            <li key={project.id} className={index < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
              <ProjectCard project={project} large={index < 2} />
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-start gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-7 sm:p-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-lg leading-snug font-medium text-navy">
            ¿Tu proyecto se parece a alguno de estos? Contanos qué necesitás y lo analizamos.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <QuoteLink location="projects" />
            <WhatsAppLink location="projects" variant="secondary" />
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, large }: { project: Project; large: boolean }) {
  const inProgress = project.status === 'en-desarrollo'
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-canvas">
        {project.image ? (
          <img
            src={project.image}
            alt={`Captura del sitio de ${project.name}`}
            loading="lazy"
            decoding="async"
            width={1200}
            height={750}
            className="size-full object-cover object-top"
          />
        ) : (
          <ProjectPreview project={project} large={large} />
        )}
        {inProgress && (
          <span className="absolute top-3 right-3 rounded-full bg-surface px-3 py-1 text-[12.5px] font-semibold text-navy shadow-sm">
            En desarrollo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="text-xl font-semibold tracking-[-0.015em] text-navy">{project.name}</h3>
        <p className="mt-2 leading-relaxed text-ink">{project.summary}</p>
        {project.description && <p className="mt-2 text-[15px] leading-relaxed text-muted">{project.description}</p>}

        {project.technologies.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tecnologías utilizadas">
            {project.technologies.map((tech) => (
              <li key={tech} className="rounded-md bg-canvas px-2 py-0.5 text-[13px] font-medium text-muted">
                {tech}
              </li>
            ))}
          </ul>
        )}

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-fit items-center gap-1.5 text-[15px] font-semibold text-accent underline-offset-4 hover:underline"
          >
            Ver proyecto
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        )}
      </div>
    </article>
  )
}

/** Vista genérica mientras no haya captura real del proyecto (image en data/projects.ts). */
function ProjectPreview({ project, large }: { project: Project; large: boolean }) {
  return (
    <div aria-hidden="true" className="flex size-full flex-col px-4 pt-5 sm:px-6 sm:pt-6">
      <div className="flex flex-1 flex-col overflow-hidden rounded-t-lg border border-b-0 border-line bg-surface shadow-[0_-10px_30px_-18px_rgba(15,42,74,0.4)]">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
        </div>
        <div className="flex flex-1 flex-col justify-center px-4 py-4 sm:px-6" style={{ backgroundColor: project.accent }}>
          <p className={`font-semibold tracking-[-0.02em] text-white ${large ? 'text-2xl sm:text-[2rem]' : 'text-xl'}`}>
            {project.name}
          </p>
          <div className="mt-3 h-1.5 w-2/3 rounded-full bg-white/35" />
          <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-white/25" />
          <div className="mt-4 h-5 w-20 rounded-full bg-white/90" />
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          <div className="h-6 rounded bg-canvas" />
          <div className="h-6 rounded bg-canvas" />
          <div className="h-6 rounded bg-canvas" />
        </div>
      </div>
    </div>
  )
}
