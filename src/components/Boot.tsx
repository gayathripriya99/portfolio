import { useCallback, useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'

const CHECKS = ['React runtime', 'TypeScript engine', 'API layer', 'Database layer', 'AI systems', `Developer profile — ${profile.name}`]
const STEP_MS = 120
export const BOOT_KEY = 'priyaos:booted'

/** Short, skippable boot sequence. Shown once per browser session. */
export function Boot({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const done = useRef(false)

  const finish = useCallback(() => {
    if (done.current) return
    done.current = true
    try {
      sessionStorage.setItem(BOOT_KEY, '1')
    } catch {
      /* ignore */
    }
    setLeaving(true)
    window.setTimeout(onDone, 380)
  }, [onDone])

  useEffect(() => {
    const total = CHECKS.length + 2
    const timer = window.setInterval(() => {
      setStep((s) => {
        if (s >= total) {
          window.clearInterval(timer)
          window.setTimeout(finish, 260)
          return s
        }
        return s + 1
      })
    }, STEP_MS)
    const skip = (e: Event) => {
      if (e instanceof KeyboardEvent && (e.metaKey || e.ctrlKey)) return
      finish()
    }
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [finish])

  return (
    <div className={`boot ${leaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading PRIYA.OS">
      <div className="boot-inner mono">
        <p className="boot-title">
          INITIALIZING PRIYA.OS<span className="boot-dots">...</span>
        </p>
        <ul className="boot-lines">
          {CHECKS.map((c, i) => (
            <li key={c} className={step > i ? 'is-on' : ''}>
              <span className="boot-ok">[ OK ]</span> {c}
            </li>
          ))}
        </ul>
        <p className={`boot-ready ${step > CHECKS.length ? 'is-on' : ''}`}>SYSTEM READY</p>
        <div className="boot-bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.min(1, step / (CHECKS.length + 1))})` }} />
        </div>
      </div>
      <button type="button" className="boot-skip mono" onClick={finish}>
        Skip <kbd>↵</kbd>
      </button>
    </div>
  )
}
