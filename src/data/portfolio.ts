// All site content lives here. Components only render what this file provides.
// Items marked TODO were inferred and must be confirmed before publishing.

export type NodeKind = 'client' | 'api' | 'process' | 'data' | 'ai' | 'external'

export interface ArchStep {
  label: string
  sub?: string
  kind: NodeKind
}

export interface ArchLane {
  title: string
  steps: ArchStep[]
}

export interface Project {
  slug: string
  title: string
  tagline: string
  summary: string
  role: string
  preview: 'mentor' | 'translate' | 'voice'
  featured?: boolean
  tags: string[]
  links: { github?: string; live?: string }
  problem: string
  solution: string
  stack: { group: string; items: string[] }[]
  architecture: { caption: string; lanes: ArchLane[] }
  features: { title: string; body: string }[]
  decisions: string[]
  next?: string[]
}

export interface Experience {
  company: string
  role: string
  period: string
  summary: string
  points: { text: string; highlight?: boolean }[]
  tech: string[]
}

export interface SkillGroup {
  title: string
  icon: 'frontend' | 'backend' | 'ai' | 'speech' | 'data' | 'cloud'
  blurb: string
  items: string[]
}

export const profile = {
  name: 'Gayathri Priya', // TODO: confirm how you want your name displayed
  role: 'Full-Stack Software Engineer',
  headline: 'I build full-stack products and practical AI systems.',
  intro:
    'Software engineer working across React, Node.js and Python/FastAPI, with a focus on LLM-powered features and speech-driven learning experiences.',
  current: { label: 'Currently', value: 'Software Engineer · Lingotran' }, // TODO: confirm title
  focus: { label: 'Focus', value: 'Full-stack · LLM apps · Speech' },
  available: true,
  email: 'hello@example.com', // TODO: personal email (avoid publishing a work address)
  resumeUrl: '/resume.pdf', // TODO: add public/resume.pdf
  socials: {
    github: '', // TODO: e.g. https://github.com/<username>  (hidden while empty)
    linkedin: '', // TODO: e.g. https://www.linkedin.com/in/<handle>  (hidden while empty)
  },
}

export const skills: SkillGroup[] = [
  {
    title: 'Frontend',
    icon: 'frontend',
    blurb: 'Typed, responsive interfaces with attention to motion and accessibility.',
    items: ['React', 'TypeScript', 'JavaScript', 'HTML & CSS', 'Tailwind CSS', 'Vite', 'Chakra UI', 'Redux Toolkit'],
  },
  {
    title: 'Backend & APIs',
    icon: 'backend',
    blurb: 'REST services with clear boundaries, validation and graceful failure.',
    items: ['Node.js', 'Python', 'FastAPI', 'Pydantic', 'REST APIs', 'File processing'],
  },
  {
    title: 'AI & LLMs',
    icon: 'ai',
    blurb: 'Grounded, structured LLM features that degrade safely when models misbehave.',
    items: ['Ollama', 'OpenAI API', 'Prompt design', 'Structured JSON output', 'Document Q&A'],
  },
  {
    title: 'Speech & Language',
    icon: 'speech',
    blurb: 'Voice input, recognition and translation for language-learning products.',
    items: ['Web Speech API', 'Voice activity detection', 'Speech-to-Text', 'Google Cloud Translation'],
  },
  {
    title: 'Data',
    icon: 'data',
    blurb: 'Relational modelling, SQL and keeping data pipelines honest.',
    items: ['PostgreSQL', 'MySQL', 'SQL', 'ETL pipelines'],
  },
  {
    title: 'Cloud & Tooling',
    icon: 'cloud',
    blurb: 'Shipping and running services beyond localhost.',
    items: ['Microsoft Azure', 'Docker', 'Git', 'GitHub', 'ESLint'],
  },
]

