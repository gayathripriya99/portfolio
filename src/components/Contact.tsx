import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/portfolio'
import { ArrowRight, ArrowUp, Check, Copy, Download, Github, Linkedin, Mail } from './Icons'
import { Reveal } from './Reveal'

export function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  const socials = [
    { href: profile.socials.github, label: 'GitHub', Icon: Github },
    { href: profile.socials.linkedin, label: 'LinkedIn', Icon: Linkedin },
  ].filter((s) => s.href)

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal variant="scale" className="contact-card">
          <div className="contact-glow" aria-hidden="true" />
          <Reveal as="p" className="eyebrow" delay={80}>
            <span className="mono">04</span>
            <span className="eyebrow-rule" aria-hidden="true" />
            Contact
          </Reveal>
          <Reveal as="h2" id="contact-title" className="contact-title" delay={140}>
            Let’s build something useful.
          </Reveal>
          <Reveal as="p" className="contact-intro" delay={200}>
            I’m open to full-stack and AI engineering roles. The fastest way to reach me is email — I usually reply within a day.
          </Reveal>

          <Reveal className="contact-actions" delay={260}>
            <a className="btn btn--primary btn--lg" href={`mailto:${profile.email}`}>
              <Mail size={18} />
              {profile.email}
              <ArrowRight size={17} className="btn-icon" />
            </a>
            <button type="button" className={`btn btn--ghost btn--lg copy-btn ${copied ? 'is-copied' : ''}`} onClick={copyEmail}>
              <span className="copy-icons" aria-hidden="true">
                <Copy size={17} className="copy-icon copy-icon--copy" />
                <Check size={17} className="copy-icon copy-icon--check" />
              </span>
              <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
            </button>
          </Reveal>

          <Reveal className="contact-links" delay={320}>
            <a className="link-underline" href={profile.resumeUrl} target="_blank" rel="noopener">
              <Download size={16} /> Résumé (PDF)
            </a>
            {socials.map(({ href, label, Icon }) => (
              <a key={label} className="link-underline" href={href} target="_blank" rel="noopener">
                <Icon size={16} /> {label}
              </a>
            ))}
          </Reveal>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} {profile.name}. Designed &amp; built with React and TypeScript.
        </p>
        <a href="#top" className="footer-top">
          Back to top <ArrowUp size={15} className="btn-icon btn-icon--up" />
        </a>
      </div>
    </footer>
  )
}
