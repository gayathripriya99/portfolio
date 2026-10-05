import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { profile, sections } from '../data/portfolio'
import { onScrollFrame } from '../lib/motion'
import { ArrowUpRight, Close, Menu } from './Icons'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => onScrollFrame((y) => setScrolled(y > 12)), [])

  // Highlight the section occupying the middle band of the viewport.
  useEffect(() => {
    const targets = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    const hero = document.getElementById('top')
    const heroIo = new IntersectionObserver(([e]) => e.isIntersecting && setActive(''), { rootMargin: '-45% 0px -50% 0px' })
    if (hero) heroIo.observe(hero)
    return () => {
      io.disconnect()
      heroIo.disconnect()
    }
  }, [])

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

  return (
    <header className={`nav ${scrolled || open ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav-inner container">
        <a href="#top" className="nav-brand" onClick={() => setOpen(false)}>
          <span className="nav-mark" aria-hidden="true">
            GP
          </span>
          <span className="nav-name">{profile.name}</span>
        </a>

        <nav aria-label="Primary" className="nav-links">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`nav-link ${active === s.id ? 'is-active' : ''}`} aria-current={active === s.id ? 'location' : undefined}>
              {s.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a className="btn btn--ghost btn--sm nav-resume" href={profile.resumeUrl} target="_blank" rel="noopener">
            Résumé
            <ArrowUpRight size={15} className="btn-icon btn-icon--diag" />
          </a>
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
        <nav aria-label="Mobile" className="container">
          {sections.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className="nav-sheet-link" style={{ '--i': i } as CSSProperties} onClick={() => setOpen(false)}>
              <span className="mono">0{i + 1}</span>
              {s.label}
            </a>
          ))}
          <a className="nav-sheet-link" href={profile.resumeUrl} target="_blank" rel="noopener" style={{ '--i': sections.length } as CSSProperties}>
            <span className="mono">↗</span>
            Résumé
          </a>
        </nav>
      </div>
    </header>
  )
}
