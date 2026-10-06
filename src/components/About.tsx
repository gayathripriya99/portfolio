import { profile } from '../data/profile'
import { usePrefs } from '../lib/prefs'
import { GitHubActivity } from './GitHubActivity'
import { Reveal } from './Reveal'
import { Section } from './Section'

export function About() {
  const { recruiter } = usePrefs()
  return (
    <Section
      id="about"
      index="06"
      label="About"
      path="~/about"
      title={
        <>
          The person behind <em>the prompt</em>
        </>
      }
    >
      <div className="about">
        <div className="about-copy">
          {(recruiter ? profile.about.slice(0, 1) : profile.about).map((p, i) => (
            <Reveal as="p" key={i} className={i === 0 ? 'about-lead' : undefined} delay={i * 60}>
              {p}
            </Reveal>
          ))}

          <Reveal as="dl" className="about-facts" delay={120}>
            <div>
              <dt className="mono">Based in</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt className="mono">Experience</dt>
              <dd>{profile.yearsLabel} · industry since 2022</dd>
            </div>
            <div>
              <dt className="mono">Education</dt>
              <dd>
                {profile.education.degree}
                <br />
                <span className="about-sub">
                  {profile.education.school} · {profile.education.year}
                </span>
              </dd>
            </div>
            <div>
              <dt className="mono">Looking for</dt>
              <dd>{profile.targetRoles.slice(0, 5).join(' · ')}</dd>
            </div>
          </Reveal>
        </div>

        <Reveal className="about-side" delay={100}>
          <GitHubActivity />
        </Reveal>
      </div>
    </Section>
  )
}
