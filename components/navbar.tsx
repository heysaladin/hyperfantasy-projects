'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Clock, ArrowUpRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { label: 'Projects', href: '/projects' },
  { label: 'Articles', href: '/articles' },
  { label: 'About',    href: '/about'    },
  { label: 'Contact',  href: '/enquiry'  },
]

const MOBILE_SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/hyperfantasy.creative/' },
  { label: 'Dribbble',  href: 'https://dribbble.com/hyperfantasy'               },
  { label: 'Behance',   href: 'https://www.behance.net/hyperfantasy'             },
  { label: 'X',         href: 'https://x.com/hyperfantasy_'                     },
]

function SocialIcon({ label }: { label: string }) {
  if (label === 'Instagram') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  )
  if (label === 'Dribbble') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.779-.197 1.591-.314 2.431-.314 2.275 0 4.368.779 6.043 2.072zm-10.516-.993c1.331 1.742 2.511 3.538 3.537 5.381-2.43.715-5.331 1.082-8.684 1.105.692-2.835 2.601-5.193 5.147-6.486zm-5.44 8.834l.013-.256c3.849-.005 7.169-.448 9.95-1.322.233.475.456.952.67 1.432-3.38 1.057-6.165 3.222-8.337 6.48-1.432-1.719-2.296-3.927-2.296-6.334zm3.829 7.81c1.969-3.088 4.482-5.098 7.598-6.027.928 2.42 1.609 4.91 2.043 7.46-3.349 1.291-6.953.666-9.641-1.433zm11.586.43c-.438-2.353-1.08-4.653-1.92-6.897 1.876-.265 3.94-.196 6.199.196-.437 2.786-2.028 5.192-4.279 6.701z"/></svg>
  )
  if (label === 'Behance') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/></svg>
  )
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mobileCompactRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<User | null>(null)
  const [ejTime, setEjTime] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const update = () =>
      setEjTime(new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: true,
      }))
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        // Stale/invalid refresh token — clear the broken session cookies
        supabase.auth.signOut()
        setUser(null)
        return
      }
      setUser(user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Keep --nav-height in sync with the actual visual nav height.
  // On /projects mobile the full nav (h-16 = 64px) always stays, so always 64px.
  // On other pages mobile the compact pill is shorter, so measure its actual height.
  useEffect(() => {
    const update = () => {
      const isMobile = window.innerWidth < 768
      if (scrolled && !menuOpen && isMobile && !pathname.startsWith('/projects')) {
        const h = mobileCompactRef.current?.offsetHeight ?? 44
        document.documentElement.style.setProperty('--nav-height', `${h}px`)
      } else {
        document.documentElement.style.setProperty('--nav-height', '64px')
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [scrolled, menuOpen, pathname])

  // Reset offset when leaving /projects
  useEffect(() => {
    if (!pathname.startsWith('/projects')) {
      document.documentElement.style.setProperty('--nav-offset', '0px')
    }
  }, [pathname])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) return null

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' :
    href.startsWith('/#') ? false :
    pathname.startsWith(href)

  const isTransparent = pathname === '/' && !scrolled && !menuOpen
  const isProjects = pathname.startsWith('/projects')

  return (
    <>
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-500"
      style={{ transform: 'translateY(var(--nav-offset, 0px))' }}
    >
      {/* Full navbar — on /projects stays visible on mobile even when scrolled */}
      <div
        className={`transition-all duration-500 ${
          scrolled && !menuOpen
            ? isProjects
              ? 'md:opacity-0 md:pointer-events-none'
              : 'opacity-0 pointer-events-none'
            : 'opacity-100'
        }`}
      >
        <div
          className={`transition-all duration-500 ${
            isTransparent
              ? 'bg-transparent border-transparent dark:border-transparent'
              : 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200 dark:border-white/5'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center h-16">

              {/* Logo */}
              <div className="flex-1">
                <Link href="/" className={`inline-flex items-center gap-2 hover:opacity-70 transition ${isTransparent ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  <Image src="/logo-pictogram.svg" alt="" width={24} height={24} />
                  <span className="text-lg font-bold tracking-tight">HYPERFANTASY</span>
                </Link>
              </div>

              {/* Desktop links */}
              <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive(href) ? 'page' : undefined}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                      isActive(href)
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                        : isTransparent
                        ? 'text-white/60 hover:text-white hover:bg-white/10'
                        : 'text-slate-400 dark:text-white/30 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Right */}
              <div className="flex-1 flex items-center justify-end gap-2">
                {ejTime && (
                  <span className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 dark:text-white/30 mr-1">
                    <Clock size={12} className="flex-shrink-0" />
                    {ejTime}
                  </span>
                )}
                <ThemeToggle />
                {user && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => setMenuOpen(v => !v)}
                  className="md:hidden p-2 rounded-lg text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                  aria-label="Toggle navigation menu"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                >
                  {menuOpen
                    ? <X size={20} aria-hidden="true" />
                    : <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true"><line x1="2" y1="7" x2="18" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="2" y1="13" x2="18" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  }
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Compact pill — on /projects mobile the full nav stays, so hide compact there */}
      <div
        className={`absolute top-0 left-0 right-0 flex justify-center items-start transition-all duration-500 pt-0 md:pt-3 ${
          scrolled && !menuOpen
            ? isProjects
              ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'
              : 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="hidden md:flex items-center gap-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-2 py-1.5"
          style={{
            borderRadius: 40,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: 'rgba(0,0,0,0.08) 0px 1px 2px, rgba(0,0,0,0.06) 0px 4px 12px',
          }}
        >
          {/* Logo */}
          <Link href="/" className="px-2 py-1 hover:opacity-70 transition inline-flex items-center text-slate-900 dark:text-white">
            <Image src="/logo-pictogram.svg" alt="Hyperfantasy" width={20} height={20} />
          </Link>

          <span className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />

          {/* Nav links */}
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                isActive(href)
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                  : 'text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              {label}
            </Link>
          ))}

          <span className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />

          {/* Right: clock + theme + admin */}
          <div className="flex items-center gap-1 pl-1">
            {ejTime && (
              <span className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 dark:text-white/30 px-2">
                <Clock size={12} className="flex-shrink-0" />
                {ejTime}
              </span>
            )}
            <ThemeToggle />
            {user && (
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
              >
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Mobile pill — just logo + hamburger */}
        <div
          ref={mobileCompactRef}
          className="flex md:hidden w-full items-center justify-between bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-5 py-3"
        >
          <Link href="/" className="hover:opacity-70 transition inline-flex items-center gap-2 text-slate-900 dark:text-white">
            <Image src="/logo-pictogram.svg" alt="" width={20} height={20} />
            <span className="text-sm font-bold tracking-tight">HYPERFANTASY</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="p-1.5 text-slate-400 dark:text-white/30 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen
                ? <X size={18} aria-hidden="true" />
                : <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><line x1="2" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="2" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              }
            </button>
          </div>
        </div>
      </div>

    </nav>

      {/* Mobile menu — portalled to body so transform on <nav> doesn't clip it */}
      {mounted && menuOpen && createPortal(
        <div
          id="mobile-menu"
          style={{ position: 'fixed', inset: 0, background: '#030017', zIndex: 9999, display: 'flex', flexDirection: 'column' }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <Link href="/" onClick={() => setMenuOpen(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff', textDecoration: 'none' }}>
              <Image src="/logo-pictogram.svg" alt="" width={22} height={22} />
              <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>HYPERFANTASY</span>
            </Link>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          {/* Nav links */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '24px 32px', overflowY: 'auto' }}>
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  color: isActive(href) ? '#fff' : 'rgba(255,255,255,0.55)',
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: 'clamp(32px,10vw,48px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {label}
                </span>
                <ArrowUpRight size={20} aria-hidden="true" style={{ opacity: isActive(href) ? 1 : 0.3, flexShrink: 0 }} />
              </Link>
            ))}
          </div>

        </div>,
        document.body
      )}
    </>
  )
}
