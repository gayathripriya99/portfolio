import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { projects } from '../data/projects'
import { motionEnabled } from '../lib/motion'
import { useOS } from '../lib/os'
import { ArrowUpRight } from './Icons'
import { ProjectPreview } from './ProjectPreview'
import { Reveal } from './Reveal'
import { Section } from './Section'

export function Work() {
  const os = useOS()
  const [active, setActive] = useState(0)
  const cursor = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLOListElement>(null)

  // Small label that trails the pointer over the list (fine pointers + motion only).
  const moveCursor = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !cursor.current || !motionEnabled()) return
    cursor.current.style.transform = `translate3d(${e.clientX + 18}px, ${e.clientY + 14}px, 0)`
  }

  useEffect(() => {
    const el = list.current
    if (!el) return
    const show = () => cursor.current?.classList.add('is-on')
    const hide = () => cursor.current?.classList.remove('is-on')
    el.addEventListener('pointerenter', show)
    el.addEventListener('pointerleave', hide)
    return () => {
      el.removeEventListener('pointerenter', show)
      el.removeEventListener('pointerleave', hide)
    }
  }, [])

  const current = projects[active]

  return (
    <Section
      id="work"
      index="02"
      label="Work"
      path="~/work"
      title={
        <>
          Selected <em>work</em>
        </>
      }
      intro="Production features, AI systems and full-stack builds. Every entry opens into a case study: the problem, the architecture and the decisions behind it."
    >
      <Reveal className="explorer" variant="fade">
        <div className="explorer-bar mono">
          <span className="explorer-path">
            <span className="explorer-dot" aria-hidden="true" />
            /projects
          </span>
          <span>{projects.length} entries</span>
          <span className="explorer-bar-hint">↵ open · hover to preview</span>
        </div>

        <div className="explorer-body">
          <ol className="explorer-list" ref={list} onPointerMove={moveCursor}>
            {projects.map((p, i) => (
              <li key={p.slug} className={`xrow-wrap ${active === i ? 'is-active' : ''}`} style={{ '--ri': i } as CSSProperties}>
                <button
                  type="button"
                  className="xrow"
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => os.openProject(p.slug)}
                  aria-haspopup="dialog"
                >
                  <span className="xrow-num mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="xrow-main">
                    <span className="xrow-title">{p.title}</span>
                    <span className="xrow-problem">{p.problem}</span>
                    <span className="xrow-meta mono">
                      <span className="xrow-type">{p.type}</span>
                      <span className="xrow-tech">{p.tech.slice(0, 4).join(' / ')}</span>
                      {p.links.github && <span className="xrow-src">● source</span>}
                    </span>
                  </span>
                  <span className="xrow-year mono">{p.year ?? '—'}</span>
                  <ArrowUpRight size={18} className="xrow-arrow" />
                </button>
              </li>
            ))}
          </ol>

          <aside className="explorer-preview" aria-hidden="true">
            <div className="explorer-preview-inner">
              <div className="xprev-stage">
                {projects.map((p, i) => (
                  <div key={p.slug} className={`xprev ${active === i ? 'is-active' : ''}`}>
                    <ProjectPreview kind={p.preview} />
                  </div>
                ))}
              </div>
              <div className="xprev-meta" key={current.slug}>
                <p className="xprev-label mono">
                  {String(active + 1).padStart(2, '0')} — {current.context}
                </p>
                <p className="xprev-impact">{current.impact}</p>
                <dl className="xprev-dl mono">
                  <div>
                    <dt>Role</dt>
                    <dd>{current.role}</dd>
                  </div>
                  <div>
                    <dt>Type</dt>
                    <dd>{current.type}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </Reveal>

      <div className="xcursor mono" ref={cursor} aria-hidden="true">
        open case <ArrowUpRight size={12} />
      </div>
    </Section>
  )
}
