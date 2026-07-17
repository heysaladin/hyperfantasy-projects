'use client'

import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

export function ScrollReveal({
  children,
  delay = 0,
  className = '',
  style,
}: {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (delay) el.style.transitionDelay = `${delay}ms`

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('sr-in')
          obs.unobserve(el)
        }
      },
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`sr-box${className ? ` ${className}` : ''}`} style={style}>
      {children}
    </div>
  )
}
