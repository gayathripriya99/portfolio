import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { projects, type Project } from '../data/projects'
import { motionEnabled } from '../lib/motion'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { ArrowLeft, ArrowRight, ArrowUpRight, Close, Github } from './Icons'
import { ProjectPreview } from './ProjectPreview'
import { Reveal } from './Reveal'

interface Props {
  project: Project
  onClose: () => void
  onNavigate: (slug: string) => void
}

const PARTS = ['Overview', 'My role', 'Architecture', 'Engineering', 'Challenges', 'Result', 'Stack', 'Links'] as const

function Part({ i, children, wide }: { i: number; children: ReactNode; wide?: boolean }) {
  return (
    <section className={`cs-part ${wide ? 'cs-part--wide' : ''}`} data-part={i} aria-labelledby={`cs-part-${i}`}>
      <Reveal as="h3" className="cs-h mono" id={`cs-part-${i}`} variant="fade">
        <span>{String(i + 1).padStart(2, '0')}</span> / {PARTS[i].toUpperCase()}
      </Reveal>
      {children}
    </section>
  )
}

export function CaseStudy({ project, onClose, onNavigate }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closing = useRef(false)
  const [part, setPart] = useState(0)
  const index = projects.findIndex((p) => p.slug === project.slug)
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]

  useEffect(() => {
    const dlg = dialog.current
    if (!dlg) return
    const returnFocus = document.activeElement as HTMLElement | null
    if (!dlg.open) dlg.showModal()
    void dlg.offsetWidth // commit the initial state so the entrance transitions
    dlg.classList.add('is-open')
    document.documentElement.classList.add('modal-open')
    return () => {
      document.documentElement.classList.remove('modal-open')
      if (dlg.open) dlg.close()
      returnFocus?.focus({ preventScroll: true })
    }
  }, [])

  // Track which part is being read for the side index.
  useEffect(() => {
    const dlg = dialog.current
    if (!dlg) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setPart(Number((e.target as HTMLElement).dataset.part))
      },
      { root: dlg, rootMargin: '-30% 0px -60% 0px' },
    )
    dlg.querySelectorAll('[data-part]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const requestClose = () => {
    if (closing.current) return
    closing.current = true
    dialog.current?.classList.replace('is-open', 'is-closing')
    window.setTimeout(onClose, motionEnabled() ? 200 : 0)
  }

  const jump = (i: number) => {
    dialog.current?.querySelector(`[data-part="${i}"]`)?.scrollIntoView({ behavior: motionEnabled() ? 'smooth' : 'auto', block: 'start' })
  }

  const onBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) requestClose()
  }

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
          <p className="mono case-crumb">
            ~/work/<span>{project.slug}</span> · {String(index + 1).padStart(2, '0')} of {String(projects.length).padStart(2, '0')}
          </p>
          <h2 id="case-title" className="case-title">
            {project.title}
          </h2>
          <p className="case-problem">{project.problem}</p>
          <dl className="case-meta mono">
            <div>
              <dt>Type</dt>
              <dd>{project.type}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Context</dt>
              <dd>{project.context}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{project.year ?? '—'}</dd>
            </div>
          </dl>
        </header>

        <div className="case-media">
          <ProjectPreview kind={project.preview} />
        </div>

        <div className="case-layout">
          <nav className="case-index mono" aria-label="Case study sections">
            <ol>
              {PARTS.map((p, i) => (
                <li key={p}>
                  <button type="button" className={part === i ? 'is-active' : ''} onClick={() => jump(i)}>
                    <span>{String(i + 1).padStart(2, '0')}</span> {p}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className="case-body">
            <Part i={0}>
              <Reveal as="p" className="cs-lead" delay={60}>
                {project.overview}
              </Reveal>
              {project.note && <p className="cs-note mono">{project.note}</p>}
            </Part>

            <Part i={1}>
              <ul className="cs-list">
                {project.myRole.map((r, i) => (
                  <Reveal as="li" key={r} delay={i * 60}>
                    {r}
                  </Reveal>
                ))}
              </ul>
            </Part>

            <Part i={2} wide>
              <ArchitectureDiagram architecture={project.architecture} />
            </Part>

            <Part i={3}>
              <ul className="cs-grid">
                {project.engineering.map((e, i) => (
                  <Reveal as="li" key={e.title} className="cs-card" delay={(i % 2) * 70}>
                    <h4>{e.title}</h4>
                    <p>{e.body}</p>
                  </Reveal>
                ))}
              </ul>
            </Part>

            <Part i={4}>
              <ol className="cs-challenges">
                {project.challenges.map((c, i) => (
                  <Reveal as="li" key={c.title} delay={i * 70}>
                    <span className="mono cs-challenge-n">C{i + 1}</span>
                    <div>
                      <h4>{c.title}</h4>
                      <p>{c.body}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </Part>

            <Part i={5}>
              <ul className="ticks">
                {project.result.map((r, i) => (
                  <Reveal as="li" key={r} delay={i * 60}>
                    {r}
                  </Reveal>
                ))}
              </ul>
            </Part>

            <Part i={6}>
              <Reveal className="case-stack">
                {project.stack.map((g, gi) => (
                  <div key={g.group} className="case-stack-group">
                    <span className="case-stack-label mono">{g.group}</span>
                    <ul className="chips chips--stagger">
                      {g.items.map((item, i) => (
                        <li key={item} className="chip" style={{ '--ci': gi * 3 + i } as CSSProperties}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Reveal>
            </Part>

            <Part i={7}>
              {project.links.github || project.links.live ? (
                <div className="case-links">
                  {project.links.live && (
                    <a className="btn btn--primary" href={project.links.live} target="_blank" rel="noopener">
                      Live project <ArrowUpRight size={16} className="btn-icon btn-icon--diag" />
                    </a>
                  )}
                  {project.links.github && (
                    <a className="btn btn--ghost" href={project.links.github} target="_blank" rel="noopener">
                      <Github size={16} /> Source on GitHub
                    </a>
                  )}
                </div>
              ) : (
                <p className="cs-muted">{project.context === 'Lingotran Private Limited' ? 'Proprietary product — no public repository or demo.' : 'Repository and demo links will be added here when published.'}</p>
              )}
            </Part>

            <nav className="case-pager" aria-label="More projects">
              <button type="button" onClick={() => onNavigate(prev.slug)}>
                <span className="mono">
                  <ArrowLeft size={14} /> previous
                </span>
                {prev.title}
              </button>
              <button type="button" onClick={() => onNavigate(next.slug)} className="is-next">
                <span className="mono">
                  next <ArrowRight size={14} />
                </span>
                {next.title}
              </button>
            </nav>
          </div>
        </div>
      </article>
    </dialog>
  )
}
