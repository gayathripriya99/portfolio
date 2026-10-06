import { profile } from '../data/profile'
import { useOS } from '../lib/os'
import { ArrowRight, ArrowUpRight, Copy, Download, Github, Linkedin, Mail } from './Icons'
import { isMac } from './Nav'
import { Reveal } from './Reveal'

export function Contact() {
  const os = useOS()
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className="sec-meta mono" variant="fade">
          <span className="sec-index">07 / CONTACT</span>
          <span className="sec-rule" aria-hidden="true" />
          <span className="sec-path">~/contact</span>
        </Reveal>

        <div className="contact-grid">
          <div>
            <Reveal as="h2" id="contact-title" className="contact-title" delay={60}>
              Let’s build something <em>useful</em>.
            </Reveal>
            <Reveal as="p" className="contact-intro" delay={120}>
              I’m open to Software Engineer, Frontend, React / Node.js, Full-stack and AI-enabled application roles. Email is the fastest way to reach me.
            </Reveal>
            <Reveal className="contact-actions" delay={180}>
              <a className="btn btn--primary btn--lg" href={`mailto:${profile.email}`}>
                <Mail size={18} /> {profile.email} <ArrowRight size={17} className="btn-icon" />
              </a>
              <button type="button" className="btn btn--ghost btn--lg" onClick={os.copyEmail}>
                <Copy size={17} /> Copy
              </button>
            </Reveal>
          </div>

          <Reveal as="ul" className="contact-list mono" delay={160}>
            <li>
              <a href={profile.resumeUrl} target="_blank" rel="noopener">
                <span>résumé.pdf</span>
                <span className="contact-act">
                  view <ArrowUpRight size={13} />
                </span>
              </a>
            </li>
            <li>
              <a href={profile.resumeUrl} download={profile.resumeFile}>
                <span>résumé.pdf</span>
                <span className="contact-act">
                  download <Download size={13} />
                </span>
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noopener">
                <span>
                  <Github size={14} /> github
                </span>
                <span className="contact-act">@{profile.githubUser}</span>
              </a>
            </li>
            {profile.linkedin && (
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener">
                  <span>
                    <Linkedin size={14} /> linkedin
                  </span>
                  <span className="contact-act">
                    open <ArrowUpRight size={13} />
                  </span>
                </a>
              </li>
            )}
            <li>
              <button type="button" onClick={os.openPalette}>
                <span>command palette</span>
                <span className="contact-act">
                  <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
                  <kbd>K</kbd>
                </span>
              </button>
            </li>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const os = useOS()
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-mark" aria-hidden="true">
          PRIYA<span>.</span>OS
        </p>
        <div className="footer-row mono">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>
            built with React 19 + TypeScript ·{' '}
            <a href={profile.repo} target="_blank" rel="noopener" className="link-underline">
              source
            </a>
          </span>
          <button type="button" className="footer-term" onClick={() => os.toggleTerminal(true)}>
            try the terminal <kbd>`</kbd>
          </button>
        </div>
      </div>
    </footer>
  )
}
