import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { resolveContent } from '@/lib/tiptap-content'
import { ArticleContent } from '@/components/article-content'

function extractPlainText(value: string): string {
  if (!value) return ''
  try {
    const doc = JSON.parse(value)
    if (doc?.type === 'doc' && Array.isArray(doc.content)) {
      const parts: string[] = []
      const walk = (nodes: any[]) => {
        for (const node of nodes) {
          if (node.type === 'text' && node.text) parts.push(node.text)
          if (Array.isArray(node.content)) walk(node.content)
        }
      }
      walk(doc.content)
      return parts.join(' ')
    }
  } catch {
    // not JSON — return as-is
  }
  return value
}

async function getPortfolio(id: string) {
  try {
    const portfolio = await prisma.portfolio.findUnique({ where: { id } })
    if (!portfolio || !portfolio.isVisible) return null
    return portfolio
  } catch {
    return null
  }
}

async function getRelatedWorks(currentId: string, category: string | null, tags: string[]) {
  return await prisma.portfolio.findMany({
    where: {
      isVisible: true,
      id: { not: currentId },
      OR: [
        ...(category ? [{ category }] : []),
        ...(tags.length > 0 ? [{ tags: { hasSome: tags } }] : []),
      ],
    },
    orderBy: { orderIndex: 'desc' },
    take: 3,
    select: { id: true, title: true, imageUrl: true, category: true },
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const portfolio = await getPortfolio(id)
  if (!portfolio) {
    return {
      title: 'Work Not Found — Hyperfantasy',
      description: 'This work could not be found.',
    }
  }
  return {
    title: `${portfolio.title} — Hyperfantasy`,
    description: extractPlainText(portfolio.description ?? '').slice(0, 160) || undefined,
  }
}

export default async function PortfolioDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const portfolio = await getPortfolio(id)

  if (!portfolio) {
    notFound()
  }

  const related = await getRelatedWorks(
    id,
    portfolio.category,
    portfolio.tags as string[],
  )

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors pt-16">

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10 pb-16">

        <Link
          href="/works"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition mb-10"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to Works
        </Link>

        {/* Title & Category */}
        <div className="mb-10">
          {portfolio.category && (
            <span className="text-sm text-slate-500 dark:text-white/40 uppercase tracking-wider">
              {portfolio.category}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            {portfolio.title}
          </h1>

          {portfolio.liveUrl && (
            <Button variant="outline" asChild>
              <a href={portfolio.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} className="mr-2" aria-hidden="true" />
                View Live Site
              </a>
            </Button>
          )}
        </div>

        {/* Featured Image */}
        {portfolio.imageUrl && (
          <div className="w-full overflow-hidden rounded-lg mb-12">
            <Image
              src={portfolio.imageUrl}
              alt={portfolio.title}
              width={1200}
              height={675}
              priority
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        )}

        {/* Description — full rich text */}
        <ArticleContent
          html={resolveContent(portfolio.description as string)}
          className="prose prose-slate dark:prose-invert prose-lg max-w-none mb-12"
        />

        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-t border-slate-200 dark:border-white/10">

          {portfolio.stack && portfolio.stack.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40 mb-4">
                Tools & Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {(portfolio.stack as string[]).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded text-sm text-slate-700 dark:text-white/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {portfolio.tags && portfolio.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40 mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {(portfolio.tags as string[]).map((tag) => (
                  <Link
                    key={tag}
                    href={`/works?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded text-sm text-slate-700 dark:text-white/80 hover:bg-slate-200 dark:hover:bg-white/20 transition"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {portfolio.projectDate && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40 mb-4">
                Completed
              </h3>
              <p className="text-slate-700 dark:text-white/80">
                {new Date(portfolio.projectDate).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}

          {portfolio.complexity && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-white/40 mb-4">
                Project Scale
              </h3>
              <p className="text-slate-700 dark:text-white/80 capitalize">
                {portfolio.complexity} Project
              </p>
            </div>
          )}

          {portfolio.copyright && (
            <div className="md:col-span-2">
              <p className="text-xs text-slate-400 dark:text-white/30">{portfolio.copyright}</p>
            </div>
          )}
        </div>

        {/* Related Works */}
        {related.length > 0 && (
          <div className="pt-4 pb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-6">More Works</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link key={p.id} href={`/works/${p.id}`} className="group block rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 transition">
                  {p.imageUrl && (
                    <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-white/5">
                      <Image
                        src={p.imageUrl}
                        alt={p.title}
                        width={256}
                        height={144}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        className="group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-xs text-slate-400 dark:text-white/30 uppercase tracking-wider mb-1">{p.category}</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-white/80 leading-snug line-clamp-2">{p.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="border-t border-slate-200 dark:border-white/10 pt-12 text-center">
          <p className="text-slate-600 dark:text-white/60 mb-6">
            Interested in working together?
          </p>
          <Button asChild size="lg">
            <Link href="/enquiry">Get in Touch</Link>
          </Button>
        </div>

      </div>
    </div>
  )
}