export const projects: Project[] = [
  {
    slug: 'priya-mentor-ai',
    title: 'Priya Mentor AI',
    tagline: 'A personal AI learning companion that answers from your own study material.',
    summary:
      'Upload PDFs, Word documents or notes. Priya Mentor extracts the text, stores it in PostgreSQL and uses it as grounding context when you ask questions — and generates multiple-choice quizzes on any topic with a locally hosted LLM.',
    role: 'Personal project · Full-stack',
    preview: 'mentor',
    featured: true,
    tags: ['React 19', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Ollama'],
    links: { github: '', live: '' }, // TODO: add repository / demo links
    problem:
      'General-purpose chatbots answer from the open internet, not from the notes a learner is actually studying — and sending private study material to a hosted model is not always acceptable.',
    solution:
      'A local-first study assistant: documents are parsed server-side, persisted in PostgreSQL and retrieved at question time, then combined with the question into a grounded prompt for a model running on Ollama. Nothing leaves the machine.',
    stack: [
      { group: 'Client', items: ['React 19', 'TypeScript', 'Tailwind CSS 4', 'Vite'] },
      { group: 'API', items: ['Python', 'FastAPI', 'Pydantic', 'python-multipart'] },
      { group: 'Documents', items: ['pypdf', 'docx2txt', 'Plain text'] },
      { group: 'Data & AI', items: ['PostgreSQL', 'psycopg2', 'Ollama (local LLM)'] },
    ],
    architecture: {
      caption: 'Three independent FastAPI routers share one PostgreSQL store and one local model.',
      lanes: [
        {
          title: 'Ingest',
          steps: [
            { label: 'Upload', sub: 'React · PDF / DOCX / TXT', kind: 'client' },
            { label: 'POST /documents/upload', sub: 'FastAPI router', kind: 'api' },
            { label: 'Text extraction', sub: 'pypdf · docx2txt', kind: 'process' },
            { label: 'documents', sub: 'PostgreSQL', kind: 'data' },
          ],
        },
        {
          title: 'Ask',
          steps: [
            { label: 'Chat', sub: 'React · session id', kind: 'client' },
            { label: 'POST /chat', sub: 'FastAPI router', kind: 'api' },
            { label: 'Context retrieval', sub: 'SQL search over documents', kind: 'data' },
            { label: 'Grounded prompt', sub: 'context + question', kind: 'process' },
            { label: 'Local LLM', sub: 'Ollama /api/generate', kind: 'ai' },
            { label: 'chat_history', sub: 'PostgreSQL', kind: 'data' },
          ],
        },
        {
          title: 'Quiz',
          steps: [
            { label: 'Quiz builder', sub: 'React · topic + difficulty', kind: 'client' },
            { label: 'POST /quiz/generate', sub: 'FastAPI router', kind: 'api' },
            { label: 'Local LLM', sub: 'Ollama · format: json', kind: 'ai' },
            { label: 'Shape check', sub: 'validate · safe fallback', kind: 'process' },
          ],
        },
      ],
    },
    features: [
      {
        title: 'Multi-format ingestion',
        body: 'PDF, DOCX and TXT uploads are parsed server-side and stored with their extracted text and character count.',
      },
      {
        title: 'Grounded answers',
        body: 'Relevant passages from your documents are injected into the prompt; the API reports whether documents were used.',
      },
      {
        title: 'Structured quiz generation',
        body: 'JSON-mode generation produces questions, options, answers and explanations at a chosen difficulty.',
      },
      {
        title: 'Graceful degradation',
        body: 'Malformed model output is normalised or replaced with a safe fallback quiz instead of breaking the UI.',
      },
      {
        title: 'Persistent sessions',
        body: 'Every user and assistant turn is written to chat_history, keyed by session.',
      },
      {
        title: 'Private by default',
        body: 'Inference runs on Ollama locally, so study material never reaches a third-party API.',
      },
    ],
    decisions: [
      'Local inference via Ollama keeps uploaded documents private and the running cost at zero.',
      'Ollama’s JSON mode constrains quiz output, and the API validates its shape before it reaches the client.',
      'Chat, documents and quiz are separate FastAPI routers, so each capability can evolve and be tested on its own.',
    ],
    next: [
      'Chunk documents and move retrieval to embeddings with pgvector.',
      'Stream responses token-by-token to the chat UI.',
    ],
  },
  {
    slug: 'speech-translation',
    title: 'Speech & Translation Toolkit',
    tagline: 'Language detection and translation service with a React speech-to-text client.',
    summary:
      'A Node.js service wrapping Google Cloud Translation for language detection and text translation, paired with a React client used to explore speech-to-text workflows.',
    role: 'Proof of concept', // TODO: confirm context (personal / work)
    preview: 'translate',
    tags: ['Node.js', 'React', 'Google Cloud'],
    links: { github: '' },
    problem: 'Language-learning content needed fast, reliable language detection and translation that the product team could experiment with.',
    solution:
      'A small Node.js module exposing detect and translate helpers over the Google Cloud Translation API, with credentials loaded from the environment and errors contained at the boundary.',
    stack: [
      { group: 'Client', items: ['React', 'Create React App'] },
      { group: 'Service', items: ['Node.js', 'dotenv'] },
      { group: 'Cloud', items: ['Google Cloud Translation', 'Speech-to-Text'] },
    ],
    architecture: {
      caption: 'A thin service keeps cloud credentials off the client.',
      lanes: [
        {
          title: 'Translate',
          steps: [
            { label: 'React client', sub: 'text / speech input', kind: 'client' },
            { label: 'Node.js service', sub: 'detect · translate', kind: 'api' },
            { label: 'Cloud Translation', sub: 'Google Cloud v2', kind: 'external' },
          ],
        },
      ],
    },
    features: [
      { title: 'Language detection', body: 'Identifies the source language of arbitrary input text.' },
      { title: 'Targeted translation', body: 'Translates into any supported locale, e.g. pt-BR.' },
      { title: 'Server-side credentials', body: 'Service-account credentials stay in the environment, never in the browser.' },
    ],
    decisions: ['Errors are caught and logged at the API boundary so a failed cloud call never crashes the caller.'],
  },
  {
    slug: 'voice-practice',
    title: 'Voice Pronunciation Practice',
    tagline: 'Real-time pronunciation feedback with voice activity detection and speech recognition.',
    summary:
      'An interactive French practice unit: voice activity detection calibrates to background noise, speech recognition transcribes the attempt, and fuzzy matching scores pronunciation.',
    role: 'Team project · Lingotran', // TODO: confirm your role on this project
    preview: 'voice',
    tags: ['React', 'Web Speech API', 'Chakra UI'],
    links: {},
    problem: 'Learners need immediate, forgiving feedback on spoken answers — in noisy rooms and on iOS Safari.',
    solution:
      'Noise-calibrated voice activity detection gates recognition; Levenshtein distance and fuzzy matching turn transcripts into nuanced pronunciation feedback.',
    stack: [
      { group: 'Client', items: ['React', 'Chakra UI', 'Redux Toolkit', 'Framer Motion'] },
      { group: 'Audio', items: ['Web Speech API', 'Web Audio', 'VAD'] },
    ],
    architecture: {
      caption: 'Entirely client-side audio pipeline.',
      lanes: [
        {
          title: 'Practice loop',
          steps: [
            { label: 'Microphone', sub: 'Web Audio', kind: 'client' },
            { label: 'Voice activity detection', sub: 'noise calibration', kind: 'process' },
            { label: 'Speech recognition', sub: 'Web Speech API', kind: 'ai' },
            { label: 'Scoring', sub: 'Levenshtein · fuzzy match', kind: 'process' },
          ],
        },
      ],
    },
    features: [
      { title: 'Adaptive VAD', body: 'Background-noise calibration keeps detection accurate across environments.' },
      { title: 'Nuanced scoring', body: 'Fuzzy matching tolerates near-misses instead of failing on exact text.' },
      { title: 'iOS-ready', body: 'Viewport and audio-context handling tuned for Safari on iPhone.' },
    ],
    decisions: ['Gating recognition behind VAD avoids sending silence to the recogniser and reduces false results.'],
  },
]

// TODO: confirm titles, dates and achievements — drafted from local project folders.
export const experience: Experience[] = [
  {
    company: 'Lingotran',
    role: 'Software Engineer',
    period: 'YYYY — Present',
    summary: 'Building interactive, speech-driven language-learning products end to end.',
    points: [
      { text: 'Build interactive practice units in React with real-time voice activity detection and speech recognition.', highlight: true },
      { text: 'Develop Node.js backend services and deploy them on Microsoft Azure.' },
      { text: 'Integrate cloud speech and translation APIs into product workflows.', highlight: true },
      { text: 'Diagnose data issues in ETL pipelines and write SQL across MySQL and PostgreSQL.' },
    ],
    tech: ['React', 'Node.js', 'Azure', 'Web Speech API', 'MySQL'],
  },
  {
    company: 'Independent',
    role: 'Builder — Priya Mentor AI',
    period: '2026',
    summary: 'Designing and building a local-first AI study companion.',
    points: [
      { text: 'Shipped document ingestion, grounded chat and structured quiz generation on FastAPI + PostgreSQL.', highlight: true },
      { text: 'Ran inference locally with Ollama to keep user documents private.' },
    ],
    tech: ['React 19', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Ollama'],
  },
]

export const sections = [
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const
