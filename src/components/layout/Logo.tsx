import { site } from '../../config/site'

/** Marca: monograma + nombre. `tone` define el color según el fondo. */
export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const text = tone === 'dark' ? 'text-navy' : 'text-white'
  const sub = tone === 'dark' ? 'text-muted' : 'text-white/65'
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8 shrink-0">
        <rect width="32" height="32" rx="8" fill={tone === 'dark' ? '#0f2a4a' : '#ffffff'} />
        <path
          d="M9 10h6M9 16h10M9 22h14"
          stroke={tone === 'dark' ? '#ffffff' : '#0f2a4a'}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="22" cy="10" r="2.4" fill="#1d5bd6" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`text-[15px] font-semibold tracking-[-0.01em] ${text}`}>{site.brand}</span>
        <span className={`mt-1 text-[12px] ${sub}`}>{site.tagline}</span>
      </span>
    </span>
  )
}
