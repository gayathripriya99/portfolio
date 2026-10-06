export interface Toast {
  id: number
  title: string
  body?: string
}

type Listener = (t: Toast) => void
const listeners = new Set<Listener>()
let seq = 0

export function toast(title: string, body?: string) {
  const t = { id: ++seq, title, body }
  listeners.forEach((l) => l(t))
}

export function onToast(l: Listener) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
