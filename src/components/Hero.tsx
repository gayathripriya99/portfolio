import { Fragment, useEffect, useRef, type CSSProperties } from 'react'
import { careerUptime, profile } from '../data/profile'
import type { SkillCategory } from '../data/skills'
import { motionEnabled, onScrollFrame } from '../lib/motion'
import { useOS } from '../lib/os'
import { ArrowRight, ArrowUpRight } from './Icons'
import { isMac } from './Nav'

const status: { label: string; value: string; detail: string; category: SkillCategory; tone?: 'blue' }[] = [
  { label: 'Frontend', value: 'READY', detail: 'React · TypeScript · Redux', category: 'frontend' },
  { label: 'Backend', value: 'READY', detail: 'Node.js · Express · FastAPI', category: 'backend' },
  { label: 'Database', value: 'CONNECTED', detail: 'PostgreSQL · MySQL · MongoDB', category: 'data', tone: 'blue' },
  { label: 'AI', value: 'ONLINE', detail: 'LLM integration · Ollama', category: 'ai' },
  { label: 'APIs', value: 'HEALTHY', detail: 'REST · Socket.IO · JWT', category: 'backend' },
  { label: 'Deployment', value: 'ACTIVE', detail: 'Docker · Azure DevOps · Git', category: 'infra', tone: 'blue' },
]

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export function Hero() {
  const os = useOS()
  const panel = useRef<HTMLDivElement>(null)
  const headline = ['Product', 'engineer', 'for', 'the']

  useEffect(() => {
    if (!motionEnabled()) return
    return onScrollFrame((y) => {
      if (panel.current && y < window.innerHeight * 1.2) panel.current.style.transform = `translate3d(0, ${y * -0.05}px, 0)`
    })
  }, [])

  const base = 160
  const afterTitle = base + (headline.length + 2) * 55

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker mono hero-in" style={d(0)}>
            {profile.available && (
              <span className="hero-available">
                <span className="live-dot" aria-hidden="true" />
                Available for opportunities
              </span>
            )}
            <span className="hero-kicker-sep" aria-hidden="true">/</span>
            <span>{profile.location.split(',').slice(0, 2).join(',')}</span>
          </p>

          <h1 id="hero-title" className="hero-title">
            <span className="hero-id mono hero-in" style={d(80)}>
              {profile.name} — {profile.role}
            </span>
            <span className="hero-headline">
              <span className="sr-only">Product engineer for the whole stack.</span>
              {headline.map((w, i) => (
                <Fragment key={w}>
                  <span className="word" aria-hidden="true">
                    <span className="word-inner" style={d(base + i * 55)}>
                      {w}
                    </span>
                  </span>{' '}
                </Fragment>
              ))}
              <span className="word" aria-hidden="true">
                <em className="word-inner" style={d(base + headline.length * 55)}>
                  whole
                </em>
              </span>{' '}
              <span className="word" aria-hidden="true">
                <span className="word-inner" style={d(base + (headline.length + 1) * 55)}>
                  stack.
                </span>
              </span>
            </span>
          </h1>

          <p className="hero-intro hero-in" style={d(afterTitle)}>
            {profile.yearsLabel} shipping production features end to end — React and TypeScript interfaces, Node.js and FastAPI services, SQL and NoSQL data, and
            LLM features built to hold up with real users.
          </p>

          <p className="hero-stack mono hero-in" style={d(afterTitle + 80)}>
            {['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'AI'].map((t, i) => (
              <Fragment key={t}>
                {i > 0 && <span aria-hidden="true"> / </span>}
                <span>{t}</span>
              </Fragment>
            ))}
          </p>

          <div className="hero-ctas hero-in" style={d(afterTitle + 160)}>
            <a href="#work" className="btn btn--primary" onClick={(e) => (e.preventDefault(), os.goTo('work'))}>
              Explore work <ArrowRight size={17} className="btn-icon" />
            </a>
            <a href={profile.resumeUrl} className="btn btn--ghost" target="_blank" rel="noopener">
              View résumé <ArrowUpRight size={16} className="btn-icon btn-icon--diag" />
            </a>
            <button type="button" className="hero-hint mono" onClick={os.openPalette}>
              or press <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
              <kbd>K</kbd>
            </button>
          </div>
        </div>

        <div className="hero-side" ref={panel}>
          <div className="status hero-in hero-in--scale" style={d(360)}>
            <div className="status-head mono">
              <span>SYSTEM STATUS</span>
              <span className="status-uptime" title={`In industry since September 2022`}>
                uptime {careerUptime()}
              </span>
            </div>
            <ul className="status-rows">
              {status.map((s, i) => (
                <li key={s.label} style={{ '--si': i } as CSSProperties}>
                  <button type="button" className="status-row" onClick={() => os.focusCategory(s.category)}>
                    <span className="status-label mono">{s.label}</span>
                    <span className="status-leader" aria-hidden="true" />
                    <span className={`status-value mono ${s.tone === 'blue' ? 'is-blue' : ''}`}>
                      <span className="status-pending" aria-hidden="true">
                        ···
                      </span>
                      <span className="status-ok">
                        <span className="status-dot" aria-hidden="true" />
                        {s.value}
                      </span>
                    </span>
                    <span className="status-detail mono">{s.detail}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="status-foot mono">
              <span>kernel: React 19 · TypeScript</span>
              <span>click a row → stack map</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
