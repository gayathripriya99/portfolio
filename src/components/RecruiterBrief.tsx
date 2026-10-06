import { profile } from '../data/profile'
import { featuredSlugs, projects } from '../data/projects'
import { useOS } from '../lib/os'
import { ArrowRight, ArrowUpRight, Copy, Download, Github, Linkedin, Mail } from './Icons'

/** The 30-second version of the profile. Replaces the hero while recruiter mode is on. */
export function RecruiterBrief() {
  const os = useOS()
  const featured = featuredSlugs.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean)

  return (
    <section id="home" className="brief" aria-labelledby="brief-title">
      <div className="container">
        <div className="brief-card">
          <div className="brief-bar mono">
            <span>
              <span className="live-dot" aria-hidden="true" /> RECRUITER MODE — the 30-second version
            </span>
            <button type="button" className="brief-exit" onClick={os.toggleRecruiter}>
              Exit to full experience
            </button>
          </div>

          <div className="brief-grid">
            <div className="brief-id">
              <h1 id="brief-title" className="brief-name">
                {profile.name}
              </h1>
              <p className="brief-role">
                {profile.role} · {profile.yearsLabel} experience
              </p>
              <p className="brief-summary">{profile.summary}</p>
              <div className="brief-actions">
                <a className="btn btn--primary" href={profile.resumeUrl} target="_blank" rel="noopener">
                  View résumé <ArrowUpRight size={16} className="btn-icon btn-icon--diag" />
                </a>
                <a className="btn btn--ghost" href={profile.resumeUrl} download={profile.resumeFile}>
                  <Download size={16} className="btn-icon btn-icon--down" /> Download
                </a>
                <a className="btn btn--ghost" href={`mailto:${profile.email}`}>
                  <Mail size={16} /> Email
                </a>
                <button type="button" className="btn btn--text" onClick={os.copyEmail} aria-label={`Copy ${profile.email}`}>
                  <Copy size={16} /> {profile.email}
                </button>
              </div>
            </div>

            <dl className="brief-facts">
              <div>
                <dt className="mono">Experience</dt>
                <dd>{profile.yearsLabel} · since Sep 2022</dd>
              </div>
              <div>
                <dt className="mono">Current</dt>
                <dd>Software Engineer (Trainee) · Lingotran</dd>
              </div>
              <div>
                <dt className="mono">Availability</dt>
                <dd className="brief-available">Open to opportunities</dd>
              </div>
              <div>
                <dt className="mono">Location</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt className="mono">Education</dt>
                <dd>
                  {profile.education.degree}, {profile.education.year}
                </dd>
              </div>
              <div>
                <dt className="mono">Links</dt>
                <dd className="brief-links">
                  <a href={profile.github} target="_blank" rel="noopener" className="link-underline">
                    <Github size={15} /> GitHub
                  </a>
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener" className="link-underline">
                      <Linkedin size={15} /> LinkedIn
                    </a>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="brief-cols">
            <div>
              <p className="brief-h mono">Primary skills</p>
              <ul className="chips">
                {profile.primarySkills.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
              <p className="brief-h mono">Target roles</p>
              <ul className="chips chips--quiet">
                {profile.targetRoles.map((r) => (
                  <li key={r} className="chip">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="brief-h mono">Strongest projects</p>
              <ol className="brief-projects">
                {featured.map((p, i) => (
                  <li key={p.slug}>
                    <button type="button" onClick={() => os.openProject(p.slug)}>
                      <span className="mono brief-num">0{i + 1}</span>
                      <span>
                        <span className="brief-ptitle">{p.title}</span>
                        <span className="brief-pmeta mono">{p.type}</span>
                        <span className="brief-pimpact">{p.impact}</span>
                      </span>
                      <ArrowRight size={16} className="btn-icon" />
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
