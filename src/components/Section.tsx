import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionProps {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  children: ReactNode
  className?: string
}

export function Section({ id, index, eyebrow, title, intro, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`section ${className}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <header className="section-head">
          <Reveal as="p" className="eyebrow">
            <span className="mono">{index}</span>
            <span className="eyebrow-rule" aria-hidden="true" />
            {eyebrow}
          </Reveal>
          <Reveal as="h2" id={`${id}-title`} className="section-title" delay={70}>
            {title}
          </Reveal>
          {intro && (
            <Reveal as="p" className="section-intro" delay={140}>
              {intro}
            </Reveal>
          )}
        </header>
        {children}
      </div>
    </section>
  )
}

/** Thin rule that draws outward from the centre, with a single travelling glint. */
export function SectionDivider() {
  return (
    <Reveal className="divider container" variant="fade" aria-hidden="true">
      <span className="divider-line" />
      <span className="divider-node" />
    </Reveal>
  )
}
