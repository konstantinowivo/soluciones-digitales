import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navItems } from '../../config/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { QuoteLink } from '../ui/QuoteLink'
import { Logo } from './Logo'

// 'inicio' se observa para que ningún ítem quede marcado mientras se ve el hero.
const sectionIds = ['inicio', ...navItems.map((item) => item.id)]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menú mobile: bloquea el scroll de fondo y se cierra con Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Si se agranda la pantalla con el menú abierto, se cierra.
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const onChange = () => media.matches && setOpen(false)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b bg-surface/95 backdrop-blur-sm transition-shadow ${
        scrolled || open ? 'border-line shadow-[0_1px_0_rgba(15,42,74,0.04)]' : 'border-transparent'
      }`}
    >
      <nav aria-label="Principal" className="container-site flex h-16 items-center justify-between gap-6">
        <a href="#inicio" className="rounded-md" aria-label="Ir al inicio" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                className={`rounded-full px-3.5 py-2 text-[15px] transition-colors ${
                  active === item.id ? 'text-navy font-semibold' : 'text-muted hover:text-navy'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <QuoteLink location="navbar" />
          </span>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-navy hover:bg-canvas lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div
        id="menu-mobile"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-surface lg:hidden"
      >
        <ul className="container-site flex flex-col py-4">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                aria-current={active === item.id ? 'true' : undefined}
                className="flex items-center border-b border-line py-4 text-lg font-medium text-navy"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="container-site pb-8">
          <QuoteLink location="menu_mobile" size="lg" className="w-full" onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </header>
  )
}
