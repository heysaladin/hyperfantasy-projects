'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
const NAV_LINKS = [
  { label: 'Projects', href: '/projects' },
  { label: 'Articles', href: '/articles' },
  { label: 'About',   href: '/about'    },
  { label: 'Enquiry', href: '/enquiry'  },
]

const SOCIAL = [
  {
    label: 'Dribbble',
    href: 'https://dribbble.com/hyperfantasy',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm7.92 5.637a10.06 10.06 0 0 1 2.254 6.275c-.33-.067-3.63-.737-6.95-.32-.075-.18-.143-.367-.22-.554-.21-.522-.438-1.044-.672-1.548 3.658-1.49 5.33-3.634 5.588-3.853zM12 1.999a10.03 10.03 0 0 1 6.738 2.588c-.22.19-1.718 2.2-5.254 3.523C11.879 5.478 10.24 3.373 9.98 3.028A10.1 10.1 0 0 1 12 1.999zm-3.87.957c.248.327 1.855 2.44 3.476 5.006C7.19 8.88 3.54 8.862 3.18 8.853A10.07 10.07 0 0 1 8.13 2.956zM1.977 12.018v-.26c.35.008 4.624.06 9.145-1.27.256.503.496 1.014.72 1.527-.116.033-.232.066-.347.104-4.676 1.508-7.164 5.63-7.374 5.98A10.03 10.03 0 0 1 1.977 12.018zm10.023 10.005a10.03 10.03 0 0 1-6.065-2.027c.175-.34 2.17-4.187 7.32-5.997l.062-.02a36.14 36.14 0 0 1 1.842 6.533 10.01 10.01 0 0 1-3.159.511zm5.012-1.717a37.9 37.9 0 0 0-1.706-6.114c3.1-.494 5.822.317 6.155.42a10.07 10.07 0 0 1-4.449 5.694z"/></svg>,
  },
  {
    label: 'Behance',
    href: 'https://www.behance.net/hyperfantasy',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true"><path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.54-.67.98-1.16 1.32-.49.34-1.05.58-1.69.73-.63.15-1.28.23-1.95.23H0V4.51h6.938v-.007zM16.94 16.665c.44.428 1.073.643 1.894.643.59 0 1.1-.148 1.53-.447.428-.29.7-.61.806-.94h2.568c-.41 1.27-1.04 2.18-1.89 2.73-.85.55-1.884.83-3.098.83-.84 0-1.597-.13-2.274-.4-.677-.27-1.25-.65-1.72-1.14-.467-.49-.826-1.08-1.075-1.76-.25-.68-.373-1.43-.373-2.24 0-.79.13-1.52.4-2.19s.65-1.24 1.14-1.72c.49-.48 1.075-.855 1.753-1.124.68-.268 1.43-.4 2.25-.4.92 0 1.72.18 2.4.53.68.35 1.23.82 1.66 1.4.43.586.73 1.26.9 2.02.17.75.22 1.54.16 2.37h-7.64c0 .84.222 1.46.66 1.89zm-10.24.05c.317 0 .62-.03.906-.09s.54-.17.757-.32c.217-.15.39-.35.52-.6.127-.25.19-.57.19-.95 0-.75-.22-1.29-.67-1.62-.45-.33-1.05-.49-1.8-.49H3.57v4.07h3.13zm-.27-6.39c.34 0 .65-.04.93-.13.28-.09.52-.22.72-.4.2-.18.35-.4.46-.67.11-.27.165-.57.165-.9 0-.74-.2-1.27-.59-1.58-.4-.31-.92-.47-1.57-.47H3.57v4.15h2.86zm14.174-2.66c-.366-.4-.92-.6-1.657-.6-.476 0-.877.08-1.2.24-.322.16-.585.36-.785.6-.2.24-.34.5-.42.78-.08.28-.13.55-.14.8h4.83c-.12-.82-.37-1.42-.63-1.82z"/></svg>,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/hyperfantasy.design',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  },
]

const EXCLUDED = ['/projects', '/admin', '/login']

export function Footer() {
  const pathname = usePathname()

  if (EXCLUDED.some(p => pathname.startsWith(p))) return null

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition w-full md:w-40 shrink-0 justify-center md:justify-start">
            <Image src="/logo-pictogram.svg" alt="Hyperfantasy" width={24} height={24} />
            <span className="text-lg font-bold tracking-tight">HYPERFANTASY</span>
          </Link>

          {/* Nav links */}
          <div className="flex flex-wrap gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  isActive(href)
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                    : 'text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center justify-center md:justify-end gap-4 w-full md:w-40 shrink-0">
            {SOCIAL.map(({ label, href, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-slate-400 dark:text-white/30 hover:text-slate-900 dark:hover:text-white transition"
              >
                {svg}
              </a>
            ))}
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400 dark:text-white/20 text-center">
          © {new Date().getFullYear()} Hyperfantasy. All rights reserved.
        </div>

      </div>
    </footer>
  )
}
