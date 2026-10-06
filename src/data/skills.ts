export type SkillCategory = 'frontend' | 'backend' | 'data' | 'infra' | 'ai' | 'access'

export interface Skill {
  name: string
  category: SkillCategory
  /** Year of first professional use — only where the résumé supports it. */
  since?: string
  usedAt?: string[]
  aliases?: string[]
}

export const categories: { id: SkillCategory; label: string; blurb: string }[] = [
  { id: 'frontend', label: 'Frontend', blurb: 'Interfaces that work on every device and browser.' },
  { id: 'backend', label: 'Backend', blurb: 'APIs and services with clear boundaries.' },
  { id: 'data', label: 'Data', blurb: 'Relational, document and in-browser storage.' },
  { id: 'infra', label: 'Infrastructure', blurb: 'Shipping, versioning and running it.' },
  { id: 'ai', label: 'AI', blurb: 'LLM features grounded in real data.' },
  { id: 'access', label: 'Access control', blurb: 'Who can do what — and proving it.' },
]

const LT = ['Lingotran']

export const skills: Skill[] = [
  { name: 'React', category: 'frontend', since: '2022', usedAt: LT, aliases: ['react.js', 'reactjs'] },
  { name: 'TypeScript', category: 'frontend', aliases: ['ts'] },
  { name: 'JavaScript', category: 'frontend', since: '2022', usedAt: LT, aliases: ['js'] },
  { name: 'Redux', category: 'frontend', since: '2022', usedAt: LT },
  { name: 'Redux Toolkit', category: 'frontend', since: '2022', usedAt: LT, aliases: ['rtk'] },
  { name: 'React Router', category: 'frontend', since: '2022', usedAt: LT },
  { name: 'HTML', category: 'frontend', since: '2022', usedAt: LT, aliases: ['html5'] },
  { name: 'CSS', category: 'frontend', since: '2022', usedAt: LT, aliases: ['css3'] },
  { name: 'Bootstrap', category: 'frontend', since: '2022', usedAt: ['Lingotran (internship)'] },
  { name: 'Material UI', category: 'frontend', since: '2022', usedAt: LT, aliases: ['mui'] },
  { name: 'Chakra UI', category: 'frontend' },
  { name: 'Formik', category: 'frontend' },
  { name: 'Axios', category: 'frontend', since: '2022', usedAt: LT },
  { name: 'Web Speech API', category: 'frontend', since: '2022', usedAt: LT, aliases: ['speech'] },
  { name: 'ECharts', category: 'frontend', since: '2022', usedAt: LT, aliases: ['charts'] },
  { name: 'ApexCharts', category: 'frontend', since: '2022', usedAt: LT, aliases: ['charts'] },

  { name: 'Node.js', category: 'backend', since: '2022', usedAt: LT, aliases: ['node', 'nodejs'] },
  { name: 'Express', category: 'backend', aliases: ['express.js', 'expressjs'] },
  { name: 'REST APIs', category: 'backend', since: '2022', usedAt: LT, aliases: ['rest', 'api', 'apis'] },
  { name: 'Socket.IO', category: 'backend', aliases: ['socket', 'websocket'] },
  { name: 'JWT', category: 'backend', aliases: ['auth'] },
  { name: 'Python', category: 'backend', aliases: ['py'] },
  { name: 'FastAPI', category: 'backend' },

  { name: 'PostgreSQL', category: 'data', aliases: ['postgres', 'sql'] },
  { name: 'MySQL', category: 'data', since: '2022', usedAt: ['Lingotran (internship)'], aliases: ['sql'] },
  { name: 'MongoDB', category: 'data', aliases: ['mongo', 'mongoose'] },
  { name: 'IndexedDB', category: 'data', since: '2022', usedAt: LT, aliases: ['offline'] },
  { name: 'SQL', category: 'data' },

  { name: 'Docker', category: 'infra', since: '2022', usedAt: LT },
  { name: 'Azure DevOps', category: 'infra', since: '2022', usedAt: LT, aliases: ['azure'] },
  { name: 'Git', category: 'infra', since: '2022', usedAt: LT },
  { name: 'GitHub', category: 'infra', since: '2022', usedAt: LT },
  { name: 'CI/CD', category: 'infra', aliases: ['ci', 'cd', 'pipelines'] },
  { name: 'Postman', category: 'infra' },

  { name: 'LLM integration', category: 'ai', aliases: ['llm', 'ai', 'chatbot'] },
  { name: 'Ollama', category: 'ai', aliases: ['local llm'] },
  { name: 'AI APIs', category: 'ai', aliases: ['llm api', 'openai'] },
  { name: 'Structured output', category: 'ai', aliases: ['json mode'] },
  { name: 'Automation', category: 'ai' },

  { name: 'RBAC', category: 'access', aliases: ['roles'] },
  { name: 'ABAC', category: 'access', aliases: ['attributes'] },
  { name: 'Authorization middleware', category: 'access', aliases: ['middleware'] },
  { name: 'Multi-tenancy', category: 'access', aliases: ['tenant', 'tenancy'] },
  { name: 'Audit logging', category: 'access', aliases: ['audit'] },
]

export function findSkills(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const exact = skills.filter((s) => s.name.toLowerCase() === q || s.aliases?.includes(q))
  if (exact.length) return exact
  return skills.filter((s) => s.name.toLowerCase().includes(q) || s.aliases?.some((a) => a.includes(q)))
}
