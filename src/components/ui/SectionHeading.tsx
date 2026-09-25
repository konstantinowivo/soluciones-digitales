import type { ReactNode } from 'react'

interface Props {
  id?: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
}

export function SectionHeading({ id, title, intro, align = 'left', tone = 'dark' }: Props) {
  const alignment = align === 'center' ? 'mx-auto text-center' : ''
  const titleColor = tone === 'dark' ? 'text-navy' : 'text-white'
  const introColor = tone === 'dark' ? 'text-muted' : 'text-white/75'
  return (
    <div className={`max-w-2xl ${alignment}`}>
      <h2
        id={id}
        className={`text-[2rem] leading-[1.1] font-semibold tracking-[-0.025em] sm:text-[2.5rem] ${titleColor}`}
      >
        {title}
      </h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${introColor}`}>{intro}</p>}
    </div>
  )
}
