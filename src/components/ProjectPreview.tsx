import type { Project } from '../data/projects'

const Lines = ({ widths }: { widths: number[] }) => (
  <span className="pv-lines">
    {widths.map((w, i) => (
      <i key={i} style={{ width: `${w}%` }} />
    ))}
  </span>
)

/** Illustrative product UI previews drawn in HTML/CSS — replace with real screenshots when available. */
export function ProjectPreview({ kind }: { kind: Project['preview'] }) {
  return (
    <div className={`preview preview--${kind}`} aria-hidden="true">
      <div className="preview-inner">
        {kind === 'mentor' && (
          <div className="pv-window">
            <div className="pv-chrome mono">
              <i />
              <i />
              <i />
              <span>priya-mentor-ai</span>
            </div>
            <div className="pv-mentor">
              <div className="pv-doc">
                <span className="pv-tag pv-tag--pink">PDF</span>
                <Lines widths={[78, 50]} />
              </div>
              <div className="pv-bubble pv-bubble--user">Explain chapter 3’s key ideas</div>
              <div className="pv-bubble pv-bubble--ai">
                <span className="pv-ai-tag mono">↳ from your notes</span>
                <Lines widths={[94, 86, 58]} />
              </div>
              <div className="pv-quiz mono">
                <span>quiz · 3 questions · json ✓</span>
                <span className="pv-quiz-dots">
                  <i className="is-on" />
                  <i className="is-on" />
                  <i />
                </span>
              </div>
            </div>
          </div>
        )}

        {kind === 'platform' && (
          <div className="pv-window">
            <div className="pv-chrome mono">
              <i />
              <i />
              <i />
              <span>outbox · IndexedDB</span>
              <span className="pv-net">
                <span className="pv-net-dot" /> reconnected
              </span>
            </div>
            <ul className="pv-outbox mono">
              {[
                ['PUT', '/progress', 'synced'],
                ['POST', '/activity', 'synced'],
                ['POST', '/vocabulary', 'syncing'],
                ['PUT', '/tracker', 'queued'],
              ].map(([m, p, s]) => (
                <li key={p}>
                  <span className="pv-method">{m}</span>
                  <span className="pv-path">{p}</span>
                  <span className={`pv-state pv-state--${s}`}>{s}</span>
                </li>
              ))}
            </ul>
            <div className="pv-speech mono">
              <span className="pv-mic" />
              SpeechModule
              <span className="pv-wave">
                {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.7, 0.35].map((h, i) => (
                  <i key={i} style={{ transform: `scaleY(${h})` }} />
                ))}
              </span>
            </div>
          </div>
        )}

        {kind === 'access' && (
          <div className="pv-window">
            <div className="pv-chrome mono">
              <i />
              <i />
              <i />
              <span>accessflow · tenant: acme</span>
            </div>
            <table className="pv-matrix mono">
              <thead>
                <tr>
                  <th />
                  <th>read</th>
                  <th>write</th>
                  <th>delete</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['admin', 1, 1, 1],
                  ['editor', 1, 1, 0],
                  ['viewer', 1, 0, 0],
                ].map(([r, ...c]) => (
                  <tr key={r as string}>
                    <th>{r}</th>
                    {c.map((v, i) => (
                      <td key={i} className={v ? 'is-yes' : 'is-no'}>
                        {v ? '✓' : '×'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pv-decision mono">
              <span className="pv-allow">ALLOW</span> editor · write · dept = owner
            </div>
          </div>
        )}

        {kind === 'chatbot' && (
          <div className="pv-window pv-window--narrow">
            <div className="pv-chrome mono">
              <i />
              <i />
              <i />
              <span>support</span>
              <span className="pv-model">ollama ⇄ cloud</span>
            </div>
            <div className="pv-mentor">
              <div className="pv-bubble pv-bubble--user">How do I reset my progress?</div>
              <div className="pv-bubble pv-bubble--ai">
                <span className="pv-ai-tag mono">↳ assistant</span>
                <Lines widths={[90, 72]} />
              </div>
              <div className="pv-typing">
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
        )}

        {kind === 'erp' && (
          <div className="pv-window">
            <div className="pv-chrome mono">
              <i />
              <i />
              <i />
              <span>students</span>
              <span className="pv-model">+ new</span>
            </div>
            <table className="pv-table mono">
              <thead>
                <tr>
                  <th>student</th>
                  <th>course</th>
                  <th>marks</th>
                </tr>
              </thead>
              <tbody>
                {[72, 58, 86, 64].map((w, i) => (
                  <tr key={i}>
                    <td>
                      <i style={{ width: `${w}%` }} />
                    </td>
                    <td>
                      <i style={{ width: `${100 - w / 2}%` }} />
                    </td>
                    <td>
                      <span className="pv-bar" style={{ transform: `scaleX(${0.4 + (w % 50) / 100})` }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
