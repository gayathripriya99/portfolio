import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { About } from './components/About'
import { Background } from './components/Background'
import { Boot, BOOT_KEY } from './components/Boot'
import { CaseStudy } from './components/CaseStudy'
import { CommandPalette } from './components/CommandPalette'
import { Contact, Footer } from './components/Contact'
import { Experience } from './components/Experience'
import { Hero } from './components/Hero'
import { TerminalIcon } from './components/Icons'
import { Lab } from './components/Lab'
import { Nav } from './components/Nav'
import { RecruiterBrief } from './components/RecruiterBrief'
import { ScrollProgress } from './components/ScrollProgress'
import { FOCUS_EVENT, Stack } from './components/Stack'
import { Terminal } from './components/Terminal'
import { Toasts } from './components/Toasts'
import { Work } from './components/Work'
import { profile, type SectionId } from './data/profile'
import { projects } from './data/projects'
import { motionEnabled } from './lib/motion'
import { OSContext, type OS } from './lib/os'
import { getPrefs, setRecruiter, setReducedMotion, setTheme, usePrefs } from './lib/prefs'
import { toast } from './lib/toast'

const HASH_PREFIX = '#project-'
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

function slugFromHash() {
  const hash = window.location.hash
  if (!hash.startsWith(HASH_PREFIX)) return null
  const slug = hash.slice(HASH_PREFIX.length)
  return projects.some((p) => p.slug === slug) ? slug : null
}

function shouldBoot() {
  if (!motionEnabled() || getPrefs().recruiter || slugFromHash()) return false
  try {
    return !sessionStorage.getItem(BOOT_KEY)
  } catch {
    return false
  }
}

function isTyping(el: EventTarget | null) {
  return el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
}

export default function App() {
  const prefs = usePrefs()
  const [openSlug, setOpenSlug] = useState<string | null>(slugFromHash)
  const [palette, setPalette] = useState(false)
  const [terminal, setTerminal] = useState(false)
  const [booting, setBooting] = useState(shouldBoot)

  // Hold the hero's entrance animation until the boot sequence hands over.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('booting', booting)
  }, [booting])

  useEffect(() => {
    const onPop = () => setOpenSlug(slugFromHash())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const openProject = useCallback((slug: string) => {
    if (history.state?.caseStudy) history.replaceState({ caseStudy: slug }, '', `${HASH_PREFIX}${slug}`)
    else history.pushState({ caseStudy: slug }, '', `${HASH_PREFIX}${slug}`)
    setOpenSlug(slug)
  }, [])

  const closeProject = useCallback(() => {
    if (history.state?.caseStudy) history.back()
    else {
      history.replaceState(null, '', `${location.pathname}${location.search}`)
      setOpenSlug(null)
    }
  }, [])

  const os = useMemo<OS>(
    () => ({
      goTo: (id: SectionId) => {
        if (id === 'lab' && getPrefs().recruiter) {
          toast('Lab is hidden in recruiter mode', 'Exit recruiter mode to see experiments.')
          return
        }
        document.getElementById(id)?.scrollIntoView({ behavior: motionEnabled() ? 'smooth' : 'auto', block: 'start' })
      },
      openProject,
      randomProject: () => {
        const others = projects.filter((p) => p.slug !== slugFromHash())
        const pick = others[Math.floor(Math.random() * others.length)]
        toast('Random project', pick.title)
        openProject(pick.slug)
      },
      openResume: (download?: boolean) => {
        if (download) {
          const a = document.createElement('a')
          a.href = profile.resumeUrl
          a.download = profile.resumeFile
          a.click()
        } else window.open(profile.resumeUrl, '_blank', 'noopener')
      },
      openPalette: () => setPalette(true),
      toggleTerminal: (open?: boolean) => setTerminal((t) => open ?? !t),
      toggleTheme: () => {
        const next = getPrefs().theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        toast(`theme → ${next}`)
      },
      toggleMotion: () => {
        const reduced = !getPrefs().reducedMotion
        setReducedMotion(reduced)
        toast(`reduced motion → ${reduced ? 'on' : 'off'}`)
      },
      toggleRecruiter: () => {
        const on = !getPrefs().recruiter
        setRecruiter(on)
        if (on) setTerminal(false)
        window.scrollTo({ top: 0, behavior: 'instant' })
        toast(on ? 'Recruiter mode on' : 'Full experience restored', on ? 'Concise profile, no experiments.' : undefined)
      },
      focusCategory: (c) => {
        document.getElementById(`stack-${c}`)?.scrollIntoView({ behavior: motionEnabled() ? 'smooth' : 'auto', block: 'center' })
        window.dispatchEvent(new CustomEvent(FOCUS_EVENT, { detail: c }))
      },
      copyEmail: () => {
        navigator.clipboard
          ?.writeText(profile.email)
          .then(() => toast('Email copied', profile.email))
          .catch(() => (window.location.href = `mailto:${profile.email}`))
      },
      easterEgg: () => {
        const root = document.documentElement
        root.classList.add('egg')
        window.setTimeout(() => root.classList.remove('egg'), 2600)
        toast('achievement unlocked: curious engineer', 'You found the hidden mode. Try `sudo hire priya` in the terminal.')
      },
    }),
    [openProject],
  )

  // Global shortcuts: ⌘K / Ctrl+K palette, ` terminal, and one Konami code.
  useEffect(() => {
    let konami = 0
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((p) => !p)
        return
      }
      if (isTyping(e.target)) return
      if (e.key === '`') {
        e.preventDefault()
        setTerminal((t) => !t)
      }
      konami = e.key === KONAMI[konami] ? konami + 1 : e.key === KONAMI[0] ? 1 : 0
      if (konami === KONAMI.length) {
        konami = 0
        os.easterEgg()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [os])

  const project = projects.find((p) => p.slug === openSlug)

  return (
    <OSContext.Provider value={os}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Background />
      <ScrollProgress />
      <Nav />
      <main id="main">
        {prefs.recruiter ? <RecruiterBrief /> : <Hero />}
        <Work />
        <Experience />
        <Stack />
        {!prefs.recruiter && <Lab />}
        <About />
        <Contact />
      </main>
      <Footer />

      {!prefs.recruiter && (
        <button type="button" className={`term-launcher mono ${terminal ? 'is-hidden' : ''}`} onClick={() => setTerminal(true)} aria-label="Open terminal">
          <TerminalIcon size={16} /> <span>terminal</span> <kbd>`</kbd>
        </button>
      )}
      <Terminal open={terminal} onClose={() => setTerminal(false)} />
      {palette && <CommandPalette onClose={() => setPalette(false)} />}
      {project && <CaseStudy key={project.slug} project={project} onClose={closeProject} onNavigate={openProject} />}
      <Toasts />
      {booting && <Boot onDone={() => setBooting(false)} />}
    </OSContext.Provider>
  )
}
