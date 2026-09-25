import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'light' | 'ghost-light' | 'whatsapp'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 select-none whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-strong active:bg-navy',
  secondary: 'border border-line bg-surface text-ink hover:border-ink/40 hover:bg-canvas',
  light: 'bg-white text-navy hover:bg-accent-soft',
  'ghost-light': 'border border-white/30 text-white hover:border-white/70 hover:bg-white/10',
  whatsapp: 'bg-whatsapp text-white hover:bg-[#16733d]',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-7 text-base',
}

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

/** Los CTA del sitio son siempre enlaces reales (anclas o URLs), nunca botones sin destino. */
export function ButtonLink({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  return (
    <a className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </a>
  )
}
