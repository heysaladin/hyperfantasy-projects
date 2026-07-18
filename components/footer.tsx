'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Send } from 'lucide-react'
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
  {
    label: 'Dribbble',
    href: 'https://dribbble.com/hyperfantasy',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.779-.197 1.591-.314 2.431-.314 2.275 0 4.368.779 6.043 2.072zm-10.516-.993c1.331 1.742 2.511 3.538 3.537 5.381-2.43.715-5.331 1.082-8.684 1.105.692-2.835 2.601-5.193 5.147-6.486zm-5.44 8.834l.013-.256c3.849-.005 7.169-.448 9.95-1.322.233.475.456.952.67 1.432-3.38 1.057-6.165 3.222-8.337 6.48-1.432-1.719-2.296-3.927-2.296-6.334zm3.829 7.81c1.969-3.088 4.482-5.098 7.598-6.027.928 2.42 1.609 4.91 2.043 7.46-3.349 1.291-6.953.666-9.641-1.433zm11.586.43c-.438-2.353-1.08-4.653-1.92-6.897 1.876-.265 3.94-.196 6.199.196-.437 2.786-2.028 5.192-4.279 6.701z" />
      </svg>
    ),
  },
  {
    label: 'Behance',
    href: 'https://www.behance.net/hyperfantasy',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/hyperfantasy.creative/',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/hyperfantasy_',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

const EXCLUDED = ['/projects', '/admin', '/login']

/* ── Icons ─────────────────────────────────────────────────────── */
function IconUpArrow({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 3.93934L20.0607 12L19 13.0607L12.75 6.81066V19.75H11.25V6.81066L5.00001 13.0607L3.93935 12L12 3.93934Z" />
    </svg>
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

  const isEnquiry = pathname === '/enquiry'

  const clocksRow = (
    <div className="flex items-center gap-8">
      {[
        { timezone: 'Asia/Jakarta',        label: 'Java — GMT+7' },
        { timezone: 'Europe/London',       label: 'GMT+1' },
        { timezone: 'America/Los_Angeles', label: 'GMT−7' },
      ].map(({ timezone, label }) => (
        <div key={timezone} className="flex items-center gap-3">
          <AnalogClock timezone={timezone} />
          <div>
            <p style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>{label}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}><LiveTime timezone={timezone} /></p>
          </div>
        </div>
      ))}
    </div>
  )

  const socialIcons = (
    <>
      {SOCIAL.map(({ label, href, svg }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="transition-colors duration-200"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >
          {svg}
        </a>
      ))}
    </>
  )

  const scrollTopBtn = (
    <button
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="group flex items-center justify-center shrink-0 transition-colors duration-200 hover:bg-white/10"
      style={{
        width: 44, height: 44,
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
        color: '#fff', cursor: 'pointer',
      }}
    >
      <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
        <IconUpArrow size={18} />
      </span>
    </button>
  )

  return (
    <footer
      className="sticky bottom-0 z-0 w-full"
      style={{ background: '#030017', color: '#fff' }}
    >

      {/* ── DESKTOP ───────────────────────────────────────── */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Top bar: logo · nav · social */}
          <div
            className="py-5 flex items-center justify-between gap-6"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex-1 flex items-center">
              <Link href="/" className="inline-flex items-center gap-2 opacity-100 hover:opacity-70 transition-opacity duration-200" style={{ color: '#fff' }}>
                <Image src="/logo-pictogram.svg" alt="" width={22} height={22} />
                <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>HYPERFANTASY</span>
              </Link>
            </div>
            <nav className="flex items-center gap-5 flex-wrap justify-center">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="hover:opacity-60 transition-opacity duration-200"
                  style={{ fontSize: 13, fontWeight: 500, color: '#fff', textDecoration: 'none' }}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex-1 flex items-center justify-end gap-4">
              {socialIcons}
            </div>
          </div>

          {/* Main: tagline+copyright | CTA+email+clocks */}
          <div className="py-14 flex flex-col lg:flex-row gap-14 justify-between">

            {/* Left: tagline + copyright */}
            <div className="flex flex-col justify-between gap-6 shrink-0" style={{ maxWidth: 400 }}>
              <h2 style={{ fontSize: 'clamp(24px,2.8vw,40px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                Your turn.<br />Got a fantasy?<br />
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Let&apos;s make it real.</span>
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.01em' }}>
                © {new Date().getFullYear()} Hyperfantasy. All rights reserved.
              </p>
            </div>

            {/* Right: CTA + clocks + scroll-top */}
            <div className="flex flex-col justify-between gap-10">

              {/* Big CTA */}
              {!isEnquiry && (
                <div className="flex flex-col gap-5">
                  <Link href="/enquiry" className="group inline-flex items-end gap-4">
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
                      style={{
                        flexShrink: 0, width: 56, height: 56, borderRadius: '50%',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 12,
                        background: 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      }}
                    >
                      <Send size={22} aria-hidden="true" />
                    </span>
                  </Link>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>or</span>
                    <a
                      href="mailto:hello.hyperfantasy@gmail.com"
                      className="inline-flex items-center gap-2 transition-colors duration-200 hover:bg-white/10"
                      style={{
                        padding: '8px 16px',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 48, fontSize: 13,
                        color: 'rgba(255,255,255,0.75)',
                        background: 'rgba(255,255,255,0.04)',
                      }}
                    >
                      Send an email
                    </a>
                  </div>
                </div>
              )}

              {/* Clocks + scroll-top */}
              <div className="flex items-end justify-between gap-6">
                {clocksRow}
                {scrollTopBtn}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── MOBILE ────────────────────────────────────────── */}
      <div className="md:hidden relative">
        <div className="px-6 py-12 flex flex-col gap-8">

          {/* Tagline */}
          <h2 style={{ fontSize: 'clamp(36px,10vw,56px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            Your turn.<br />Got a fantasy?<br />
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Let&apos;s make it real.</span>
          </h2>

          {/* CTA */}
          {!isEnquiry && (
            <div className="flex flex-col gap-4">
              <Link href="/enquiry" className="group inline-flex items-center gap-3 self-start">
                <span className="relative inline-flex overflow-hidden" style={{ height: 'clamp(40px,10vw,56px)' }}>
                  <span
                    className="flex items-center transition-transform duration-500 ease-in-out group-hover:-translate-y-full"
                    style={{ fontSize: 'clamp(34px,9vw,48px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1 }}
                  >
                    Let&apos;s Collaborate
                  </span>
                  <span
                    className="absolute inset-0 flex items-center translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"
                    style={{ fontSize: 'clamp(34px,9vw,48px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1, color: 'rgba(255,255,255,0.5)' }}
                  >
                    Let&apos;s Collaborate
                  </span>
                </span>
                <span
                  className="transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1"
                  style={{
                    flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  <Send size={17} aria-hidden="true" />
                </span>
              </Link>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>or</span>
                <a
                  href="mailto:hello.hyperfantasy@gmail.com"
                  className="inline-flex items-center gap-2 transition-colors duration-200 hover:bg-white/10"
                  style={{
                    padding: '7px 14px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 48, fontSize: 13,
                    color: 'rgba(255,255,255,0.75)',
                    background: 'rgba(255,255,255,0.04)',
                  }}
                >
                  Send an email
                </a>
              </div>
            </div>
          )}

          {/* Clocks — Java with SVG, others text only */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <AnalogClock timezone="Asia/Jakarta" />
              <div>
                <p style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>Java — GMT+7</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}><LiveTime timezone="Asia/Jakarta" /></p>
              </div>
            </div>
            {[
              { timezone: 'Europe/London',       tz: 'GMT+1' },
              { timezone: 'America/Los_Angeles', tz: 'GMT−7' },
            ].map(({ timezone, tz }) => (
              <div key={timezone}>
                <p style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>{tz}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}><LiveTime timezone={timezone} /></p>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />

          {/* Logo mark — left */}
          <div>
            <Link href="/" className="inline-flex hover:opacity-70 transition-opacity duration-200">
              <Image src="/logo-pictogram.svg" alt="Hyperfantasy" width={24} height={24} />
            </Link>
          </div>

          {/* Nav links — left */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="hover:opacity-60 transition-opacity duration-200"
                style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Social icons — left */}
          <div className="flex items-center gap-5">
            {socialIcons}
          </div>

          {/* Copyright */}
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.01em' }}>
            © {new Date().getFullYear()} Hyperfantasy. All rights reserved.
          </p>

        </div>

        {/* Back to top — absolute bottom right */}
        <div style={{ position: 'absolute', bottom: 40, right: 24 }}>
          {scrollTopBtn}
        </div>
      </div>

    </footer>
  )
}
