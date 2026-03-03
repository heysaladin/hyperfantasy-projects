'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpNarrowWide, ExternalLink, Github, LayoutGrid, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { resolveContent, resolveContentAsText } from '@/lib/tiptap-content'
import { ArticleContent } from '@/components/article-content'

const PAGE_SIZE = 9

const SORT_OPTIONS = [
  { value: 'order',  label: 'Default', icon: LayoutGrid },
  { value: 'newest', label: 'Newest',  icon: ArrowDownWideNarrow },
  { value: 'oldest', label: 'Oldest',  icon: ArrowUpNarrowWide },
  { value: 'title',  label: 'A–Z',     icon: ArrowDownAZ },
]

// ---------- sub-components ----------

function useLazyVisible() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function PortfolioCard({ portfolio, index, onClick }: { portfolio: any; index: number; onClick: () => void }) {
  const { ref, visible } = useLazyVisible()
  return (
    <div ref={ref} onClick={onClick} className="group block cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.45s ease ${(index % PAGE_SIZE) * 60}ms, transform 0.45s ease ${(index % PAGE_SIZE) * 60}ms`,
      }}
    >
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 transition hover:border-slate-300 dark:hover:border-white/20">
        {portfolio.imageUrl && (
          <div className="aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-white/5">
            <img src={portfolio.imageUrl} alt={portfolio.title} loading="lazy" decoding="async"
              className="object-cover w-full h-full transition group-hover:scale-105" />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            {portfolio.category && (
              <span className="text-xs text-slate-500 dark:text-white/40 uppercase tracking-wider">{portfolio.category}</span>
            )}
            {portfolio.complexity && (
              <span className={`text-xs px-2 py-0.5 rounded ${
                portfolio.complexity === 'short'
                  ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                  : 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400'
              }`}>{portfolio.complexity}</span>
            )}
          </div>
          <h3 className="text-xl font-semibold group-hover:text-slate-600 dark:group-hover:text-white/60 transition">{portfolio.title}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/60 line-clamp-2">{resolveContentAsText(portfolio.description)}</p>
          {portfolio.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {portfolio.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="text-xs px-2 py-1 bg-slate-200 dark:bg-white/10 rounded">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
      <div className="aspect-[16/10] bg-slate-200 dark:bg-white/10 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-12 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-5 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-5 w-3/4 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3.5 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-3.5 w-5/6 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// ---------- main page ----------

export default function ProjectsPage() {
  // All portfolios fetched once
  const [allPortfolios, setAllPortfolios] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('order')

  // How many filtered results to display (infinite scroll)
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)

  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const sentinelInView = useRef(false)

  // Fetch all visible portfolios once on mount
  useEffect(() => {
    fetch('/api/portfolios?limit=200&offset=0&visible=true')
      .then(r => r.json())
      .then(data => setAllPortfolios(data.items || []))
      .catch(() => setAllPortfolios([]))
      .finally(() => setIsLoading(false))
  }, [])

  // Client-side filter + sort (instant, no network)
  const filtered = useMemo(() => {
    let result = [...allPortfolios]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.tags?.some((t: string) => t.toLowerCase().includes(q))
      )
    }

    switch (sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.projectDate ?? 0).getTime() - new Date(a.projectDate ?? 0).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.projectDate ?? 0).getTime() - new Date(b.projectDate ?? 0).getTime())
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        result.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    }

    return result
  }, [allPortfolios, search, sort])

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(PAGE_SIZE)
  }, [search, sort])

  const displayed = filtered.slice(0, displayCount)
  const hasMore = displayCount < filtered.length

  // Load more items when sentinel enters view
  const loadMore = () => {
    if (hasMore) setDisplayCount(c => Math.min(c + PAGE_SIZE, filtered.length))
  }

  // Re-check after displayCount updates (handles the case where sentinel stays in view)
  useEffect(() => {
    if (sentinelInView.current && hasMore) loadMore()
  }, [displayCount, filtered.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sentinel observer
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        sentinelInView.current = entry.isIntersecting
        if (entry.isIntersecting) loadMore()
      },
      { rootMargin: '400px' }
    )
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [hasMore]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (portfolio: any) => {
    if (portfolio.complexity === 'short') setSelectedPortfolio(portfolio)
    else window.location.href = `/projects/${portfolio.id}`
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Work</h1>
          <p className="text-xl text-slate-600 dark:text-white/60">Selected projects showcasing our expertise</p>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="border-b border-slate-200 dark:border-white/10 sticky top-0 z-10 bg-white/95 dark:bg-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">

          <div className="flex items-center justify-between gap-3">
            {/* Search — left */}
            <div className="relative w-full max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects…"
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:border-slate-400 dark:focus:border-white/30 transition placeholder:text-slate-400 dark:placeholder:text-white/30"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/60 transition">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort icons — right */}
            <div className="flex items-center gap-1">
              {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  title={label}
                  onClick={() => setSort(value)}
                  className={`p-2 rounded-lg transition ${
                    sort === value
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
            : displayed.map((portfolio, index) => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} index={index} onClick={() => handleClick(portfolio)} />
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-slate-400 dark:text-white/30 text-lg mb-2">No projects found</p>
            <p className="text-slate-400 dark:text-white/20 text-sm">Try adjusting your search</p>
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} className="h-1" />

        {/* End */}
        {!isLoading && !hasMore && filtered.length > 0 && (
          <p className="text-center text-sm text-slate-400 dark:text-white/30 py-12">All projects loaded</p>
        )}
      </div>

      {/* Modal */}
      <Dialog open={!!selectedPortfolio} onOpenChange={() => setSelectedPortfolio(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black border-slate-200 dark:border-white/20">
          {selectedPortfolio && (
            <div>
              <DialogTitle className="sr-only">{selectedPortfolio.title}</DialogTitle>

              {selectedPortfolio.imageUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-white/5 mb-6">
                  <img src={selectedPortfolio.imageUrl} alt={selectedPortfolio.title} className="object-cover w-full h-full" />
                </div>
              )}

              {selectedPortfolio.category && (
                <span className="text-sm text-slate-500 dark:text-white/40 uppercase tracking-wider">{selectedPortfolio.category}</span>
              )}
              <h2 className="text-3xl font-bold mt-2 mb-4 text-slate-900 dark:text-white">{selectedPortfolio.title}</h2>

              <div className="flex gap-3 mb-6">
                {selectedPortfolio.liveUrl && (
                  <a href={selectedPortfolio.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm"><ExternalLink size={16} className="mr-2" />Live Site</Button>
                  </a>
                )}
                {selectedPortfolio.copyright && (
                  <a href={selectedPortfolio.copyright} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm"><Github size={16} className="mr-2" />Code</Button>
                  </a>
                )}
                <Link href={`/projects/${selectedPortfolio.id}`}>
                  <Button variant="default" size="sm">See Details</Button>
                </Link>
              </div>

              <ArticleContent html={resolveContent(selectedPortfolio.description)}
                className="prose prose-slate dark:prose-invert prose-sm max-w-none mb-6" />

              {selectedPortfolio.stack?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPortfolio.stack.map((tech: string) => (
                      <span key={tech} className="px-3 py-1 bg-slate-200 dark:bg-white/10 rounded text-sm">{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPortfolio.tags?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPortfolio.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-slate-200 dark:bg-white/10 rounded text-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
