import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionProps {
  id: string
  index: string
  label: string
  path: string
  title: ReactNode
  intro?: ReactNode
  aside?: ReactNode
  children: ReactNode
  className?: string
}

export function Section({ id, index, label, path, title, intro, aside, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`section ${className}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <header className="sec-head">
          <Reveal className="sec-meta mono" variant="fade">
            <span className="sec-index">
              {index} / {label.toUpperCase()}
            </span>
            <span className="sec-rule" aria-hidden="true" />
            <span className="sec-path">{path}</span>
          </Reveal>
          <div className="sec-head-row">
            <div>
              <Reveal as="h2" id={`${id}-title`} className="sec-title" delay={60}>
                {title}
              </Reveal>
              {intro && (
                <Reveal as="p" className="sec-intro" delay={120}>
                  {intro}
                </Reveal>
              )}
            </div>
            {aside && (
              <Reveal className="sec-aside" delay={160}>
                {aside}
              </Reveal>
            )}
          </div>
        </header>
        {children}
      </div>
    </section>
  )
}
