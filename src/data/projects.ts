// No metrics are invented: results are qualitative and come from the résumé or the project's source code.

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
  problem: string
  type: string
  context: string
  role: string
  year?: string
  impact: string
  preview: 'mentor' | 'platform' | 'access' | 'chatbot' | 'erp'
  /** Canonical skill names — powers the stack map's "related projects". */
  tech: string[]
  links: { github?: string; live?: string }
  note?: string
  overview: string
  myRole: string[]
  architecture: { caption: string; lanes: ArchLane[] }
  engineering: { title: string; body: string }[]
  challenges: { title: string; body: string }[]
  result: string[]
  stack: { group: string; items: string[] }[]
}

export const projects: Project[] = [
  {
    slug: 'priya-mentor-ai',
    title: 'Priya Mentor AI',
    problem: 'Learners need answers grounded in their own notes — without sending private material to a hosted model.',
    type: 'AI-powered application',
    context: 'Personal project',
    role: 'Solo — product, frontend, API, data',
    year: '2026',
    impact: 'Local-first document Q&A and quiz generation; documents never leave the machine.',
    preview: 'mentor',
    tech: ['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'LLM integration', 'Ollama', 'Structured output', 'REST APIs'],
    links: { github: 'https://github.com/gayathripriya99/AI-Powered-Learning-Analytics-Platform' },
    overview:
      'General-purpose chatbots answer from the open internet, not from the material a learner is actually studying. Priya Mentor AI is a study companion: upload PDFs, Word documents or notes, ask questions answered from that content, and generate multiple-choice quizzes on any topic — all running against a local model.',
    myRole: [
      'Built the React 19 + TypeScript client: document upload, grounded chat and the quiz builder.',
      'Designed the FastAPI service as three independent routers — documents, chat and quiz.',
      'Implemented PDF, DOCX and TXT text extraction and persisted documents and chat history in PostgreSQL.',
      'Integrated Ollama for grounded answers and JSON-mode quiz generation.',
    ],
    architecture: {
      caption: 'Three FastAPI routers share one PostgreSQL store and one local model.',
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
    engineering: [
      { title: 'Local inference', body: 'Ollama runs the model on the same machine, so uploaded study material is never sent to a third-party API and running cost is zero.' },
      { title: 'Constrained output', body: 'Quiz generation uses Ollama’s JSON mode with an explicit schema in the prompt — question, four options, answer, explanation.' },
      { title: 'Independent routers', body: 'Documents, chat and quiz are separate FastAPI routers, so each capability can change and be tested on its own.' },
      { title: 'Persistent sessions', body: 'Every user and assistant turn is written to chat_history keyed by session id.' },
    ],
    challenges: [
      { title: 'Models don’t always return valid JSON', body: 'The API normalises a bare list into { questions }, rejects other shapes, and falls back to a safe quiz so the UI never breaks on a bad generation.' },
      { title: 'Grounding without a vector database', body: 'Retrieval starts as SQL text search over extracted content, kept behind a single function so it can be swapped for embeddings later.' },
      { title: 'Three document formats', body: 'Per-format extractors sit behind one extract_text entry point, so adding a format doesn’t touch the upload route.' },
    ],
    result: [
      'A working local study assistant: upload, ask and quiz in one flow.',
      'The API reports whether an answer used the learner’s documents.',
      'Next: chunking with pgvector embeddings, and streamed responses.',
    ],
    stack: [
      { group: 'Client', items: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite'] },
      { group: 'API', items: ['Python', 'FastAPI', 'Pydantic'] },
      { group: 'Documents', items: ['pypdf', 'docx2txt'] },
      { group: 'Data & AI', items: ['PostgreSQL', 'psycopg2', 'Ollama'] },
    ],
  },
  {
    slug: 'learner-platform',
    title: 'Learner Platform — Offline & Speech',
    problem: 'Learners practise on unreliable networks and every kind of device — progress can’t be lost, and speech has to work everywhere.',
    type: 'Production application',
    context: 'Lingotran Private Limited',
    role: 'Software Engineer — feature owner, end to end',
    year: '2022 — now',
    impact: 'Learner workflows survive connectivity loss; speech features share one reusable module.',
    preview: 'platform',
    tech: ['React', 'JavaScript', 'Redux', 'Redux Toolkit', 'React Router', 'Material UI', 'Axios', 'REST APIs', 'Web Speech API', 'IndexedDB', 'ECharts', 'ApexCharts', 'Node.js', 'Docker', 'Azure DevOps', 'Git'],
    links: {},
    note: 'Production code is proprietary — described at the level of my résumé.',
    overview:
      'A React.js and Node.js language-learning product used on desktop, mobile, tablet, iOS Safari and Android. I own features end to end — implementation, debugging and production issue resolution — across speech recognition, audio playback, browser compatibility and API behaviour.',
    myRole: [
      'Designed and built an IndexedDB-based offline write-outbox that queues API operations during connectivity loss and synchronises them after reconnection.',
      'Refactored speech functionality into a reusable SpeechModule architecture.',
      'Integrated REST APIs with Axios for activity tracking, vocabulary, prompts, progress and learner interactions.',
      'Built responsive reporting with ECharts and ApexCharts, plus client-side document and spreadsheet export.',
      'Built reusable React components and workflows with Redux, Redux Toolkit, React Router and Material UI.',
    ],
    architecture: {
      caption: 'Writes go through an outbox, so a dropped connection delays an operation instead of losing it.',
      lanes: [
        {
          title: 'Offline outbox',
          steps: [
            { label: 'Learner action', sub: 'React · Redux', kind: 'client' },
            { label: 'API operation', sub: 'Axios', kind: 'process' },
            { label: 'Write-outbox', sub: 'IndexedDB queue', kind: 'data' },
            { label: 'Reconnect', sub: 'synchronise queue', kind: 'process' },
            { label: 'REST API', sub: 'Node.js', kind: 'api' },
          ],
        },
        {
          title: 'SpeechModule',
          steps: [
            { label: 'Microphone UI', sub: 'shared component', kind: 'client' },
            { label: 'Recognition', sub: 'Web Speech API', kind: 'ai' },
            { label: 'Validation + feedback', sub: 'shared speech utilities', kind: 'process' },
            { label: 'Tracker update', sub: 'progress API', kind: 'api' },
          ],
        },
      ],
    },
    engineering: [
      { title: 'Write-outbox pattern', body: 'API writes are queued in IndexedDB while offline and synchronised after reconnection, so learner-facing workflows keep working.' },
      { title: 'One speech architecture', body: 'Microphone UI, recognition, validation, feedback, tracker updates, navigation and speech utilities live in one SpeechModule instead of per-screen code.' },
      { title: 'Reusable UI system', body: 'Shared React components built on Material UI, with state in Redux / Redux Toolkit and routing via React Router.' },
      { title: 'Reporting in the browser', body: 'ECharts and ApexCharts visualisations with client-side document and spreadsheet export.' },
    ],
    challenges: [
      { title: 'Connectivity loss mid-activity', body: 'Solved with the IndexedDB outbox — operations are captured locally and replayed once the network returns.' },
      { title: 'Cross-browser speech and audio', body: 'Production issues in speech recognition, audio playback and browser compatibility across iOS Safari, Android and desktop.' },
      { title: 'Speech logic spread across screens', body: 'Consolidated into the SpeechModule so fixes and features land in one place.' },
    ],
    result: [
      'Learner-facing workflows are more resilient to connectivity loss.',
      'Speech features share one module across the product.',
      'Responsive reporting with chart visualisations and export.',
    ],
    stack: [
      { group: 'Client', items: ['React.js', 'JavaScript', 'Redux', 'Redux Toolkit', 'React Router', 'Material UI', 'HTML5', 'CSS3'] },
      { group: 'Browser APIs', items: ['IndexedDB', 'Web Speech API'] },
      { group: 'Data & charts', items: ['Axios', 'REST APIs', 'ECharts', 'ApexCharts'] },
      { group: 'Delivery', items: ['Git', 'GitHub', 'Azure DevOps', 'Docker'] },
    ],
  },
  {
    slug: 'accessflow',
    title: 'AccessFlow',
    problem: 'Multi-tenant apps need authorization that is consistent and auditable — not permission checks scattered through route handlers.',
    type: 'Full-stack system · IAM',
    context: 'Personal project',
    role: 'Solo — full-stack',
    impact: 'One enforcement point for RBAC and ABAC, with tenant isolation and an audit trail.',
    preview: 'access',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'REST APIs', 'RBAC', 'ABAC', 'Authorization middleware', 'Multi-tenancy', 'Audit logging'],
    links: { github: 'https://github.com/gayathripriya99/AccessFlow' },
    overview:
      'AccessFlow is an Identity and Access Management platform. It authenticates users, decides what each user may do inside their tenant using roles, permissions and attributes, and records those decisions.',
    myRole: [
      'Built the full stack: React.js client, Node.js / Express.js REST API, MongoDB data layer.',
      'Implemented JWT authentication and authorization with RBAC, role hierarchies, permissions and ABAC.',
      'Added multi-tenancy and audit logging.',
      'Developed authorization middleware and a permission simulator that evaluates decisions across roles, permissions and attributes.',
    ],
    architecture: {
      caption: 'Every protected request passes through the same authorization middleware.',
      lanes: [
        {
          title: 'Request',
          steps: [
            { label: 'React client', sub: 'admin console', kind: 'client' },
            { label: 'Express API', sub: 'JWT authentication', kind: 'api' },
            { label: 'Authorization', sub: 'middleware · RBAC + ABAC', kind: 'process' },
            { label: 'Tenant-scoped data', sub: 'MongoDB', kind: 'data' },
          ],
        },
        {
          title: 'Simulator',
          steps: [
            { label: 'Permission simulator', sub: 'React', kind: 'client' },
            { label: 'Evaluate', sub: 'roles · permissions · attributes', kind: 'process' },
            { label: 'Decision', sub: 'allow / deny', kind: 'api' },
            { label: 'Audit log', sub: 'MongoDB', kind: 'data' },
          ],
        },
      ],
    },
    engineering: [
      { title: 'Single enforcement point', body: 'Authorization runs as Express middleware, so every protected route uses the same evaluation path.' },
      { title: 'RBAC for structure, ABAC for context', body: 'Role hierarchies and permissions give the baseline; attribute rules refine decisions.' },
      { title: 'Tenancy as part of the decision', body: 'Multi-tenancy is built into authorization rather than bolted onto queries.' },
      { title: 'Auditability', body: 'Access decisions are recorded in an audit log.' },
    ],
    challenges: [
      { title: 'Two access models in one path', body: 'Combining role-based and attribute-based rules in a single evaluation.' },
      { title: 'Testing authorization before it ships', body: 'The permission simulator evaluates a decision for any role, permission and attribute combination.' },
      { title: 'Isolating tenants', body: 'Keeping each tenant’s users, roles and data separate.' },
    ],
    result: [
      'A reusable authorization layer: RBAC, ABAC, role hierarchies, multi-tenancy, audit logging.',
      'Authorization decisions that can be simulated and inspected.',
    ],
    stack: [
      { group: 'Client', items: ['React.js'] },
      { group: 'API', items: ['Node.js', 'Express.js', 'JWT', 'REST APIs'] },
      { group: 'Data', items: ['MongoDB'] },
    ],
  },
  {
    slug: 'support-chatbot',
    title: 'AI Support Chatbot',
    problem: 'Users need conversational help inside the application — and an assistant that answers once, reliably.',
    type: 'AI integration',
    context: 'Application integration',
    role: 'Integration — conversation flow & LLM wiring',
    impact: 'Conversational support with local (Ollama) and cloud LLMs inside an existing app.',
    preview: 'chatbot',
    tech: ['LLM integration', 'Ollama', 'AI APIs'],
    links: {},
    overview: 'An AI-powered support chatbot integrated into an application to provide conversational assistance and user support.',
    myRole: [
      'Integrated the chatbot into the application’s workflows.',
      'Worked with Ollama and cloud-based LLM integration as part of the chatbot architecture.',
      'Implemented conversation state and response processing.',
      'Investigated reliability issues, including duplicate AI responses.',
    ],
    architecture: {
      caption: 'A response-processing layer sits between the model and the UI.',
      lanes: [
        {
          title: 'Conversation',
          steps: [
            { label: 'Chat UI', sub: 'in-app assistant', kind: 'client' },
            { label: 'Conversation state', sub: 'history · turn handling', kind: 'process' },
            { label: 'LLM', sub: 'Ollama / cloud', kind: 'ai' },
            { label: 'Response processing', sub: 'before render', kind: 'process' },
          ],
        },
      ],
    },
    engineering: [
      { title: 'Model-agnostic integration', body: 'Works with a local Ollama model or a cloud LLM.' },
      { title: 'Explicit conversation state', body: 'Turns and history are managed in the app rather than left to the model.' },
      { title: 'Processing layer', body: 'Responses pass through processing before they reach the UI.' },
    ],
    challenges: [{ title: 'Duplicate AI responses', body: 'Investigated a reliability issue where replies could be duplicated, through conversation state and response handling.' }],
    result: ['Conversational assistance integrated into the application’s support workflow.'],
    stack: [{ group: 'AI', items: ['Ollama', 'Cloud LLM APIs'] }],
  },
  {
    slug: 'student-erp',
    title: 'Student Management ERP',
    problem: 'Student, course and marks data needs one consistent system with clean workflows.',
    type: 'Full-stack system',
    context: 'Personal project',
    role: 'Solo — full-stack',
    impact: 'End-to-end CRUD workflows for students, courses, marks and academic records.',
    preview: 'erp',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs'],
    links: { github: 'https://github.com/gayathripriya99/student-management-erp' },
    overview: 'A full-stack student management application covering students, courses, marks and academic information.',
    myRole: [
      'Built the React.js frontend and the Node.js / Express.js REST API.',
      'Modelled students, courses, marks and academic information with MongoDB and Mongoose.',
      'Implemented CRUD workflows and integrated the frontend with the backend APIs.',
    ],
    architecture: {
      caption: 'Classic three-tier flow with REST resources per entity.',
      lanes: [
        {
          title: 'Request',
          steps: [
            { label: 'React UI', sub: 'forms · tables', kind: 'client' },
            { label: 'REST API', sub: 'Express.js', kind: 'api' },
            { label: 'Models', sub: 'Mongoose', kind: 'process' },
            { label: 'MongoDB', sub: 'students · courses · marks', kind: 'data' },
          ],
        },
      ],
    },
    engineering: [
      { title: 'Resource-oriented API', body: 'Each entity — student, course, mark — is a REST resource with CRUD endpoints.' },
      { title: 'Schema per entity', body: 'Mongoose models give every record a defined shape.' },
    ],
    challenges: [{ title: 'Related records', body: 'Marks relate to both students and courses, so the data model and workflows keep those links consistent.' }],
    result: ['A complete CRUD application for academic data management.'],
    stack: [
      { group: 'Client', items: ['React.js'] },
      { group: 'API', items: ['Node.js', 'Express.js', 'REST APIs'] },
      { group: 'Data', items: ['MongoDB', 'Mongoose'] },
    ],
  },
]

export const featuredSlugs = ['learner-platform', 'priya-mentor-ai', 'accessflow']

export function projectsUsing(skill: string) {
  return projects.filter((p) => p.tech.includes(skill))
}
