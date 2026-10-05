import { useEffect, useRef, type CSSProperties } from 'react'
import { experience } from '../data/portfolio'
import { motionEnabled, onScrollFrame } from '../lib/motion'
import { Reveal } from './Reveal'
import { Section } from './Section'

export function Experience() {
  const track = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLSpanElement>(null)

  // Fill the timeline rail as the reader moves through it (60% of the viewport is the "read line").
  useEffect(() => {
    if (!motionEnabled()) return
    return onScrollFrame(() => {
      const el = track.current
      if (!el || !fill.current) return
      const r = el.getBoundingClientRect()
      const p = (window.innerHeight * 0.6 - r.top) / r.height
      fill.current.style.transform = `scaleY(${Math.max(0, Math.min(1, p))})`
    })
  }, [])

  return (
    <Section
      id="experience"
      index="03"
      eyebrow="Experience"
      title="Where I’ve been building"
      intro="Product engineering across the stack, with an emphasis on speech, language and AI features."
    >
      <div className="timeline" ref={track}>
        <span className="timeline-rail" aria-hidden="true">
          <span className="timeline-fill" ref={fill} />
        </span>
        <ol className="timeline-list">
        {experience.map((job, i) => (
          <Reveal as="li" key={job.company + job.role} className="timeline-item" variant="left" delay={i * 60}>
            <span className="timeline-dot" aria-hidden="true" />
            <div className="timeline-card">
              <header className="timeline-head">
                <div>
                  <h3 className="timeline-role">{job.role}</h3>
                  <p className="timeline-company">{job.company}</p>
                </div>
                <p className="timeline-period mono">{job.period}</p>
              </header>
              <p className="timeline-summary">{job.summary}</p>
              <ul className="timeline-points">
                {job.points.map((pt, pi) => (
                  <li key={pi} className={pt.highlight ? 'is-highlight' : undefined} style={{ '--pi': pi } as CSSProperties}>
                    <span>{pt.text}</span>
                  </li>
                ))}
              </ul>
              <ul className="badges" aria-label="Technologies used">
                {job.tech.map((t) => (
                  <li key={t} className="badge">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
        </ol>
      </div>
    </Section>
  )
}
