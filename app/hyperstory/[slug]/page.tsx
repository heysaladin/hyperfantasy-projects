import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Source_Serif_4 } from 'next/font/google'
import { HYPERSTORIES, getHyperstory } from '@/data/hyperstories'
import { createClient } from '@/lib/supabase/server'

const sourceSerif4 = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const story = getHyperstory(slug)

  if (!story) {
    return {
      title: 'Story Not Found — Hyperfantasy',
      description: 'This hyperstory could not be found.',
    }
  }

  const title = `${story.title} — Hyperfantasy`
  return {
    title,
    description: story.excerpt,
    openGraph: { title, description: story.excerpt, type: 'article' },
    twitter: { card: 'summary', title, description: story.excerpt },
  }
}

export default async function HyperstoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { slug } = await params
  const story = getHyperstory(slug)

  if (!story) notFound()

  return (
    <div className={`${sourceSerif4.variable} min-h-screen bg-white dark:bg-black transition-colors pt-16`}>

      {/* Back nav */}
      <div className="max-w-[728px] mx-auto px-6 pt-10 pb-0">
        <Link href="/hyperstory" className="inline-flex items-center gap-1.5 text-sm text-[#6b6b6b] dark:text-white/40 hover:text-[#292929] dark:hover:text-white/70 transition">
          <ArrowLeft size={15} aria-hidden="true" />
          Hyperstory
        </Link>
      </div>

      <article className="max-w-[728px] mx-auto px-6 pt-8 pb-24">

        {/* Meta line */}
        <div
          className="mb-6 flex flex-wrap items-center gap-2 text-[13px] text-[#6b6b6b] dark:text-white/40"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          <span className="uppercase tracking-widest font-semibold">{story.category}</span>
          <span aria-hidden="true">·</span>
          <span>{story.year}</span>
          <span aria-hidden="true">·</span>
          <span>{story.readTime}</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-geist-sans), "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 700,
          lineHeight: 1.16,
          letterSpacing: '-0.011em',
          color: 'var(--article-title)',
          marginBottom: '16px',
          marginTop: 0,
        }}>
          {story.title}
        </h1>

        {/* Excerpt */}
        <p style={{
          fontFamily: 'var(--font-geist-sans), "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: '20px',
          fontWeight: 400,
          lineHeight: 1.5,
          letterSpacing: '-0.004em',
          color: 'var(--article-subtitle)',
          marginBottom: '32px',
          marginTop: 0,
        }}>
          {story.excerpt}
        </p>

        {/* Project facts */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 mb-10 pb-10"
          style={{ borderBottom: '1px solid var(--article-divider)', fontFamily: 'var(--font-geist-sans)' }}
        >
          {[
            { label: 'Client', value: story.client },
            { label: 'Role', value: story.role },
            { label: 'Year', value: story.year },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[11px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--article-muted)' }}>{label}</p>
              <p className="text-[14px]" style={{ color: 'var(--article-title)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Cover */}
        <div
          className="w-full rounded-lg mb-12"
          style={{ background: story.gradient, aspectRatio: '21 / 9' }}
          role="img"
          aria-label={story.title}
        />

        {/* Medium-style prose */}
        <style>{`
          :root {
            --article-title: #292929;
            --article-subtitle: #6b6b6b;
            --article-body: #292929;
            --article-divider: #e6e6e6;
            --article-border: #292929;
            --article-muted: #6b6b6b;
          }
          .dark {
            --article-title: rgba(255,255,255,0.9);
            --article-subtitle: rgba(255,255,255,0.45);
            --article-body: rgba(255,255,255,0.84);
            --article-divider: rgba(255,255,255,0.1);
            --article-border: rgba(255,255,255,0.55);
            --article-muted: rgba(255,255,255,0.4);
          }

          .medium-prose {
            font-family: 'Source Serif Pro', var(--font-source-serif), Georgia, Cambria, "Times New Roman", Times, serif;
            font-size: 20px;
            line-height: 1.58;
            letter-spacing: -0.003em;
            font-weight: 400;
            color: var(--article-body);
          }
          .medium-prose p {
            margin-top: 0;
            margin-bottom: 2em;
          }
          .medium-prose p:last-child {
            margin-bottom: 0;
          }
          .medium-prose h2 {
            font-family: var(--font-geist-sans), "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-weight: 700;
            color: var(--article-title);
            font-size: 26px;
            line-height: 1.22;
            letter-spacing: -0.012em;
            margin-top: 2.14em;
            margin-bottom: 0.5em;
          }
          .medium-prose h3 {
            font-family: var(--font-geist-sans), "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-weight: 700;
            color: var(--article-title);
            font-size: 22px;
            line-height: 1.25;
            letter-spacing: -0.007em;
            margin-top: 1.72em;
            margin-bottom: 0.5em;
          }
          .medium-prose blockquote {
            border-left: 3px solid var(--article-border);
            padding: 0 0 0 23px;
            margin: 2em 0;
            font-style: italic;
            color: var(--article-body);
          }
          .medium-prose blockquote p {
            margin-bottom: 0;
          }
          .medium-prose strong {
            font-weight: 700;
          }
          .medium-prose em { font-style: italic; }
          .medium-prose hr {
            border: none;
            text-align: center;
            margin: 3.5em 0;
          }
          .medium-prose hr::before {
            content: '···';
            letter-spacing: 0.6em;
            color: var(--article-muted);
            font-size: 1.2em;
          }
        `}</style>

        <div
          className="medium-prose"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />

        {/* More stories */}
        <div className="mt-16 pt-10" style={{ borderTop: '1px solid var(--article-divider)' }}>
          <p
            className="text-[11px] uppercase tracking-widest font-semibold mb-6"
            style={{ fontFamily: 'var(--font-geist-sans)', color: 'var(--article-muted)' }}
          >
            More stories
          </p>
          <div className="flex flex-col gap-5">
            {HYPERSTORIES.filter(s => s.slug !== story.slug).map(s => (
              <Link key={s.slug} href={`/hyperstory/${s.slug}`} className="group flex items-center gap-4">
                <span
                  className="w-14 h-10 rounded flex-shrink-0"
                  style={{ background: s.gradient }}
                  aria-hidden="true"
                />
                <span
                  className="text-[15px] font-semibold leading-snug text-[#292929] dark:text-white/85 group-hover:text-[#6b6b6b] dark:group-hover:text-white/50 transition"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  {s.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </article>
    </div>
  )
}
