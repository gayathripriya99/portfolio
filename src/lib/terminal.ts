import { career } from '../data/career'
import { careerUptime, profile, sections, type SectionId } from '../data/profile'
import { projects, projectsUsing } from '../data/projects'
import { categories, findSkills, skills } from '../data/skills'
import type { OS } from './os'
import { getPrefs } from './prefs'

export type LineKind = 'in' | 'out' | 'muted' | 'accent' | 'err'
export interface Line {
  kind: LineKind
  text: string
}

const out = (text: string, kind: LineKind = 'out'): Line => ({ kind, text })

const HELP: [string, string][] = [
  ['about', 'who I am'],
  ['projects', 'list projects'],
  ['open <n|name>', 'open a project or section'],
  ['experience', 'career as git log'],
  ['skills [query]', 'technology map, e.g. skills react'],
  ['contact', 'how to reach me'],
  ['resume', 'open my résumé'],
  ['github', 'open GitHub'],
  ['theme [dark|light]', 'switch theme'],
  ['recruiter', 'toggle recruiter mode'],
  ['ls · cd · pwd', 'move around'],
  ['clear', 'clear the screen'],
]

export const COMMANDS = ['help', 'about', 'whoami', 'projects', 'open', 'experience', 'skills', 'stack', 'contact', 'resume', 'github', 'linkedin', 'theme', 'recruiter', 'motion', 'ls', 'cd', 'pwd', 'clear', 'date', 'echo', 'sudo']

export interface Result {
  lines: Line[]
  clear?: boolean
  effect?: () => void
}

function findSection(name: string) {
  const n = name.replace(/^~?\/?/, '').toLowerCase()
  return sections.find((s) => s.id === n || s.label.toLowerCase() === n)
}

function findProject(arg: string) {
  const n = Number(arg)
  if (Number.isInteger(n) && n >= 1 && n <= projects.length) return projects[n - 1]
  const a = arg.toLowerCase()
  return projects.find((p) => p.slug === a || p.title.toLowerCase().startsWith(a) || p.slug.startsWith(a))
}

