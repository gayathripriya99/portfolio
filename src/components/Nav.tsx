import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { profile, sections, type SectionId } from '../data/profile'
import { onScrollFrame } from '../lib/motion'
import { useOS } from '../lib/os'
import { usePrefs } from '../lib/prefs'
import { ArrowUpRight, Close, Menu, Moon, Search, Sun } from './Icons'

export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

function useLocalTime() {
  const fmt = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: profile.timezone }).format(new Date())
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const t = window.setInterval(() => setTime(fmt()), 30_000)
    return () => window.clearInterval(t)
  }, [])
  return time
}

export function Nav() {
  const os = useOS()
  const prefs = usePrefs()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<SectionId>('home')
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const time = useLocalTime()

  const visible = sections.filter((s) => !(prefs.recruiter && 'experimental' in s))

  useEffect(() => onScrollFrame((y) => setScrolled(y > 8)), [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [prefs.recruiter])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      menuButton.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const path = sections.find((s) => s.id === active)?.path ?? '~'
  const go = (id: SectionId) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    os.goTo(id)
  }

  return (
    <header className={`nav ${scrolled || open ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav-inner">
        <a href="#home" className="nav-brand" onClick={go('home')} aria-label="PRIYA.OS — back to top">
          <span className="nav-logo mono">
            PRIYA<span className="nav-logo-dot">.</span>OS
          </span>
          <span className="nav-path mono" aria-hidden="true">
            {path}
            <span className="nav-caret" />
          </span>
        </a>

        <nav aria-label="Primary" className="nav-links">
          {visible.map((s) => {
            const n = sections.findIndex((x) => x.id === s.id) + 1
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={go(s.id)}
                className={`nav-link ${active === s.id ? 'is-active' : ''}`}
                aria-current={active === s.id ? 'location' : undefined}
              >
                <span className="nav-num mono">0{n}</span>
                {s.label}
              </a>
            )
          })}
        </nav>

        <div className="nav-actions">
          <span className="nav-time mono" title={`Local time in ${profile.location}`}>
            IST {time}
          </span>
          <button
            type="button"
            className={`recruiter-toggle mono ${prefs.recruiter ? 'is-on' : ''}`}
            aria-pressed={prefs.recruiter}
            onClick={os.toggleRecruiter}
            title="Concise view for recruiters"
          >
            <span className="recruiter-switch" aria-hidden="true">
              <span />
            </span>
            <span className="recruiter-label">Recruiter mode</span>
          </button>
          <button type="button" className="nav-icon-btn" onClick={os.toggleTheme} aria-label={`Switch to ${prefs.theme === 'dark' ? 'light' : 'dark'} theme`}>
            {prefs.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button type="button" className="nav-cmdk mono" onClick={os.openPalette} aria-label="Open command palette" aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}>
            <Search size={14} />
            <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
            <kbd>K</kbd>
          </button>
          <button
            ref={menuButton}
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="nav-sheet" hidden={!open}>
        <nav aria-label="Mobile">
          {visible.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className="nav-sheet-link" style={{ '--i': i } as CSSProperties} onClick={go(s.id)}>
              <span className="mono">0{sections.findIndex((x) => x.id === s.id) + 1} /</span>
              {s.label}
            </a>
          ))}
          <div className="nav-sheet-actions" style={{ '--i': visible.length } as CSSProperties}>
            <a className="btn btn--primary btn--sm" href={profile.resumeUrl} target="_blank" rel="noopener">
              View résumé <ArrowUpRight size={15} className="btn-icon btn-icon--diag" />
            </a>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => (setOpen(false), os.openPalette())}>
              <Search size={15} /> Commands
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
