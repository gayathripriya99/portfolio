import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useOS } from '../lib/os'
import { complete, run, type Line } from '../lib/terminal'
import { Close } from './Icons'

const WELCOME: Line[] = [
  { kind: 'accent', text: 'PRIYA.OS terminal — v4' },
  { kind: 'muted', text: "Type 'help' to see what I can do. Esc closes." },
]

export function Terminal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const os = useOS()
  const [lines, setLines] = useState<Line[]>(WELCOME)
  const [value, setValue] = useState('')
  const history = useRef<string[]>([])
  const cursor = useRef(-1)
  const cwd = useRef({ value: '~' })
  const input = useRef<HTMLInputElement>(null)
  const screen = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) input.current?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight })
  }, [lines])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const cmd = value
    const res = run(cmd, os, cwd.current)
    const echo: Line = { kind: 'in', text: `${cwd.current.value} $ ${cmd}` }
    setLines((l) => (res.clear ? [] : [...l, echo, ...res.lines]))
    if (cmd.trim()) history.current.unshift(cmd)
    cursor.current = -1
    setValue('')
    res.effect?.()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const h = history.current
      if (!h.length) return
      cursor.current = e.key === 'ArrowUp' ? Math.min(h.length - 1, cursor.current + 1) : Math.max(-1, cursor.current - 1)
      setValue(cursor.current === -1 ? '' : h[cursor.current])
    } else if (e.key === 'Tab') {
      const c = complete(value)
      if (c) {
        e.preventDefault()
        setValue(c)
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div className={`term ${open ? 'is-open' : ''}`} role="dialog" aria-label="Terminal" aria-hidden={!open} inert={!open}>
      <div className="term-bar mono">
        <span className="term-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>priya@os: {cwd.current.value}</span>
        <button type="button" className="term-close" onClick={onClose} aria-label="Close terminal">
          <Close size={15} />
        </button>
      </div>
      <div className="term-screen mono" ref={screen} onClick={() => input.current?.focus({ preventScroll: true })} aria-live="polite">
        {lines.map((l, i) => (
          <p key={i} className={`term-line term-line--${l.kind}`}>
            {l.text || ' '}
          </p>
        ))}
        <form className="term-form" onSubmit={submit}>
          <label htmlFor="term-input" className="term-prompt">
            {cwd.current.value} $
          </label>
          <input
            id="term-input"
            ref={input}
            className="term-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="send"
          />
        </form>
      </div>
    </div>
  )
}
