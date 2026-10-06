import { useEffect, useState } from 'react'
import { onToast, type Toast } from '../lib/toast'

export function Toasts() {
  const [items, setItems] = useState<Toast[]>([])

  useEffect(
    () =>
      onToast((t) => {
        setItems((list) => [...list.slice(-2), t])
        window.setTimeout(() => setItems((list) => list.filter((x) => x.id !== t.id)), 3200)
      }),
    [],
  )

  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className="toast">
          <span className="toast-dot" aria-hidden="true" />
          <div>
            <p className="toast-title mono">{t.title}</p>
            {t.body && <p className="toast-body">{t.body}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
