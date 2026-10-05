import type { CSSProperties } from 'react'
import type { Project } from '../data/portfolio'

/** Lightweight illustrative previews drawn in HTML/CSS — swap for real screenshots when available. */
export function ProjectPreview({ kind }: { kind: Project['preview'] }) {
  return (
    <div className={`preview preview--${kind}`} aria-hidden="true">
      <div className="preview-inner">
        {kind === 'mentor' && (
          <div className="pv-mentor">
            <div className="pv-doc">
              <span className="pv-doc-icon">PDF</span>
              <span className="pv-lines">
                <i style={{ width: '78%' }} />
                <i style={{ width: '52%' }} />
              </span>
            </div>
            <div className="pv-bubble pv-bubble--user">Explain the key ideas in chapter 3</div>
            <div className="pv-bubble pv-bubble--ai">
              <span className="pv-ai-tag">From your notes</span>
              <span className="pv-lines">
                <i style={{ width: '92%' }} />
                <i style={{ width: '84%' }} />
                <i style={{ width: '60%' }} />
              </span>
            </div>
            <div className="pv-quiz">
              <span>Quiz · 3 questions</span>
              <span className="pv-quiz-dots">
                <i className="is-on" />
                <i className="is-on" />
                <i />
              </span>
            </div>
          </div>
        )}

        {kind === 'translate' && (
          <div className="pv-translate">
            <div className="pv-lang">
              <span className="pv-lang-code">EN</span>
              <span className="pv-lines">
                <i style={{ width: '90%' }} />
                <i style={{ width: '64%' }} />
              </span>
            </div>
            <div className="pv-arrow">→</div>
            <div className="pv-lang pv-lang--to">
              <span className="pv-lang-code">PT-BR</span>
              <span className="pv-lines">
                <i style={{ width: '82%' }} />
                <i style={{ width: '70%' }} />
              </span>
            </div>
          </div>
        )}

        {kind === 'voice' && (
          <div className="pv-voice">
            <div className="pv-wave">
              {[0.35, 0.6, 0.9, 0.55, 1, 0.7, 0.4, 0.8, 0.5, 0.3, 0.65, 0.45].map((h, i) => (
                <i key={i} style={{ '--h': h, '--wi': i } as CSSProperties} />
              ))}
            </div>
            <div className="pv-word">
              janvier <span className="pv-score">✓ 94%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
