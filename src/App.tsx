import { useCallback, useEffect, useState } from 'react'
import { Background } from './components/Background'
import { CaseStudy } from './components/CaseStudy'
import { Contact, Footer } from './components/Contact'
import { Experience } from './components/Experience'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Projects } from './components/Projects'
import { ScrollProgress } from './components/ScrollProgress'
import { SectionDivider } from './components/Section'
import { Skills } from './components/Skills'
import { projects } from './data/portfolio'

const HASH_PREFIX = '#project-'

function slugFromHash() {
  const hash = window.location.hash
  if (!hash.startsWith(HASH_PREFIX)) return null
  const slug = hash.slice(HASH_PREFIX.length)
  return projects.some((p) => p.slug === slug) ? slug : null
}

export default function App() {
  // Case studies are deep-linkable and close with the browser/phone back button.
  const [openSlug, setOpenSlug] = useState<string | null>(slugFromHash)

  useEffect(() => {
    const onPop = () => setOpenSlug(slugFromHash())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const open = useCallback((slug: string) => {
    history.pushState({ caseStudy: slug }, '', `${HASH_PREFIX}${slug}`)
    setOpenSlug(slug)
  }, [])

  const close = useCallback(() => {
    if (history.state?.caseStudy) {
      history.back()
    } else {
      history.replaceState(null, '', `${location.pathname}${location.search}`)
      setOpenSlug(null)
    }
  }, [])

  const project = projects.find((p) => p.slug === openSlug)

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Background />
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Projects onOpen={open} />
        <SectionDivider />
        <Experience />
        <Contact />
      </main>
      <Footer />
      {project && <CaseStudy key={project.slug} project={project} onClose={close} />}
    </>
  )
}
