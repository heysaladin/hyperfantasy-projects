'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

/* ── Data ──────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Projects', href: '/projects' },
  { label: 'Articles', href: '/articles' },
  { label: 'About',    href: '/about'    },
  { label: 'Contact',  href: '/enquiry'  },
]

const SOCIAL = [
  { label: 'Dribbble',  href: 'https://dribbble.com/hyperfantasy' },
  { label: 'Behance',   href: 'https://www.behance.net/hyperfantasy' },
  { label: 'Instagram', href: 'https://www.instagram.com/hyperfantasy.design' },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/hyperfantasy' },
]

const EXCLUDED = ['/projects', '/admin', '/login']

/* ── Icons ─────────────────────────────────────────────────────── */
function IconDiagonalArrow({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.25 6.25H17.75V17.75H16.25V8.81066L7 18.0607L5.93934 17L15.1893 7.75H6.25V6.25Z" />
    </svg>
  )
}

function IconRightArrow({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 3.93934L20.0607 12L12 20.0607L10.9393 19L17.1893 12.75H4.25V11.25H17.1893L10.9393 5L12 3.93934Z" />
    </svg>
  )
}

function IconUpArrow({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 3.93934L20.0607 12L19 13.0607L12.75 6.81066V19.75H11.25V6.81066L5.00001 13.0607L3.93935 12L12 3.93934Z" />
    </svg>
  )
}

/* ── Slide-up link animation ────────────────────────────────────── */
function SlideLink({
  label, href, external = false, className = '', suffix,
}: {
  label: string
  href: string
  external?: boolean
  className?: string
  suffix?: React.ReactNode
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`group inline-flex items-center gap-2 ${className}`}
    >
      <span className="relative inline-flex overflow-hidden" style={{ height: '1.5rem' }}>
        <span className="flex items-center text-white transition-transform duration-300 ease-in-out group-hover:-translate-y-full" style={{ fontSize: 18, lineHeight: 1 }}>
          {label}
        </span>
        <span className="absolute inset-0 flex items-center translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0" style={{ fontSize: 18, lineHeight: 1, color: 'rgba(255,255,255,0.55)' }}>
          {label}
        </span>
      </span>
      {suffix}
    </a>
  )
}

