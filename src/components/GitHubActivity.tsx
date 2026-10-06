import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { ArrowUpRight, Github } from './Icons'

interface Repo {
  name: string
  html_url: string
  description: string | null
  language: string | null
  pushed_at: string
  fork: boolean
}

interface Data {
  publicRepos: number
  followers: number
  since: string
  repos: Repo[]
}

const CACHE_KEY = 'priyaos:github'
const TTL = 60 * 60 * 1000

function ago(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days < 1) return 'today'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

async function load(): Promise<Data> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
    if (cached && Date.now() - cached.t < TTL) return cached.data
  } catch {
    /* ignore */
  }
  const base = `https://api.github.com/users/${profile.githubUser}`
  const [u, r] = await Promise.all([fetch(base), fetch(`${base}/repos?sort=pushed&per_page=12`)])
  if (!u.ok || !r.ok) throw new Error('GitHub unavailable')
  const user = await u.json()
  const repos: Repo[] = (await r.json()).filter((x: Repo) => !x.fork)
  const data = { publicRepos: user.public_repos, followers: user.followers, since: String(new Date(user.created_at).getFullYear()), repos }
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data }))
  } catch {
    /* ignore */
  }
  return data
}

/** Public GitHub data, fetched only when the panel nears the viewport. The page never depends on it. */
export function GitHubActivity() {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<{ status: 'idle' | 'loading' | 'ok' | 'error'; data?: Data }>({ status: 'idle' })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        setState({ status: 'loading' })
        load()
          .then((data) => setState({ status: 'ok', data }))
          .catch(() => setState({ status: 'error' }))
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const data = state.data
  const langs = data
    ? Object.entries(
        data.repos.reduce<Record<string, number>>((acc, r) => {
          if (r.language) acc[r.language] = (acc[r.language] ?? 0) + 1
          return acc
        }, {}),
      ).sort((a, b) => b[1] - a[1])
    : []
  const langTotal = langs.reduce((n, [, c]) => n + c, 0)

  return (
    <div className="gh" ref={ref}>
      <div className="gh-bar mono">
        <span>
          <Github size={14} /> activity
        </span>
        <a href={profile.github} target="_blank" rel="noopener" className="gh-handle">
          @{profile.githubUser} <ArrowUpRight size={12} />
        </a>
      </div>

      {state.status === 'ok' && data ? (
        <div className="gh-body">
          <dl className="gh-stats mono">
            <div>
              <dt>repos</dt>
              <dd>{data.publicRepos}</dd>
            </div>
            <div>
              <dt>followers</dt>
              <dd>{data.followers}</dd>
            </div>
            <div>
              <dt>since</dt>
              <dd>{data.since}</dd>
            </div>
          </dl>
          {langs.length > 0 && (
            <div className="gh-langs">
              <div className="gh-langbar" aria-hidden="true">
                {langs.map(([l, c], i) => (
                  <span key={l} style={{ flexGrow: c, opacity: 1 - i * 0.16 }} />
                ))}
              </div>
              <p className="gh-langlist mono">
                {langs.map(([l, c]) => (
                  <span key={l}>
                    {l} {Math.round((c / langTotal) * 100)}%
                  </span>
                ))}
              </p>
            </div>
          )}
          <ul className="gh-repos">
            {data.repos.slice(0, 4).map((r) => (
              <li key={r.name}>
                <a href={r.html_url} target="_blank" rel="noopener">
                  <span className="gh-repo-name mono">{r.name}</span>
                  {r.description && <span className="gh-repo-desc">{r.description}</span>}
                  <span className="gh-repo-meta mono">
                    {r.language ?? 'repo'} · pushed {ago(r.pushed_at)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="gh-body gh-fallback">
          <p className="mono gh-status">
            {state.status === 'error' ? 'GitHub API unavailable right now — the profile is one click away.' : state.status === 'loading' ? 'fetching public activity…' : 'standing by'}
          </p>
          <a className="btn btn--ghost btn--sm" href={profile.github} target="_blank" rel="noopener">
            <Github size={15} /> View GitHub profile
          </a>
        </div>
      )}
    </div>
  )
}
