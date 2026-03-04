'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const IMAGES = [
  'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=60&w=500',
  'https://images.unsplash.com/photo-1532619187608-e5375cab36aa?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=80&w=500',
]

const ACCENT = '#b394f4'

export function HomeAboutCarousel() {
  const [active, setActive] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startInterval = () => {
    intervalRef.current = setInterval(() => setActive(i => (i + 1) % 3), 3000)
  }

  useEffect(() => {
    startInterval()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const goTo = (i: number) => {
    setActive(i)
    if (intervalRef.current) clearInterval(intervalRef.current)
    startInterval()
  }

  return (
    <div
      className="relative flex justify-center"
      role="region"
      aria-label="About us image gallery"
      onMouseEnter={() => { if (intervalRef.current) clearInterval(intervalRef.current) }}
      onMouseLeave={startInterval}
      onFocus={() => { if (intervalRef.current) clearInterval(intervalRef.current) }}
      onBlur={startInterval}
    >
      {/* Decorative background square */}
      <div style={{
        position: 'absolute', width: 160, height: 160,
        background: '#15125c', borderRadius: 32,
        top: -26, left: 'calc(50% - 209px - 30px)', zIndex: 0,
      }} className="hidden lg:block" aria-hidden="true" />

      <div
        style={{ width: 418, height: 418, maxWidth: '100%', borderRadius: 16, overflow: 'hidden', position: 'relative', zIndex: 1 }}
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Image ${active + 1} of ${IMAGES.length}`}
      >
        {IMAGES.map((src, i) => (
          <Image key={i} src={src} alt={`About Hyperfantasy — image ${i + 1}`}
            fill
            sizes="418px"
            className="object-cover rounded-2xl"
            priority={i === 0}
            style={{
              opacity: active === i ? 1 : 0,
              transition: 'opacity 0.8s ease',
            }}
          />
        ))}
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 absolute" style={{ bottom: -32, left: 0, right: 0 }} role="tablist" aria-label="Image navigation">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={active === i}
            aria-label={`Show image ${i + 1} of ${IMAGES.length}`}
            onClick={() => goTo(i)}
            style={{
              width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: active === i ? ACCENT : 'rgba(179,148,244,0.5)',
              transition: 'background .3s',
              outline: 'none',
            }}
            onFocus={e => { (e.currentTarget as HTMLElement).style.outline = `2px solid ${ACCENT}`; (e.currentTarget as HTMLElement).style.outlineOffset = '3px' }}
            onBlur={e => { (e.currentTarget as HTMLElement).style.outline = 'none' }}
          />
        ))}
      </div>
    </div>
  )
}