/* ── Analog Clock ───────────────────────────────────────────────── */
function AnalogClock({ timezone }: { timezone: string }) {
  const [hands, setHands] = useState<{ hx: number; hy: number; mx: number; my: number } | null>(null)

  useEffect(() => {
    function update() {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }))
      const h = now.getHours() % 12
      const m = now.getMinutes()
      const s = now.getSeconds()
      const hDeg = h * 30 + m * 0.5
      const mDeg = m * 6 + s * 0.1
      const cx = 50, cy = 50
      setHands({
        hx: cx + 24 * Math.sin((hDeg * Math.PI) / 180),
        hy: cy - 24 * Math.cos((hDeg * Math.PI) / 180),
        mx: cx + 34 * Math.sin((mDeg * Math.PI) / 180),
        my: cy - 34 * Math.cos((mDeg * Math.PI) / 180),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [timezone])

  /* 7 tick dots at non-cardinal positions (Kretya style) */
  const ticks = [0, 45, 90, 135, 210, 270, 315].map(deg => {
    const r = 42, rad = (deg - 90) * Math.PI / 180
    return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) }
  })

  return (
    <svg width="40" height="40" viewBox="0 0 100 100">
      {ticks.map((t, i) => (
        <rect key={i} x={t.x - 2} y={t.y - 2} width="4" height="4" fill="white" rx="1" opacity="0.8" />
      ))}
      {hands && (
        <>
          <line x1="50" y1="50" x2={hands.hx} y2={hands.hy} stroke="white" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="50" y1="50" x2={hands.mx} y2={hands.my} stroke="white" strokeWidth="3.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

/* ── Digital time display ────────────────────────────────────────── */
function LiveTime({ timezone }: { timezone: string }) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    function update() {
      const d = new Date()
      setDisplay(d.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: true }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [timezone])

  return <span>{display}</span>
}

/* ── Footer ─────────────────────────────────────────────────────── */
export function Footer() {
  const pathname = usePathname()

  if (EXCLUDED.some(p => pathname.startsWith(p))) return null

  return (
    <footer
      className="sticky bottom-0 z-0 w-full"
      style={{ background: '#030017', color: '#fff' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ─── Top: Nav · Logo · Social ─────────────────── */}
        <div
          className="py-12 flex flex-col md:flex-row md:items-start justify-between gap-10"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Nav group */}
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '1.25rem', fontWeight: 500 }}>
              Navigation
            </p>
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map(({ label, href }) => (
                <SlideLink key={href} label={label} href={href} />
              ))}
            </div>
          </div>

          {/* Logo */}
          <div className="flex items-start md:items-center md:justify-center md:pt-0 pt-2">
            <Link href="/" className="inline-flex items-center gap-3 opacity-90 hover:opacity-60 transition-opacity duration-200">
              <Image src="/logo-pictogram.svg" alt="Hyperfantasy" width={32} height={32} />
              <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                Hyperfantasy
              </span>
            </Link>
          </div>

          {/* Social group */}
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '1.25rem', fontWeight: 500 }}>
              Connect
            </p>
            <div className="flex flex-col gap-3">
              {SOCIAL.map(({ label, href }) => (
                <SlideLink
                  key={label}
                  label={label}
                  href={href}
                  external
                  suffix={
                    <span className="relative inline-flex overflow-hidden transition-all duration-300" style={{ width: 18, height: 18 }}>
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:-translate-y-full group-hover:translate-x-full" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        <IconDiagonalArrow />
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center translate-y-full -translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-y-0 group-hover:translate-x-0">
                        <IconDiagonalArrow />
                      </span>
                    </span>
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* ─── Bottom: Tagline · Big CTA · Time ─────────── */}
        <div className="py-14 flex flex-col lg:flex-row gap-14 justify-between">

          {/* Tagline + copyright */}
          <div className="flex flex-col justify-between gap-6 shrink-0" style={{ maxWidth: 400 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(24px,2.8vw,40px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                Think bold, build clean,<br />and stay super new.<br />
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Hyperfantasy can do it.</span>
              </h2>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.01em' }}>
              © {new Date().getFullYear()} Hyperfantasy. All rights reserved.
            </p>
          </div>

          {/* Right column: CTA + clock + scroll-top */}
          <div className="flex flex-col justify-between gap-10">

            {/* Big CTA link */}
            <div className="flex flex-col gap-5">
              <Link
                href="/enquiry"
                className="group inline-flex items-center gap-4"
              >
                <span className="relative inline-flex overflow-hidden" style={{ height: 'clamp(56px,7.5vw,90px)' }}>
                  <span
                    className="flex items-center transition-transform duration-500 ease-in-out group-hover:-translate-y-full"
                    style={{ fontSize: 'clamp(48px,6.5vw,78px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1 }}
                  >
                    Let&apos;s Collaborate
                  </span>
                  <span
                    className="absolute inset-0 flex items-center translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"
                    style={{ fontSize: 'clamp(48px,6.5vw,78px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1, color: 'rgba(255,255,255,0.5)' }}
                  >
                    Let&apos;s Collaborate
                  </span>
                </span>
                <span
                  className="transition-transform duration-300 ease-in-out group-hover:translate-x-2 group-hover:-translate-y-2"
                  style={{ color: 'rgba(255,255,255,0.8)', flexShrink: 0 }}
                >
                  <IconRightArrow size={56} />
                </span>
              </Link>

              {/* "or" + email */}
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>or</span>
                <a
                  href="mailto:hello@hyperfantasy.co"
                  className="inline-flex items-center gap-2 transition-colors duration-200 hover:bg-white/10"
                  style={{
                    padding: '8px 16px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 3,
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.75)',
                    background: 'rgba(255,255,255,0.04)',
                  }}
                >
                  hello@hyperfantasy.co
                </a>
              </div>
            </div>

            {/* Clock + scroll-top */}
            <div className="flex items-end justify-between gap-6">

              {/* Jakarta clock */}
              <div className="flex items-center gap-3">
                <AnalogClock timezone="Asia/Jakarta" />
                <div>
                  <p style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>
                    Currently in East Java — GMT+7
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                    <LiveTime timezone="Asia/Jakarta" />
                  </p>
                </div>
              </div>

              {/* Scroll to top */}
              <button
                aria-label="Scroll to top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex items-center justify-center shrink-0 transition-colors duration-200 hover:bg-white/10"
                style={{
                  width: 44,
                  height: 44,
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
                  <IconUpArrow size={18} />
                </span>
              </button>

            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
