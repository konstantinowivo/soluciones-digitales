import { Globe2, Mail, MapPin } from 'lucide-react'
import type { ReactNode } from 'react'
import { env } from '../../config/env'
import { site } from '../../config/site'
import { trackEvent } from '../../lib/analytics'
import { buildWhatsAppUrl, formatWhatsAppNumber } from '../../lib/whatsapp'
import { ContactForm } from '../forms/ContactForm'
import { SectionHeading } from '../ui/SectionHeading'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'
import { WhatsAppLink } from '../ui/WhatsAppLink'

export function Contact() {
  const whatsappUrl = buildWhatsAppUrl()

  return (
    <section id="contacto" aria-labelledby="contact-title" className="section-pad">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading
            id="contact-title"
            title="Contanos qué necesitás"
            intro="Completá el formulario y te respondemos con los próximos pasos. Si preferís, escribinos directo por WhatsApp."
          />

          <div className="mt-10 border-t border-line pt-8">
            <p className="text-lg font-semibold text-navy">{site.brand}</p>
            <p className="text-muted">{site.tagline}</p>

            <ul className="mt-6 space-y-4 text-[15px]">
              {whatsappUrl && (
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('whatsapp_click', { location: 'contact_info' })}
                    className="flex items-center gap-3 font-medium text-ink hover:text-accent"
                  >
                    <IconBox>
                      <WhatsAppIcon className="size-[18px]" />
                    </IconBox>
                    {formatWhatsAppNumber(env.whatsappNumber)}
                  </a>
                </li>
              )}
              {env.contactEmail && (
                <li>
                  <a
                    href={`mailto:${env.contactEmail}`}
                    onClick={() => trackEvent('email_click', { location: 'contact_info' })}
                    className="flex items-center gap-3 font-medium break-all text-ink hover:text-accent"
                  >
                    <IconBox>
                      <Mail className="size-[18px]" aria-hidden="true" />
                    </IconBox>
                    {env.contactEmail}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3 text-ink">
                <IconBox>
                  <MapPin className="size-[18px]" aria-hidden="true" />
                </IconBox>
                {site.location}
              </li>
              <li className="flex items-center gap-3 text-ink">
                <IconBox>
                  <Globe2 className="size-[18px]" aria-hidden="true" />
                </IconBox>
                Atención: {site.coverage}
              </li>
            </ul>

            <WhatsAppLink location="contact_section" className="mt-8 w-full sm:w-auto" />
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}

function IconBox({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-navy">
      {children}
    </span>
  )
}
