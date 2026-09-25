import { MapPin, Mail } from 'lucide-react'
import { env } from '../../config/env'
import { navItems, site } from '../../config/site'
import { services } from '../../data/services'
import { useContactIntent } from '../../hooks/useContactIntent'
import { trackEvent } from '../../lib/analytics'
import { buildWhatsAppUrl, formatWhatsAppNumber } from '../../lib/whatsapp'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'
import { Logo } from './Logo'

export function Footer() {
  const { setNeed } = useContactIntent()
  const whatsappUrl = buildWhatsAppUrl()

  return (
    <footer className="bg-navy-deep text-white/75">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed">{site.shortDescription}</p>
        </div>

        <nav aria-label="Secciones">
          <h2 className="text-sm font-semibold text-white">Navegación</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Servicios">
          <h2 className="text-sm font-semibold text-white">Servicios</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {services.map((service) => (
              <li key={service.title}>
                <a href="#contacto" className="hover:text-white" onClick={() => setNeed(service.need)}>
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-white">Contacto</h2>
          <ul className="mt-4 space-y-3 text-[15px]">
            {whatsappUrl && (
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-white"
                  onClick={() => trackEvent('whatsapp_click', { location: 'footer' })}
                >
                  <WhatsAppIcon className="size-4 shrink-0" />
                  {formatWhatsAppNumber(env.whatsappNumber)}
                </a>
              </li>
            )}
            {env.contactEmail && (
              <li>
                <a
                  href={`mailto:${env.contactEmail}`}
                  onClick={() => trackEvent('email_click', { location: 'footer' })}
                  className="inline-flex items-center gap-2.5 break-all hover:text-white"
                >
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  {env.contactEmail}
                </a>
              </li>
            )}
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {site.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-6 text-[13px] text-white/55 sm:flex-row sm:justify-between">
          <p>
            © {site.copyrightYear} — {site.brand}. Todos los derechos reservados.
          </p>
          <a href="/privacidad" className="hover:text-white">
            Política de privacidad
          </a>
        </div>
      </div>
    </footer>
  )
}
