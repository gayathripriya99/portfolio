import { Fragment, useEffect, useRef, type CSSProperties } from 'react'
import { profile } from '../data/portfolio'
import { motionEnabled, onScrollFrame } from '../lib/motion'
import { ArrowRight, Download, Mail } from './Icons'

const trace = [
  { method: 'POST', path: '/documents/upload', status: '201', note: 'pypdf → postgres' },
  { method: 'POST', path: '/chat', status: '200', note: 'context: documents' },
  { method: 'CALL', path: 'ollama.generate', status: 'ok', note: 'local model', nested: true },
  { method: 'POST', path: '/quiz/generate', status: '200', note: 'format: json ✓' },
]

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export function Hero() {
  const visual = useRef<HTMLDivElement>(null)

  // Gentle parallax on the decorative card while the hero is on screen.
  useEffect(() => {
    if (!motionEnabled()) return
    return onScrollFrame((y) => {
      if (!visual.current || y > window.innerHeight * 1.2) return
      visual.current.style.transform = `translate3d(0, ${y * -0.06}px, 0)`
    })
  }, [])

  const words = profile.headline.split(' ')

  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          {profile.available && (
            <p className="hero-badge hero-in" style={d(0)}>
              <span className="live-dot" aria-hidden="true" />
              Open to new opportunities
            </p>
          )}

          <p className="hero-hello hero-in" style={d(80)}>
            Hi, I’m <strong>{profile.name}</strong> — {profile.role}.
          </p>

          <h1 className="hero-title" aria-label={profile.headline}>
            {words.map((w, i) => (
              <Fragment key={i}>
                <span className="word" aria-hidden="true">
                  <span className="word-inner" style={d(160 + i * 45)}>
                    {w}
                  </span>
                </span>{' '}
              </Fragment>
            ))}
          </h1>

          <p className="hero-intro hero-in" style={d(160 + words.length * 45 + 60)}>
            {profile.intro}
          </p>

          <div className="hero-ctas hero-in" style={d(160 + words.length * 45 + 160)}>
            <a href="#projects" className="btn btn--primary">
              View projects
              <ArrowRight size={17} className="btn-icon" />
            </a>
            <a href={profile.resumeUrl} className="btn btn--ghost" target="_blank" rel="noopener">
              <Download size={17} className="btn-icon btn-icon--down" />
              Résumé
            </a>
            <a href="#contact" className="btn btn--text">
              <Mail size={17} />
              Contact
            </a>
          </div>

          <dl className="hero-meta hero-in" style={d(160 + words.length * 45 + 260)}>
            {[profile.current, profile.focus].map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-visual" ref={visual} aria-hidden="true">
          <div className="hero-visual-float hero-in hero-in--scale" style={d(420)}>
            <div className="trace-card">
              <div className="trace-head">
                <span className="trace-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="mono">priya-mentor-ai · trace</span>
              </div>
              <ol className="trace-list">
                {trace.map((t, i) => (
                  <li key={t.path} className={`trace-row ${t.nested ? 'is-nested' : ''}`} style={d(900 + i * 220)}>
                    <span className={`trace-method trace-method--${t.method.toLowerCase()}`}>{t.method}</span>
                    <span className="trace-path">{t.path}</span>
                    <span className="trace-status">{t.status}</span>
                    <span className="trace-note">{t.note}</span>
                  </li>
                ))}
              </ol>
              <div className="trace-foot mono" style={d(900 + trace.length * 220)}>
                <span className="trace-cursor" /> ready
              </div>
            </div>
            <div className="hero-chip hero-chip--a">FastAPI</div>
            <div className="hero-chip hero-chip--b">React 19</div>
            <div className="hero-chip hero-chip--c">Ollama</div>
          </div>
        </div>
      </div>

      <a href="#skills" className="hero-scroll hero-in" style={d(1400)} aria-label="Scroll to skills">
        <span className="hero-scroll-line" />
      </a>
    </section>
  )
}
