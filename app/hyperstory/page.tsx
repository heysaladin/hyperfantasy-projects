import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { HYPERSTORIES } from '@/data/hyperstories'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Hyperstory — Hyperfantasy',
  description:
    'Long-form case studies exploring the story, strategy, and craft behind our design work.',
}

export default async function HyperstoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors pt-16">

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/10">
        <div className="max-w-[900px] mx-auto px-6 pt-14 pb-10">
          <h1 style={{
            fontFamily: 'var(--font-inter), "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.016em',
            marginBottom: '12px',
          }}>Hyperstory</h1>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '16px',
            lineHeight: 1.5,
            color: '#6b6b6b',
          }} className="dark:!text-white/40">
            The stories behind the work — long-form case studies on strategy, process, and craft
          </p>
        </div>
      </div>

      {/* Story list */}
      <div className="max-w-[900px] mx-auto px-6 pb-24">
        <div className="divide-y divide-slate-200 dark:divide-white/10">
          {HYPERSTORIES.map(story => (
            <Link
              key={story.slug}
              href={`/hyperstory/${story.slug}`}
              className="block group py-10 first:pt-12"
            >
              <article className="flex flex-col md:flex-row gap-6 md:gap-10 md:items-start">

                {/* Cover */}
                <div
                  className="w-full md:w-[280px] h-[180px] md:h-[190px] flex-shrink-0 rounded-lg overflow-hidden relative"
                  style={{ background: story.gradient }}
                >
                  <span
                    className="absolute bottom-3 left-3 text-white/90 text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)', fontFamily: 'var(--font-inter)' }}
                  >
                    {story.client}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="absolute top-3 right-3 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div
                    className="flex items-center gap-2 mb-3 text-[12px] dark:!text-white/35"
                    style={{ fontFamily: 'var(--font-inter)', color: '#6b6b6b' }}
                  >
                    <span className="uppercase tracking-widest font-semibold">{story.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{story.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{story.readTime}</span>
                  </div>

                  <h2 style={{
                    fontFamily: 'var(--font-inter), "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(20px, 3vw, 26px)',
                    fontWeight: 700,
                    lineHeight: 1.25,
                    letterSpacing: '-0.012em',
                    marginBottom: '10px',
                  }} className="text-[#292929] dark:text-white/90 group-hover:text-[#6b6b6b] dark:group-hover:text-white/55 transition">
                    {story.title}
                  </h2>

                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '15px',
                    lineHeight: 1.55,
                    color: '#6b6b6b',
                  }} className="dark:!text-white/40 line-clamp-3">
                    {story.excerpt}
                  </p>

                  <p style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '13px',
                    marginTop: '14px',
                    color: '#6b6b6b',
                  }} className="dark:!text-white/35">
                    {story.role}
                  </p>
                </div>

              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
