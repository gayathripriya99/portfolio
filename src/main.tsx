import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/base.css'
import './styles/motion.css'
import './styles/sections.css'
import './styles/case-study.css'

// Follow the OS setting live: turning on reduced motion immediately shows everything in its final state.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
reduced.addEventListener('change', (e) => {
  document.documentElement.classList.toggle('motion', !e.matches && 'IntersectionObserver' in window)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
