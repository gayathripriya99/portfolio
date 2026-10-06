import { useState } from 'react'
import { lab } from '../data/career'
import { useOS } from '../lib/os'
import { ArrowRight } from './Icons'
import { Reveal } from './Reveal'
import { Section } from './Section'

const SAMPLE_DOC = {
  filename: 'operating-systems-ch3.pdf',
  content:
    'A process is a program in execution. The operating system tracks each process in a process control block (PCB), which stores its state, program counter, CPU registers and scheduling information...',
}

/** Rebuilds the exact prompt template from Priya Mentor AI's /chat route — no model is called. */
function PromptInspector() {
  const [question, setQuestion] = useState('What does a process control block store?')
  const [withDocs, setWithDocs] = useState(true)
  const q = question.trim() || '…'

  return (
    <Reveal className="inspector">
      <div className="inspector-bar mono">
        <span>
          <span className="explorer-dot" aria-hidden="true" /> prompt-inspector
        </span>
        <span className="lab-status lab-status--interactive">INTERACTIVE</span>
      </div>
      <div className="inspector-body">
        <div className="inspector-controls">
          <label className="inspector-label mono" htmlFor="pi-question">
            Your question
          </label>
          <input id="pi-question" className="inspector-input" value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={160} spellCheck={false} />
          <label className="inspector-switch mono">
            <input type="checkbox" checked={withDocs} onChange={(e) => setWithDocs(e.target.checked)} />
            <span className="inspector-switch-ui" aria-hidden="true" />
            Relevant document found
          </label>
          <p className="inspector-note">
            This is the exact template Priya Mentor AI’s <code>/chat</code> route builds before calling Ollama. It runs entirely in your browser — no model is called.
          </p>
        </div>
        <pre className="inspector-out mono" aria-label="Generated prompt">
          <span className="pi-comment"># POST {'{OLLAMA_BASE_URL}'}/api/generate · stream: false</span>
          {'\n'}
          You are Priya Mentor AI, a helpful learning assistant.{'\n'}
          {withDocs ? (
            <>
              {'\n'}The user has uploaded documents. Here is relevant content:{'\n'}
              <span className="pi-ctx">
                From {SAMPLE_DOC.filename}:{'\n'}
                {SAMPLE_DOC.content}
              </span>
              {'\n\n'}Based on the above context, answer this question:{'\n'}
              <span className="pi-q">{q}</span>
            </>
          ) : (
            <>
              Answer this question: <span className="pi-q">{q}</span>
            </>
          )}
        </pre>
      </div>
    </Reveal>
  )
}

export function Lab() {
  const os = useOS()
  return (
    <Section
      id="lab"
      index="05"
      label="Lab"
      path="~/lab"
      className="section--lab"
      title={
        <>
          The <em>lab</em>
        </>
      }
      intro="Where I explore AI engineering. Labels are literal — PROTOTYPE means it’s built and running; COMING SOON means it isn’t yet."
    >
      <div className="lab">
        <ul className="lab-grid">
          {lab.map((item, i) => (
            <Reveal as="li" key={item.id} className={`lab-card lab-card--${item.status}`} delay={(i % 2) * 70}>
              <div className="lab-card-top mono">
                <span className="lab-id">exp/{String(i + 1).padStart(2, '0')}</span>
                <span className={`lab-status lab-status--${item.status}`}>{item.status === 'prototype' ? 'PROTOTYPE' : 'COMING SOON'}</span>
              </div>
              <h3 className="lab-title">{item.title}</h3>
              <p className="lab-body">{item.body}</p>
              <div className="lab-foot">
                <ul className="badges">
                  {item.tags.map((t) => (
                    <li key={t} className="badge">
                      {t}
                    </li>
                  ))}
                </ul>
                {item.project && (
                  <button type="button" className="lab-link mono" onClick={() => os.openProject(item.project!)}>
                    case study <ArrowRight size={14} className="btn-icon" />
                  </button>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
        <PromptInspector />
      </div>
    </Section>
  )
}
