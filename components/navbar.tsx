'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { label: 'Work',     href: '/projects'  },
  { label: 'Services', href: '/#services' },
  { label: 'Blog',     href: '/articles'  },
  { label: 'About',    href: '/about'     },
]

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [ejTime, setEjTime] = useState('')

  useEffect(() => {
    const update = () =>
      setEjTime(new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false,
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

  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) return null

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' :
    href.startsWith('/#') ? false :
    pathname.startsWith(href)

  const isTransparent = pathname === '/' && !scrolled && !menuOpen

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent border-transparent dark:border-transparent'
          : 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200 dark:border-white/5'
      }`}
      style={{ transform: 'translateY(var(--nav-offset, 0px))' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center h-16">

          {/* Logo — flex-1 so it mirrors the right side width */}
          <div className="flex-1">
            <Link href="/" className="inline-flex items-center gap-2 hover:opacity-70 transition">
              <Image src="/logo-pictogram.svg" alt="Hyperfantasy" width={24} height={24} />
              <span className="text-lg font-bold tracking-tight">HYPERFANTASY</span>
            </Link>
          </div>

          {/* Desktop links — centered */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? 'page' : undefined}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                  isActive(href)
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                    : isTransparent
                    ? 'text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                    : 'text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: timezone + CTA + theme toggle + admin + hamburger */}
          <div className="flex-1 flex items-center justify-end gap-2">
            {ejTime && (
              <span className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 dark:text-white/30 mr-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                East Java · {ejTime}
              </span>
            )}
            <Link
              href="/enquiry"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition hover:opacity-85"
              style={{ background: 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)' }}
            >
              Start a Project
            </Link>
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
              {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-slate-200 dark:border-white/5 bg-white/95 dark:bg-black/95 backdrop-blur-md" role="navigation" aria-label="Mobile navigation">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive(href)
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                    : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
