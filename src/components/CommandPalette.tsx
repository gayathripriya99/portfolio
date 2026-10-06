import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { profile, sections } from '../data/profile'
import { projects } from '../data/projects'
import { motionEnabled } from '../lib/motion'
import { useOS } from '../lib/os'
import { usePrefs } from '../lib/prefs'
import { ArrowUpRight, Briefcase, Copy, Download, Eye, Github, Hash, Linkedin, Mail, Moon, Motion, Search, Shuffle, Sparkle, Sun, TerminalIcon } from './Icons'

interface Cmd {
  id: string
  group: string
  label: string
  hint?: string
  keywords?: string
  icon: ReactNode
  run: () => void
}

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const os = useOS()
  const prefs = usePrefs()
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const commands = useMemo<Cmd[]>(() => {
    const nav: Cmd[] = sections
      .filter((s) => !(prefs.recruiter && 'experimental' in s))
      .map((s, i) => ({
        id: `go-${s.id}`,
        group: 'Navigate',
        label: s.id === 'home' ? 'Go to Home' : s.id === 'work' ? 'View Projects' : s.id === 'stack' ? 'View Skills' : `Go to ${s.label}`,
        hint: `0${sections.findIndex((x) => x.id === s.id) + 1}`,
        keywords: `${s.label} ${s.path} section ${i}`,
        icon: <Hash size={16} />,
        run: () => os.goTo(s.id),
      }))
    const work: Cmd[] = projects.map((p, i) => ({
      id: `p-${p.slug}`,
      group: 'Projects',
      label: p.title,
      hint: p.type,
      keywords: `${p.tech.join(' ')} case study project ${i + 1}`,
      icon: <Briefcase size={16} />,
      run: () => os.openProject(p.slug),
    }))
    const links: Cmd[] = [
      { id: 'resume', group: 'Links', label: 'Open résumé', hint: 'PDF', keywords: 'resume cv', icon: <Eye size={16} />, run: () => os.openResume() },
      { id: 'resume-dl', group: 'Links', label: 'Download résumé', keywords: 'resume cv download', icon: <Download size={16} />, run: () => os.openResume(true) },
      { id: 'github', group: 'Links', label: 'GitHub', hint: `@${profile.githubUser}`, icon: <Github size={16} />, run: () => window.open(profile.github, '_blank', 'noopener') },
      ...(profile.linkedin
        ? [{ id: 'linkedin', group: 'Links', label: 'LinkedIn', icon: <Linkedin size={16} />, run: () => window.open(profile.linkedin, '_blank', 'noopener') }]
        : []),
      { id: 'contact', group: 'Links', label: 'Contact — send an email', hint: profile.email, keywords: 'email mail hire', icon: <Mail size={16} />, run: () => (window.location.href = `mailto:${profile.email}`) },
      { id: 'copy', group: 'Links', label: 'Copy email address', keywords: 'email clipboard', icon: <Copy size={16} />, run: os.copyEmail },
    ]
    const prefsCmds: Cmd[] = [
      { id: 'theme', group: 'Preferences', label: `Toggle theme`, hint: prefs.theme === 'dark' ? '→ light' : '→ dark', keywords: 'dark light mode', icon: prefs.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />, run: os.toggleTheme },
      { id: 'motion', group: 'Preferences', label: 'Toggle reduced motion', hint: prefs.reducedMotion ? 'on' : 'off', keywords: 'animation accessibility', icon: <Motion size={16} />, run: os.toggleMotion },
      { id: 'recruiter', group: 'Preferences', label: 'Toggle recruiter mode', hint: prefs.recruiter ? 'on' : 'off', keywords: 'concise summary hiring', icon: <Briefcase size={16} />, run: os.toggleRecruiter },
      { id: 'terminal', group: 'Preferences', label: 'Open terminal', hint: '`', keywords: 'shell console cli', icon: <TerminalIcon size={16} />, run: () => os.toggleTerminal(true) },
    ]
    const fun: Cmd[] = [
      { id: 'random', group: 'Fun', label: 'Random project', keywords: 'surprise shuffle', icon: <Shuffle size={16} />, run: os.randomProject },
      { id: 'egg', group: 'Fun', label: 'Easter egg', keywords: 'secret konami', icon: <Sparkle size={16} />, run: os.easterEgg },
    ]
    return [...nav, ...work, ...links, ...prefsCmds, ...fun]
  }, [os, prefs])

  const filtered = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (!terms.length) return commands
    return commands.filter((c) => {
      const hay = `${c.label} ${c.group} ${c.hint ?? ''} ${c.keywords ?? ''}`.toLowerCase()
      return terms.every((t) => hay.includes(t))
    })
  }, [commands, query])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    const dlg = dialog.current
    if (!dlg) return
    const returnFocus = document.activeElement as HTMLElement | null
    dlg.showModal()
    void dlg.offsetWidth
    dlg.classList.add('is-open')
    input.current?.focus()
    return () => {
      if (dlg.open) dlg.close()
      returnFocus?.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const run = (cmd?: Cmd) => {
    if (!cmd) return
    onClose()
    // Let the palette unmount (and restore focus) before the action opens anything else.
    window.setTimeout(cmd.run, motionEnabled() ? 30 : 0)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (filtered.length ? (a + 1) % filtered.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (filtered.length ? (a - 1 + filtered.length) % filtered.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(filtered[active])
    }
  }

  let lastGroup = ''

  return (
    <dialog
      ref={dialog}
      className="palette"
      aria-label="Command palette"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="palette-panel">
        <div className="palette-search">
          <Search size={17} />
          <input
            ref={input}
            className="palette-input"
            placeholder="Type a command or search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={filtered[active] ? `cmd-${filtered[active].id}` : undefined}
            aria-autocomplete="list"
            spellCheck={false}
          />
          <kbd className="palette-esc mono">esc</kbd>
        </div>

        <ul className="palette-list" id="palette-list" role="listbox" ref={list} aria-label="Commands">
          {filtered.length === 0 && <li className="palette-empty mono">No command matches “{query}”. Try “resume”, “react” or “theme”.</li>}
          {filtered.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : null
            lastGroup = c.group
            return (
              <li key={c.id} role="presentation">
                {header && (
                  <p className="palette-group mono" role="presentation">
                    {header}
                  </p>
                )}
                <div
                  id={`cmd-${c.id}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === active}
                  className={`palette-item ${i === active ? 'is-active' : ''}`}
                  onPointerMove={() => i !== active && setActive(i)}
                  onClick={() => run(c)}
                >
                  <span className="palette-icon">{c.icon}</span>
                  <span className="palette-label">{c.label}</span>
                  {c.hint && <span className="palette-hint mono">{c.hint}</span>}
                  {c.id === 'github' || c.id === 'linkedin' ? <ArrowUpRight size={14} className="palette-ext" /> : null}
                </div>
              </li>
            )
          })}
        </ul>

        <div className="palette-foot mono">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> select
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
          <span className="palette-brand">PRIYA.OS</span>
        </div>
      </div>
    </dialog>
  )
}
