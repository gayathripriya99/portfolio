import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { getPrefs, setReducedMotion } from './lib/prefs'
import './styles/tokens.css'
import './styles/base.css'
import './styles/motion.css'
import './styles/chrome.css'
import './styles/sections.css'
import './styles/diagram.css'
import './styles/case-study.css'

// Follow the OS setting live: turning on reduced motion shows everything in its final state immediately.
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  if (e.matches && !getPrefs().reducedMotion) setReducedMotion(true)
})

// A note for the curious who open devtools.
console.log(
  '%cPRIYA.OS%c\nHi! You opened the console — my kind of person.\nPress ⌘K / Ctrl+K, or ` for the terminal. Try: sudo hire priya',
  'font: 600 20px Geist Mono, monospace; color: #86d9a8',
  'font: 12px Geist Mono, monospace; color: #b3afa5',
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
