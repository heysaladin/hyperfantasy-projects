'use client'

import { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  duration?: number  // seconds for one full cycle (like CSS animation-duration)
}

export function TestimonialMarquee({ children, duration = 52 }: Props) {
  const trackRef  = useRef<HTMLDivElement>(null)
  const pos       = useRef(0)
  const dragging  = useRef(false)
  const dragStart = useRef({ x: 0, pos: 0 })
  const rafId     = useRef<number>(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const animate = () => {
      if (!dragging.current) {
        // Speed = half-track-width / (duration * 60fps) — same behaviour as CSS animation
        const half  = track.scrollWidth / 2
        const speed = half / (duration * 60)
        pos.current -= speed
        if (pos.current <= -half) pos.current += half
      }
      track.style.transform = `translateX(${pos.current}px)`
      rafId.current = requestAnimationFrame(animate)
    }

    rafId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId.current!)
  }, [duration])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    dragStart.current = { x: e.clientX, pos: pos.current }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    const delta = e.clientX - dragStart.current.x
    const track = trackRef.current!
    const half  = track.scrollWidth / 2
    pos.current = dragStart.current.pos + delta
    // Keep within infinite range
    while (pos.current < -half) pos.current += half
    while (pos.current > 0)     pos.current -= half
  }

  const stopDrag = () => { dragging.current = false }

  return (
    <div
      className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerLeave={stopDrag}
    >
      <div ref={trackRef} style={{ display: 'flex', gap: 20, width: 'max-content' }}>
        {children}
      </div>
    </div>
  )
}
