'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

const SITES = [
  { label: 'Hyperfantasy', href: 'https://hyperfantasy.web.app/' },
  { label: 'Hey Saladin Design', href: 'https://heysaladindesign.web.app/' },
  { label: 'Hey Hey Saladin', href: 'https://heyheysaladin.web.app/' },
]

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      setLoading(false)
    }
    
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push('/login')
        } else {
          setUser(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return <div className="bg-white dark:bg-black text-slate-900 dark:text-white min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="bg-white dark:bg-black text-slate-900 dark:text-white min-h-screen transition-colors flex flex-col">

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center w-full max-w-md">
          <img
            src="https://heysaladindesign.web.app/assets/styles/images/hero-image.png"
            alt="avatar"
            className="w-80 h-80 rounded-full object-contain bg-white mx-auto mb-4 border-8 border-white"
          />
          <h1 className="text-2xl font-bold mb-1 capitalize">
            {(() => { const u = user.email?.split('@')[0] ?? ''; const d = u.lastIndexOf('.'); return d !== -1 ? u.slice(d + 1) : u })()}
          </h1>
          <p className="text-slate-600 dark:text-white/60 text-sm mb-1">{user.email}</p>
          <p className="text-slate-400 dark:text-white/30 text-xs mb-8">{user.id}</p>

          {/* Nav shortcuts */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Link
              href="/"
              className="relative flex flex-col items-start px-4 py-3 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition group"
            >
              <ArrowUpRight size={14} className="absolute top-2.5 right-2.5 text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/60 transition" />
              <span className="text-sm font-semibold block">Home</span>
              <span className="text-xs text-slate-400 dark:text-white/30">Back to main site</span>
            </Link>
            <Link
              href="/admin"
              className="relative flex flex-col items-start px-4 py-3 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition group"
            >
              <ArrowUpRight size={14} className="absolute top-2.5 right-2.5 text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/60 transition" />
              <span className="text-sm font-semibold block">Admin</span>
              <span className="text-xs text-slate-400 dark:text-white/30">Manage your content</span>
            </Link>
          </div>

          {/* Site links */}
          <div className="flex flex-col gap-3 mb-8">
            {SITES.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition group"
              >
                <span className="text-sm font-medium">{label}</span>
                <ExternalLink size={14} className="text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/60 transition" />
              </a>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-lg border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition"
          >
            Log out
          </button>
        </div>
      </div>

    </div>
  )
}