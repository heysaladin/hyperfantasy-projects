'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export function TeamImageFlicker({ src, alt }: { src: string; alt: string }) {
  const [color, setColor] = useState(() => Math.random() > 0.5)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const schedule = (current: boolean) => {
      const duration = 4000 + Math.random() * 4000
      timerRef.current = setTimeout(() => {
        const next = !current
        setColor(next)
        schedule(next)
      }, duration)
    }
    schedule(color)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const style = {
    filter: color ? 'grayscale(0)' : 'grayscale(1)',
    transition: 'filter 0.5s ease-in-out',
  }

  if (src.startsWith('data:')) {
    return (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        style={style}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover group-hover:scale-105 transition-transform duration-500"
      style={style}
    />
  )
}
