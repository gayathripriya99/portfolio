import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { career, shortHash } from '../data/career'
import { motionEnabled, onScrollFrame } from '../lib/motion'
import { Chevron } from './Icons'
import { Reveal } from './Reveal'
import { Section } from './Section'

export function Experience() {
  const [open, setOpen] = useState<Record<string, boolean>>({ engineer: true })
  const graph = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLSpanElement>(null)

  // The graph line fills as the reader moves through the history.
  useEffect(() => {
    if (!motionEnabled()) return
    return onScrollFrame(() => {
      const el = graph.current
      if (!el || !fill.current) return
      const r = el.getBoundingClientRect()
      const p = (window.innerHeight * 0.65 - r.top) / r.height
      fill.current.style.transform = `scaleY(${Math.max(0, Math.min(1, p))})`
    })
  }, [])

  return (
    <Section
      id="experience"
      index="03"
      label="Experience"
      path="~/experience"
      title={
        <>
          Career, as a <em>commit history</em>
        </>
      }
      intro="Four years at Lingotran — from intern to owning production features end to end. Expand a commit for the full story."
    >
      <div className="gitlog">
        <Reveal as="p" className="gitlog-cmd mono" variant="fade">
          <span className="gitlog-prompt">priya@os</span>:<span className="gitlog-dir">~/experience</span>$ git log --career --graph
        </Reveal>

        <div className="gitlog-graph" ref={graph}>
          <span className="gitlog-rail" aria-hidden="true">
            <span className="gitlog-fill" ref={fill} />
          </span>
          <ol className="gitlog-list">
            {career.map((c, ci) => {
              const isOpen = !!open[c.id]
              const expandable = c.responsibilities.length > 0
              return (
                <Reveal as="li" key={c.id} className={`commit ${c.id === 'degree' ? 'commit--root' : ''}`} variant="left" delay={ci * 60}>
                  <span className="commit-node" aria-hidden="true" />
                  <div className="commit-head mono">
                    <span className="commit-hash">{shortHash(c.id + c.period)}</span>
                    {c.tag && <span className="commit-tag">({c.tag})</span>}
                    <span className="commit-period">{c.period}</span>
                  </div>

                  {expandable ? (
                    <button
                      type="button"
                      className="commit-title"
                      aria-expanded={isOpen}
                      aria-controls={`commit-${c.id}`}
                      onClick={() => setOpen((o) => ({ ...o, [c.id]: !o[c.id] }))}
                    >
                      <span className="commit-role">{c.role}</span>
                      <span className="commit-company">@ {c.company}</span>
                      <Chevron size={16} className="commit-chevron" />
                    </button>
                  ) : (
                    <h3 className="commit-title commit-title--static">
                      <span className="commit-role">{c.role}</span>
                      <span className="commit-company">@ {c.company}</span>
                    </h3>
                  )}

                  <p className="commit-summary">{c.summary}</p>

                  {c.commits.length > 0 && (
                    <ul className="commit-tree mono">
                      {c.commits.map((m, i) => (
                        <li key={m.message} style={{ '--ti': i } as CSSProperties}>
                          <span className="commit-branch" aria-hidden="true">
                            {i === c.commits.length - 1 ? '└──' : '├──'}
                          </span>
                          <span className={`commit-type commit-type--${m.type}`}>
                            {m.type}
                            {m.scope && <span className="commit-scope">({m.scope})</span>}:
                          </span>{' '}
                          <span className="commit-msg">{m.message}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {expandable && (
                    <div id={`commit-${c.id}`} className="commit-details" hidden={!isOpen}>
                      <div className="commit-details-grid">
                        <div>
                          <p className="commit-h mono">Responsibilities & achievements</p>
                          <ul className="commit-points">
                            {c.responsibilities.map((r) => (
                              <li key={r}>{r}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="commit-h mono">Where</p>
                          <p className="commit-where">
                            {c.company}
                            <br />
                            <span>{c.location}</span>
                          </p>
                          <p className="commit-h mono">Stack</p>
                          <ul className="badges">
                            {c.tech.map((t) => (
                              <li key={t} className="badge">
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </Reveal>
              )
            })}
          </ol>
        </div>
      </div>
    </Section>
  )
}
