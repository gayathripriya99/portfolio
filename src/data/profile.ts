// Source of truth: Gayathri Priya C V résumé (public/resume.pdf) and the user's own profile brief.

export const profile = {
  name: 'Gayathri Priya C V',
  shortName: 'Gayathri Priya',
  role: 'Software Engineer',
  location: 'Chamarajanagara, Karnataka, India',
  timezone: 'Asia/Kolkata',
  email: 'gayathripriyacvg@gmail.com',
  resumeUrl: '/resume.pdf',
  resumeFile: 'Gayathri-Priya-CV-Resume.pdf',
  githubUser: 'gayathripriya99',
  github: 'https://github.com/gayathripriya99',
  linkedin: '', // add your LinkedIn URL to show it everywhere (hidden while empty)
  repo: 'https://github.com/gayathripriya99/portfolio',
  careerStart: '2022-09-01',
  yearsLabel: '4+ years',
  available: true,
  summary:
    'Software engineer with 4+ years of experience shipping production features end to end. I work across React, TypeScript and Redux on the front, Node.js, Express and FastAPI behind it, PostgreSQL, MySQL and MongoDB underneath — and increasingly, the LLM-powered features that sit on top.',
  about: [
    'I joined Lingotran as an intern in 2022 and grew into owning features end to end on a React.js and Node.js language-learning product — from implementation through debugging and production issue resolution.',
    'The work I enjoy most sits where product and systems meet: an offline outbox that keeps learners working through connectivity loss, a speech architecture that behaves the same on iOS Safari and Android, an authorization layer that can explain its own decisions.',
    'Lately that has meant AI: grounding LLM answers in real documents, forcing structured output, and designing for the moment the model gets it wrong.',
  ],
  targetRoles: [
    'Software Engineer',
    'Frontend Engineer',
    'React Developer',
    'React + Node.js Developer',
    'Full Stack Developer',
    'MERN Developer',
    'TypeScript Developer',
    'AI-enabled Application Developer',
  ],
  primarySkills: ['React', 'TypeScript', 'JavaScript', 'Redux', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'LLM integration'],
  education: {
    degree: 'B.E., Computer Science and Engineering',
    school: 'Government Engineering College, Chamarajanagar',
    year: '2021',
  },
}

export const sections = [
  { id: 'home', label: 'Home', path: '~' },
  { id: 'work', label: 'Work', path: '~/work' },
  { id: 'experience', label: 'Experience', path: '~/experience' },
  { id: 'stack', label: 'Stack', path: '~/stack' },
  { id: 'lab', label: 'Lab', path: '~/lab', experimental: true },
  { id: 'about', label: 'About', path: '~/about' },
  { id: 'contact', label: 'Contact', path: '~/contact' },
] as const

export type SectionId = (typeof sections)[number]['id']

/** Career "uptime" since the first day in industry, e.g. "4y 1m". */
export function careerUptime(now = new Date()) {
  const start = new Date(profile.careerStart)
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  if (now.getDate() < start.getDate()) months -= 1
  return `${Math.floor(months / 12)}y ${months % 12}m`
}
