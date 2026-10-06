import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { projectsUsing } from '../data/projects'
import { categories, skills, type SkillCategory } from '../data/skills'
import { useOS } from '../lib/os'
import { CategoryIcons } from './Icons'
import { Reveal } from './Reveal'
import { Section } from './Section'

export const FOCUS_EVENT = 'priyaos:focus-category'

export function Stack() {
  const os = useOS()
  const [selected, setSelected] = useState('React')
  const [focused, setFocused] = useState<SkillCategory | null>(null)

  // The hero's status panel can point the map at a category.
  useEffect(() => {
    let t: number | undefined
    const onFocus = (e: Event) => {
      const cat = (e as CustomEvent<SkillCategory>).detail
      setFocused(cat)
      const first = skills.find((s) => s.category === cat)
      if (first) setSelected(first.name)
      window.clearTimeout(t)
      t = window.setTimeout(() => setFocused(null), 2400)
    }
    window.addEventListener(FOCUS_EVENT, onFocus)
    return () => {
      window.removeEventListener(FOCUS_EVENT, onFocus)
      window.clearTimeout(t)
    }
  }, [])

  const skill = skills.find((s) => s.name === selected) ?? skills[0]
  const related = useMemo(() => projectsUsing(skill.name), [skill.name])
  const neighbours = useMemo(() => new Set(related.flatMap((p) => p.tech).filter((t) => t !== skill.name)), [related, skill.name])
  const category = categories.find((c) => c.id === skill.category)!

  return (
    <Section
      id="stack"
      index="04"
      label="Stack"
      path="~/stack"
      title={
        <>
          Technology <em>map</em>
        </>
      }
      intro="No percentage bars — just evidence. Hover or tap a technology to see where I’ve used it; related tools light up."
    >
      <div className="techmap">
        <div className="techmap-grid">
          {categories.map((cat, ci) => {
            const Icon = CategoryIcons[cat.id]
            const items = skills.filter((s) => s.category === cat.id)
            return (
              <Reveal key={cat.id} id={`stack-${cat.id}`} className={`tm-cat ${focused === cat.id ? 'is-focused' : ''}`} delay={(ci % 3) * 70}>
                <header className="tm-head">
                  <span className="tm-icon">
                    <Icon size={18} />
                  </span>
                  <span className="tm-label mono">{cat.label.toUpperCase()}</span>
                  <span className="tm-count mono">{String(items.length).padStart(2, '0')}</span>
                </header>
                <p className="tm-blurb">{cat.blurb}</p>
                <ul className="tm-items chips--stagger">
                  {items.map((s, i) => (
                    <li key={s.name} className="chip-slot" style={{ '--ci': i } as CSSProperties}>
                      <button
                        type="button"
                        className={`tm-tech ${selected === s.name ? 'is-active' : ''} ${neighbours.has(s.name) ? 'is-related' : ''}`}
                        onPointerEnter={(e) => e.pointerType === 'mouse' && setSelected(s.name)}
                        onFocus={() => setSelected(s.name)}
                        onClick={() => setSelected(s.name)}
                        aria-pressed={selected === s.name}
                      >
                        {s.name}
                        {s.since && <span className="tm-pro" aria-label="used professionally" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </div>

        <aside className="tm-inspector" aria-live="polite">
          <p className="tm-insp-label mono">
            <span className="explorer-dot" aria-hidden="true" /> inspector
          </p>
          <h3 className="tm-insp-name" key={skill.name}>
            {skill.name}
          </h3>
          <dl className="tm-insp-dl">
            <div>
              <dt className="mono">Category</dt>
              <dd>{category.label}</dd>
            </div>
            <div>
              <dt className="mono">Experience</dt>
              <dd>{skill.since ? `Professional use since ${skill.since}` : related.length ? 'Project experience' : 'Working knowledge'}</dd>
            </div>
            <div>
              <dt className="mono">Used at</dt>
              <dd>{skill.usedAt?.join(', ') ?? (related.length ? 'Personal & integration projects' : '—')}</dd>
            </div>
            <div>
              <dt className="mono">Projects</dt>
              <dd>
                {related.length ? (
                  <ul className="tm-insp-projects">
                    {related.map((p) => (
                      <li key={p.slug}>
                        <button type="button" className="link-underline" onClick={() => os.openProject(p.slug)}>
                          {p.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  '—'
                )}
              </dd>
            </div>
          </dl>
          <p className="tm-legend mono">
            <span className="tm-pro" aria-hidden="true" /> used professionally at Lingotran
          </p>
        </aside>
      </div>
    </Section>
  )
}
