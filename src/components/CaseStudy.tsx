import { useEffect, useRef, type CSSProperties, type MouseEvent } from 'react'
import type { Project } from '../data/portfolio'
import { motionEnabled } from '../lib/motion'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { ArrowUpRight, Close, Github } from './Icons'
import { ProjectPreview } from './ProjectPreview'
import { Reveal } from './Reveal'

interface Props {
  project: Project
  onClose: () => void
}

export function CaseStudy({ project, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closing = useRef(false)

  useEffect(() => {
    const dlg = dialog.current
    if (!dlg) return
    const returnFocus = document.activeElement as HTMLElement | null
    dlg.showModal()
    void dlg.offsetWidth // commit the initial state so the entrance transitions
    dlg.classList.add('is-open')
    document.documentElement.classList.add('modal-open')
    return () => {
      document.documentElement.classList.remove('modal-open')
      if (dlg.open) dlg.close()
      returnFocus?.focus({ preventScroll: true })
    }
  }, [])

  const requestClose = () => {
    if (closing.current) return
    closing.current = true
    dialog.current?.classList.replace('is-open', 'is-closing')
    window.setTimeout(onClose, motionEnabled() ? 200 : 0)
  }

  const onBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) requestClose()
  }

  const chipStep = (n: number) => ({ '--ci': n }) as CSSProperties

  return (
    <dialog
      ref={dialog}
      className="case"
      aria-labelledby="case-title"
      onCancel={(e) => {
        e.preventDefault()
        requestClose()
      }}
      onClick={onBackdrop}
    >
      <article className="case-panel">
        <div className="case-close-rail">
          <button type="button" className="case-close" onClick={requestClose} aria-label="Close case study" autoFocus>
            <Close size={20} />
          </button>
        </div>
        <header className="case-head">
          <p className="mono case-role">{project.role}</p>
          <h2 id="case-title" className="case-title">
            {project.title}
          </h2>
          <p className="case-tagline">{project.tagline}</p>
          {(project.links.github || project.links.live) && (
            <div className="case-links">
              {project.links.github && (
                <a className="btn btn--ghost btn--sm" href={project.links.github} target="_blank" rel="noopener">
                  <Github size={16} /> Source
                </a>
              )}
              {project.links.live && (
                <a className="btn btn--primary btn--sm" href={project.links.live} target="_blank" rel="noopener">
                  Live demo <ArrowUpRight size={15} className="btn-icon btn-icon--diag" />
                </a>
              )}
            </div>
          )}
        </header>

        <div className="case-media">
          <ProjectPreview kind={project.preview} />
        </div>

        <div className="case-body">
          <p className="case-summary">{project.summary}</p>

          <div className="case-split">
            <Reveal className="case-block" delay={60}>
              <h3 className="case-h">Problem</h3>
              <p>{project.problem}</p>
            </Reveal>
            <Reveal className="case-block" delay={120}>
              <h3 className="case-h">Approach</h3>
              <p>{project.solution}</p>
            </Reveal>
          </div>

          <Reveal className="case-block" delay={160}>
            <h3 className="case-h">Tech stack</h3>
            <div className="case-stack">
              {project.stack.map((g, gi) => (
                <div key={g.group} className="case-stack-group">
                  <span className="case-stack-label mono">{g.group}</span>
                  <ul className="chips chips--stagger">
                    {g.items.map((item, i) => (
                      <li key={item} className="chip" style={chipStep(gi * 3 + i)}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="case-block" delay={100}>
            <h3 className="case-h">Architecture</h3>
            <ArchitectureDiagram architecture={project.architecture} />
          </Reveal>

          <div className="case-block">
            <h3 className="case-h">Key features</h3>
            <ul className="feature-grid">
              {project.features.map((f, i) => (
                <Reveal as="li" key={f.title} className="feature" delay={(i % 3) * 70}>
                  <h4>{f.title}</h4>
                  <p>{f.body}</p>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="case-split">
            <Reveal className="case-block">
              <h3 className="case-h">Engineering decisions</h3>
              <ul className="ticks">
                {project.decisions.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </Reveal>
            {project.next && (
              <Reveal className="case-block" delay={80}>
                <h3 className="case-h">What’s next</h3>
                <ul className="ticks ticks--next">
                  {project.next.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </article>
    </dialog>
  )
}
