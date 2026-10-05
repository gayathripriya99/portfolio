import { createElement, useEffect, useRef, type CSSProperties, type HTMLAttributes, type JSX } from 'react'
import { observeReveal } from '../lib/motion'

type Variant = 'up' | 'fade' | 'scale' | 'left'

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements
  /** Delay in ms, used for staggering siblings. */
  delay?: number
  variant?: Variant
}

export function useReveal<T extends Element>() {
  const ref = useRef<T>(null)
  useEffect(() => (ref.current ? observeReveal(ref.current) : undefined), [])
  return ref
}

export function Reveal({ as = 'div', delay = 0, variant = 'up', style, children, ...rest }: RevealProps) {
  const ref = useReveal<HTMLElement>()
  return createElement(
    as,
    { ref, 'data-reveal': variant, style: { ...style, '--d': `${delay}ms` } as CSSProperties, ...rest },
    children,
  )
}