export function run(raw: string, os: OS, cwd: { value: string }): Result {
  const input = raw.trim()
  if (!input) return { lines: [] }
  const [cmd, ...rest] = input.split(/\s+/)
  const arg = rest.join(' ')

  switch (cmd.toLowerCase()) {
    case 'help':
      return {
        lines: [out('Available commands:', 'accent'), ...HELP.map(([c, d]) => out(`  ${c.padEnd(20)} ${d}`)), out('Tip: ↑/↓ history · Tab completes', 'muted')],
      }

    case 'about':
    case 'whoami':
      return {
        lines: [
          out(`${profile.name} — ${profile.role}`, 'accent'),
          out(`${profile.yearsLabel} · uptime ${careerUptime()} · ${profile.location}`),
          out(profile.summary),
          out(`Looking for: ${profile.targetRoles.slice(0, 4).join(', ')}…`, 'muted'),
        ],
      }

    case 'projects':
    case 'ls':
      if (cmd === 'ls' && cwd.value !== '~/work') {
        return { lines: [out(sections.filter((s) => s.id !== 'home').map((s) => `${s.id}/`).join('   ')), out('resume.pdf   contact.txt', 'muted')] }
      }
      return {
        lines: [
          ...projects.map((p, i) => out(`  ${String(i + 1).padStart(2, '0')}  ${p.title.padEnd(36)} ${p.type}`)),
          out("Type 'open 1' to read a case study.", 'muted'),
        ],
      }

    case 'open':
    case 'cd': {
      if (!arg || arg === '~' || arg === '..') {
        cwd.value = '~'
        return { lines: [], effect: cmd === 'open' ? () => os.goTo('home') : undefined }
      }
      const section = findSection(arg)
      if (section) {
        cwd.value = section.path
        return { lines: [out(`→ ${section.path}`, 'muted')], effect: () => os.goTo(section.id as SectionId) }
      }
      const project = findProject(arg)
      if (project) return { lines: [out(`Opening ${project.title}…`, 'muted')], effect: () => os.openProject(project.slug) }
      return { lines: [out(`${cmd}: no such project or section: ${arg}`, 'err')] }
    }

    case 'pwd':
      return { lines: [out(cwd.value.replace('~', '/home/priya'))] }

    case 'experience':
      return {
        lines: career.flatMap((c, i) => [
          out(`${i === 0 ? '*' : '|'} ${c.period.padEnd(20)} ${c.role} @ ${c.company}`, i === 0 ? 'accent' : 'out'),
          ...c.commits.slice(0, 3).map((m) => out(`|   ${m.type}${m.scope ? `(${m.scope})` : ''}: ${m.message}`, 'muted')),
        ]),
      }

    case 'skills':
    case 'stack': {
      if (!arg) {
        return {
          lines: [
            ...categories.map((c) =>
              out(`  ${c.label.toUpperCase().padEnd(16)} ${skills.filter((s) => s.category === c.id).map((s) => s.name).join(', ')}`),
            ),
            out("Try 'skills react' or 'skills mongo'.", 'muted'),
          ],
        }
      }
      const found = findSkills(arg)
      if (!found.length) return { lines: [out(`No skill matches “${arg}”.`, 'err')] }
      return {
        lines: found.slice(0, 4).flatMap((s) => {
          const ps = projectsUsing(s.name)
          return [
            out(s.name, 'accent'),
            out(`  category    ${categories.find((c) => c.id === s.category)!.label}`),
            out(`  experience  ${s.since ? `professional use since ${s.since}` : ps.length ? 'project experience' : 'working knowledge'}`),
            ...(s.usedAt ? [out(`  used at     ${s.usedAt.join(', ')}`)] : []),
            out(`  projects    ${ps.length ? ps.map((p) => p.title).join(', ') : '—'}`),
          ]
        }),
      }
    }

    case 'contact':
      return {
        lines: [out(`email   ${profile.email}`), out(`github  ${profile.github}`), ...(profile.linkedin ? [out(`linkedin ${profile.linkedin}`)] : []), out("Type 'sudo hire priya' for the express lane.", 'muted')],
      }

    case 'resume':
      return { lines: [out('Opening résumé.pdf…', 'muted')], effect: () => os.openResume() }

    case 'github':
      return { lines: [out(`Opening ${profile.github}…`, 'muted')], effect: () => window.open(profile.github, '_blank', 'noopener') }

    case 'linkedin':
      return profile.linkedin
        ? { lines: [out('Opening LinkedIn…', 'muted')], effect: () => window.open(profile.linkedin, '_blank', 'noopener') }
        : { lines: [out('LinkedIn link not published yet — email works best.', 'muted')] }

    case 'theme': {
      const current = getPrefs().theme
      const target = arg === 'dark' || arg === 'light' ? arg : current === 'dark' ? 'light' : 'dark'
      if (target === current) return { lines: [out(`Theme is already ${current}.`, 'muted')] }
      return { lines: [out(`theme → ${target}`, 'muted')], effect: os.toggleTheme }
    }

    case 'recruiter':
      return { lines: [out(`recruiter mode → ${getPrefs().recruiter ? 'off' : 'on'}`, 'muted')], effect: os.toggleRecruiter }

    case 'motion':
      return { lines: [out(`reduced motion → ${getPrefs().reducedMotion ? 'off' : 'on'}`, 'muted')], effect: os.toggleMotion }

    case 'clear':
      return { lines: [], clear: true }

    case 'date':
      return { lines: [out(new Date().toString())] }

    case 'echo':
      return { lines: [out(arg)] }

    case 'sudo':
      if (/^hire\s*-?\s*priya$/i.test(arg)) {
        return {
          lines: [out('[sudo] password for recruiter: ********', 'muted'), out('Access granted. Opening a direct line…', 'accent')],
          effect: () => (window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Let’s talk — found you via PRIYA.OS')}`),
        }
      }
      return { lines: [out('Nice try. This incident will be reported to /dev/null.', 'err')] }

    case 'rm':
      return { lines: [out('rm: refusing to delete four years of work.', 'err')] }

    case 'exit':
      return { lines: [], effect: () => os.toggleTerminal(false) }

    default:
      return { lines: [out(`command not found: ${cmd}. Type 'help'.`, 'err')] }
  }
}

export function complete(partial: string) {
  const p = partial.trim().toLowerCase()
  if (!p || p.includes(' ')) return null
  const hits = COMMANDS.filter((c) => c.startsWith(p))
  return hits.length === 1 ? `${hits[0]} ` : null
}
