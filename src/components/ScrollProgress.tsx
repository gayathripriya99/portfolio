import { useEffect, useRef } from 'react'
import { onScrollFrame } from '../lib/motion'

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      onScrollFrame((y) => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? Math.min(1, y / max) : 0
        if (bar.current) bar.current.style.transform = `scaleX(${p})`
      }),
    [],
  )

  return <div className="scroll-progress" ref={bar} aria-hidden="true" />
}
