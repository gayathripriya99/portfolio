import type { CSSProperties } from 'react'
import { skills } from '../data/portfolio'
import { SkillIcons } from './Icons'
import { Reveal } from './Reveal'
import { Section } from './Section'

export function Skills() {
  return (
    <Section
      id="skills"
      index="01"
      eyebrow="Skills"
      title="Tools I reach for"
      intro="Grouped by where they sit in the stack — from the interface down to the data and the infrastructure it runs on."
    >
      <ul className="skills-grid">
        {skills.map((group, gi) => {
          const GroupIcon = SkillIcons[group.icon]
          return (
            <Reveal as="li" key={group.title} className="skill-card" delay={(gi % 3) * 80 + Math.floor(gi / 3) * 60}>
              <div className="skill-card-head">
                <span className="skill-icon">
                  <GroupIcon size={20} />
                </span>
                <h3>{group.title}</h3>
              </div>
              <p className="skill-blurb">{group.blurb}</p>
              <ul className="chips chips--stagger" aria-label={`${group.title} technologies`}>
                {group.items.map((item, i) => (
                  <li key={item} className="chip" style={{ '--ci': i } as CSSProperties}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}
