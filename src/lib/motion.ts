// One IntersectionObserver and one rAF-throttled scroll listener for the whole page.

let observer: IntersectionObserver | null = null

function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0 },
  )
  return observer
}

/** Adds `is-visible` once the element first enters the viewport. */
export function observeReveal(el: Element) {
  const io = getObserver()
  if (!io) {
    el.classList.add('is-visible')
    return () => {}
  }
  io.observe(el)
  return () => io.unobserve(el)
}

export function motionEnabled() {
  return document.documentElement.classList.contains('motion')
}

type ScrollFn = (y: number) => void
const scrollSubs = new Set<ScrollFn>()
let ticking = false

function flush() {
  ticking = false
  const y = window.scrollY
  scrollSubs.forEach((fn) => fn(y))
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(flush)
}

/** Subscribe to scroll position, batched to one callback per frame. */
export function onScrollFrame(fn: ScrollFn) {
  if (scrollSubs.size === 0) {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  }
  scrollSubs.add(fn)
  fn(window.scrollY)
  return () => {
    scrollSubs.delete(fn)
    if (scrollSubs.size === 0) {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }
}
