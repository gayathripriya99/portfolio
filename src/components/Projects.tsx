import { projects } from '../data/portfolio'
import { ProjectCard } from './ProjectCard'
import { Reveal } from './Reveal'
import { Section } from './Section'

export function Projects({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <Section
      id="projects"
      index="02"
      eyebrow="Projects"
      title="Selected work"
      intro="Each project opens into a short case study — the problem, the architecture and the decisions behind it."
    >
      <ul className="projects-grid">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={i * 90} className={p.featured ? 'projects-grid-featured' : undefined}>
            <ProjectCard project={p} onOpen={onOpen} />
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
