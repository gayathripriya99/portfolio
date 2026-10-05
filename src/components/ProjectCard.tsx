import type { CSSProperties, PointerEvent } from 'react'
import type { Project } from '../data/portfolio'
import { ArrowRight, ArrowUpRight, Github } from './Icons'
import { ProjectPreview } from './ProjectPreview'

interface Props {
  project: Project
  onOpen: (slug: string) => void
}

// Track the mouse so the border glow follows it, without a React re-render.
function trackPointer(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export function ProjectCard({ project, onOpen }: Props) {
  return (
    <article className={`project-card ${project.featured ? 'project-card--featured' : ''}`} onPointerMove={trackPointer}>
      <ProjectPreview kind={project.preview} />
      <div className="project-body">
        <p className="project-role mono">
          {project.featured && <span className="project-flag">Featured</span>}
          {project.role}
        </p>
        <h3 className="project-title">
          <button type="button" className="project-open" onClick={() => onOpen(project.slug)} aria-haspopup="dialog">
            {project.title}
          </button>
        </h3>
        <p className="project-tagline">{project.tagline}</p>
        <ul className="badges" aria-label="Technologies">
          {project.tags.map((t, i) => (
            <li key={t} className="badge" style={{ '--bi': i } as CSSProperties}>
              {t}
            </li>
          ))}
        </ul>
        <div className="project-foot">
          <span className="project-cta" aria-hidden="true">
            Read case study
            <ArrowRight size={16} className="btn-icon" />
          </span>
          <span className="project-links">
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noopener" className="icon-link" aria-label={`${project.title} on GitHub`}>
                <Github size={18} />
              </a>
            )}
            {project.links.live && (
              <a href={project.links.live} target="_blank" rel="noopener" className="icon-link" aria-label={`${project.title} live demo`}>
                <ArrowUpRight size={18} />
              </a>
            )}
          </span>
        </div>
      </div>
    </article>
  )
}
