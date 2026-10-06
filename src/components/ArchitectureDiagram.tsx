import type { CSSProperties } from 'react'
import type { NodeKind, Project } from '../data/projects'
import { Reveal } from './Reveal'

const legend: { kind: NodeKind; label: string }[] = [
  { kind: 'client', label: 'Client' },
  { kind: 'api', label: 'API' },
  { kind: 'process', label: 'Processing' },
  { kind: 'data', label: 'Data' },
  { kind: 'ai', label: 'Model' },
  { kind: 'external', label: 'External' },
]

/** Lanes of top-to-bottom flows. Nodes appear in order; a pulse then travels down each connector. */
export function ArchitectureDiagram({ architecture }: { architecture: Project['architecture'] }) {
  const kinds = new Set(architecture.lanes.flatMap((l) => l.steps.map((s) => s.kind)))

  return (
    <figure className="arch">
      <Reveal variant="fade" className={`arch-lanes arch-lanes--${architecture.lanes.length}`}>
        {architecture.lanes.map((lane, li) => (
          <div className="arch-lane" key={lane.title}>
            <p className="arch-lane-title mono">{lane.title}</p>
            <ol className="arch-steps">
              {lane.steps.map((step, si) => (
                <li
                  key={step.label + si}
                  className="arch-step"
                  style={{ '--step': li * 2 + si, '--last': lane.steps.length } as CSSProperties}
                >
                  {si > 0 && (
                    <span className="arch-link" aria-hidden="true">
                      <span className="arch-pulse" />
                    </span>
                  )}
                  <div className={`arch-node arch-node--${step.kind}`}>
                    <span className="arch-node-label">{step.label}</span>
                    {step.sub && <span className="arch-node-sub">{step.sub}</span>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </Reveal>
      <figcaption className="arch-caption">
        <span>{architecture.caption}</span>
        <span className="arch-legend">
          {legend
            .filter((l) => kinds.has(l.kind))
            .map((l) => (
              <span key={l.kind} className={`arch-legend-item arch-legend-item--${l.kind}`}>
                {l.label}
              </span>
            ))}
        </span>
      </figcaption>
    </figure>
  )
}
