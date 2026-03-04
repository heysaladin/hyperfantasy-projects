'use client'

import { useEffect, useState } from 'react'

const IMAGES = [
  'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=60&w=500',
  'https://images.unsplash.com/photo-1532619187608-e5375cab36aa?auto=format&fit=crop&q=80&w=500',
  'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=80&w=500',
]

const ACCENT = '#b394f4'

export function HomeAboutCarousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % 3), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative flex justify-center">
      {/* Decorative background square */}
      <div style={{
        position: 'absolute', width: 160, height: 160,
        background: '#15125c', borderRadius: 32,
        top: -26, left: 'calc(50% - 209px - 30px)', zIndex: 0,
      }} className="hidden lg:block" />

      <div style={{ width: 418, height: 418, maxWidth: '100%', borderRadius: 16, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {IMAGES.map((src, i) => (
          <img key={i} src={src} alt={`About ${i + 1}`}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', borderRadius: 16,
              opacity: active === i ? 1 : 0,
              transition: 'opacity 0.8s ease',
            }}
          />
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 absolute" style={{ bottom: -32, left: 0, right: 0 }}>
        {IMAGES.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{
              width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: active === i ? ACCENT : 'rgba(179,148,244,0.3)', transition: 'background .3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
