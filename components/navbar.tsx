'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { label: 'Projects', href: '/projects'  },
  { label: 'Articles', href: '/articles'  },
  { label: 'About',   href: '/about'     },
  { label: 'Enquiry', href: '/enquiry'   },
]

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
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
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav
      className="fixed top-0 w-full z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200 dark:border-white/5 transition-transform duration-300"
      style={{ transform: 'translateY(var(--nav-offset, 0px))' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition">
            <img src="/logo-pictogram.svg" alt="Hyperfantasy" className="h-6 w-auto" />
            <span className="text-lg font-bold tracking-tight">HYPERFANTASY</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  isActive(href)
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                    : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right: theme toggle + admin + hamburger */}
          <div className="flex items-center gap-2">
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
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/5 bg-white/95 dark:bg-black/95 backdrop-blur-md">
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
