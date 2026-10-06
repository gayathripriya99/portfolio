import { useSyncExternalStore } from 'react'

// Preferences are applied to <html> before first paint by the inline script in index.html;
// this store reads that state and keeps it in sync afterwards.

export interface Prefs {
  theme: 'dark' | 'light'
  reducedMotion: boolean
  recruiter: boolean
}

const root = document.documentElement
const listeners = new Set<() => void>()

function read(): Prefs {
  return {
    theme: root.dataset.theme === 'light' ? 'light' : 'dark',
    reducedMotion: !root.classList.contains('motion'),
    recruiter: root.dataset.recruiter === 'on',
  }
}

let snapshot = read()

function save(key: string, value: string) {
  try {
    localStorage.setItem(`priyaos:${key}`, value)
  } catch {
    /* storage unavailable — preference lasts for this page view */
  }
}

function commit() {
  snapshot = read()
  listeners.forEach((l) => l())
}

export function setTheme(theme: Prefs['theme']) {
  root.dataset.theme = theme
  save('theme', theme)
  commit()
}

export function setReducedMotion(reduced: boolean) {
  root.classList.toggle('motion', !reduced && 'IntersectionObserver' in window)
  save('motion', reduced ? 'reduced' : 'full')
  commit()
}

export function setRecruiter(on: boolean) {
  if (on) root.dataset.recruiter = 'on'
  else delete root.dataset.recruiter
  save('recruiter', on ? 'on' : 'off')
  const url = new URL(location.href)
  if (url.searchParams.has('mode')) {
    url.searchParams.delete('mode')
    history.replaceState(history.state, '', url)
  }
  commit()
}

export function usePrefs() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => snapshot,
  )
}

export function getPrefs() {
  return snapshot
}
