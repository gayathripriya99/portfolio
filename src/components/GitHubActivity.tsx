import { useEffect, useRef, useState, type CSSProperties } from 'react'
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

interface Commit {
  repo: string
  message: string
  date: string
  url: string
}

interface Data {
  publicRepos: number
  since: string
  repos: Repo[]
  commits: Commit[]
}

const CACHE_KEY = 'priyaos:github:v2'
const TTL = 60 * 60 * 1000
const WEEKS = 13
const DAY = 86_400_000

function ago(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / DAY)
  if (days < 1) return 'today'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

const dayKey = (d: Date) => d.toISOString().slice(0, 10)

async function getJSON(url: string) {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  return res.json()
}

async function load(): Promise<Data> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
    if (cached && Date.now() - cached.t < TTL) return cached.data
  } catch {
    /* ignore */
  }
  const user = profile.githubUser
  const [u, all] = await Promise.all([getJSON(`https://api.github.com/users/${user}`), getJSON(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=12`)])
  const repos = (all as Repo[]).filter((r) => !r.fork)
  const since = new Date(Date.now() - WEEKS * 7 * DAY).toISOString()

  // Real commits authored by me on the most recently pushed repos — powers the matrix and the list.
  const perRepo = await Promise.all(
    repos.slice(0, 4).map((r) =>
      getJSON(`https://api.github.com/repos/${user}/${r.name}/commits?author=${user}&since=${since}&per_page=100`)
        .then((list: { sha: string; html_url: string; commit: { message: string; author: { date: string } } }[]) =>
          list.map((c) => ({ repo: r.name, message: c.commit.message.split('\n')[0], date: c.commit.author.date, url: c.html_url })),
        )
        .catch(() => [] as Commit[]),
    ),
  )
  const commits = perRepo.flat().sort((a, b) => b.date.localeCompare(a.date))
  const data = { publicRepos: u.public_repos, since: String(new Date(u.created_at).getFullYear()), repos, commits }
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data }))
  } catch {
    /* ignore */
  }
  return data
}

function Matrix({ commits }: { commits: Commit[] }) {
  const counts = new Map<string, number>()
  commits.forEach((c) => {
    const k = dayKey(new Date(c.date))
    counts.set(k, (counts.get(k) ?? 0) + 1)
  })
  // Columns are weeks (oldest → newest), rows are days; the last column ends today.
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const start = new Date(today.getTime() - (WEEKS * 7 - 1 - (6 - today.getUTCDay())) * DAY)
  const cells = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const d = new Date(start.getTime() + i * DAY)
    const n = d > today ? -1 : (counts.get(dayKey(d)) ?? 0)
    return { key: dayKey(d), n }
  })
  const level = (n: number) => (n <= 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4)
  const activeDays = cells.filter((c) => c.n > 0).length

  return (
    <figure className="gh-matrix-wrap">
      <div className="gh-matrix" role="img" aria-label={`${commits.length} commits on ${activeDays} days in the last ${WEEKS} weeks`}>
        {cells.map((c, i) => (
          <span
            key={c.key}
            className={`gh-cell gh-cell--${c.n < 0 ? 'future' : level(c.n)}`}
            style={{ '--ci': i } as CSSProperties}
            title={c.n >= 0 ? `${c.key}: ${c.n} commit${c.n === 1 ? '' : 's'}` : undefined}
          />
        ))}
      </div>
      <figcaption className="gh-matrix-cap mono">
        <span>
          {commits.length} commits · {activeDays} active days · last {WEEKS} weeks
        </span>
        <span className="gh-scale" aria-hidden="true">
          less
          {[0, 1, 2, 3, 4].map((l) => (
            <i key={l} className={`gh-cell gh-cell--${l}`} />
          ))}
          more
        </span>
      </figcaption>
    </figure>
  )
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
      { rootMargin: '400px' },
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
    <div className={`gh ${state.status === 'ok' ? 'is-loaded' : ''}`} ref={ref}>
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
          <p className="gh-h mono">Contribution matrix</p>
          <Matrix commits={data.commits} />

          <dl className="gh-stats mono">
            <div>
              <dt>public repos</dt>
              <dd>{data.publicRepos}</dd>
            </div>
            <div>
              <dt>languages</dt>
              <dd>{langs.length}</dd>
            </div>
            <div>
              <dt>on github since</dt>
              <dd>{data.since}</dd>
            </div>
          </dl>

          {langs.length > 0 && (
            <div className="gh-langs">
              <div className="gh-langbar" aria-hidden="true">
                {langs.map(([l, c], i) => (
                  <span key={l} style={{ flexGrow: c, opacity: 1 - i * 0.18 }} />
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

          {data.commits.length > 0 && (
            <>
              <p className="gh-h mono">Recent commits</p>
              <ul className="gh-commits mono">
                {data.commits.slice(0, 5).map((c) => (
                  <li key={c.url}>
                    <a href={c.url} target="_blank" rel="noopener">
                      <span className="gh-commit-msg">{c.message}</span>
                      <span className="gh-commit-meta">
                        {c.repo} · {ago(c.date)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="gh-h mono">Repositories</p>
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
            {state.status === 'error'
              ? 'GitHub API unavailable right now — the profile is one click away.'
              : state.status === 'loading'
                ? 'fetching public activity…'
                : 'standing by'}
          </p>
          <a className="btn btn--ghost btn--sm" href={profile.github} target="_blank" rel="noopener">
            <Github size={15} /> View GitHub profile
          </a>
        </div>
      )}
    </div>
  )
}
