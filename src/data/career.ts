export interface Commit {
  id: string
  tag?: string
  role: string
  company: string
  location?: string
  period: string
  year: string
  summary: string
  commits: { type: string; scope?: string; message: string }[]
  responsibilities: string[]
  tech: string[]
}

export const career: Commit[] = [
  {
    id: 'engineer',
    tag: 'HEAD → main',
    role: 'Software Engineer (Trainee)',
    company: 'Lingotran Private Limited',
    location: 'Mysuru, Karnataka',
    period: 'Dec 2022 — Present',
    year: '2022 → now',
    summary: 'Own features end to end across a React.js / Node.js language-learning product — from implementation through debugging and production issue resolution.',
    commits: [
      { type: 'feat', scope: 'offline', message: 'IndexedDB write-outbox queues API operations and syncs on reconnect' },
      { type: 'refactor', scope: 'speech', message: 'reusable SpeechModule architecture for mic, recognition and feedback' },
      { type: 'feat', scope: 'reports', message: 'ECharts / ApexCharts reporting with document and spreadsheet export' },
      { type: 'feat', scope: 'api', message: 'Axios integrations for activity, vocabulary, prompts and progress' },
      { type: 'fix', scope: 'compat', message: 'speech recognition, audio playback and browser issues in production' },
      { type: 'feat', scope: 'ui', message: 'reusable React components across desktop, mobile, iOS Safari and Android' },
    ],
    responsibilities: [
      'Own features end to end — implementation, debugging and production issue resolution, including speech recognition, audio playback, browser compatibility and API behaviour.',
      'Designed and built an IndexedDB-based offline write-outbox that queues API operations during connectivity loss and synchronises them after reconnection, improving the resilience of learner-facing workflows.',
      'Integrated REST APIs using Axios for activity tracking, vocabulary, prompts, progress tracking and learner interaction workflows.',
      'Developed responsive reporting and visualisation features using ECharts and ApexCharts, with client-side document and spreadsheet export utilities.',
      'Refactored speech functionality into a reusable SpeechModule architecture that centralises the microphone UI, speech recognition, validation, feedback, tracker updates, navigation and shared speech utilities.',
      'Built reusable React components and workflows with React.js, Redux, Redux Toolkit, React Router and Material UI across desktop, mobile, tablet, iOS Safari and Android browsers.',
    ],
    tech: ['React', 'JavaScript', 'Redux', 'Redux Toolkit', 'REST APIs', 'Axios', 'HTML', 'CSS', 'Material UI', 'Web Speech API', 'IndexedDB', 'Git', 'GitHub', 'Azure DevOps', 'Docker'],
  },
  {
    id: 'intern',
    tag: 'tag: internship',
    role: 'Software Development Intern',
    company: 'Lingotran Private Limited',
    location: 'Mysuru, Karnataka',
    period: 'Sep 2022 — Dec 2022',
    year: '2022',
    summary: 'First production codebase: built a Student Management System across the full stack.',
    commits: [
      { type: 'feat', message: 'Student Management System — React.js, Node.js, MySQL' },
      { type: 'feat', scope: 'forms', message: 'responsive UIs, reusable forms and validation' },
      { type: 'feat', scope: 'api', message: 'Node.js backend integrated with MySQL' },
    ],
    responsibilities: [
      'Developed a Student Management System using HTML, CSS, Bootstrap, JavaScript, React.js, Node.js and MySQL.',
      'Built responsive user interfaces and reusable forms for student information and application workflows.',
      'Implemented form validation, user interactions and dynamic data handling using JavaScript and React.js.',
      'Developed Node.js backend functionality and integrated application data with MySQL.',
    ],
    tech: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'React', 'Node.js', 'MySQL'],
  },
  {
    id: 'degree',
    tag: 'init',
    role: 'B.E., Computer Science and Engineering',
    company: 'Government Engineering College, Chamarajanagar',
    period: '2021',
    year: '2021',
    summary: 'Initial commit.',
    commits: [],
    responsibilities: [],
    tech: [],
  },
]

/** Stable short "hash" for display. */
export function shortHash(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7)
}

export type LabStatus = 'prototype' | 'coming-soon'

export interface LabItem {
  id: string
  status: LabStatus
  title: string
  body: string
  tags: string[]
  project?: string
}

export const lab: LabItem[] = [
  {
    id: 'doc-assistant',
    status: 'prototype',
    title: 'Grounded document assistant',
    body: 'Upload notes, ask questions answered from them, generate structured quizzes — on a local model. Built as Priya Mentor AI.',
    tags: ['FastAPI', 'Ollama', 'PostgreSQL'],
    project: 'priya-mentor-ai',
  },
  {
    id: 'semantic-search',
    status: 'coming-soon',
    title: 'Semantic search with pgvector',
    body: 'Replace keyword retrieval with chunked embeddings stored in PostgreSQL, so questions match meaning rather than words.',
    tags: ['pgvector', 'Embeddings'],
  },
  {
    id: 'streaming',
    status: 'coming-soon',
    title: 'Streamed answers',
    body: 'Token-by-token streaming from the model to the chat UI, with cancellation.',
    tags: ['Streaming', 'React'],
  },
  {
    id: 'offline-ai',
    status: 'coming-soon',
    title: 'Offline-first AI notes',
    body: 'Combine the IndexedDB outbox pattern with an LLM: capture questions offline, answer and sync when the connection returns.',
    tags: ['IndexedDB', 'LLM'],
  },
]
