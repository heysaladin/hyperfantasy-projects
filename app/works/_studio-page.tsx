import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { EnquiryCTAButton } from '@/components/enquiry-cta-button'
import { ScrollReveal } from '@/components/scroll-reveal'

const HomeFloatingCTA = dynamic(() =>
  import('@/components/home-floating-cta').then(m => ({ default: m.HomeFloatingCTA }))
)

const BG       = '#030017'
const CARD     = '#0e0b2e'
const ACCENT   = '#b394f4'
const GRADIENT = 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)'

export type StudioConfig = {
  slug:        string
  name:        string
  tagline:     string
  desc:        string
  services:    string[]
  tags:        string[]   // used to filter portfolios
  accentColor: string
  metadata:    Metadata
}

async function getWorks(tags: string[]) {
  try {
    return await prisma.portfolio.findMany({
      where: { isVisible: true, tags: { hasSome: tags } },
      orderBy: { orderIndex: 'desc' },
      select: { id: true, title: true, imageUrl: true, tags: true, category: true },
    })
  } catch {
    return []
  }
}

export async function StudioPage({ config }: { config: StudioConfig }) {
  const works = await getWorks(config.tags)

  return (
    <div style={{ fontFamily: 'var(--font-inter, sans-serif)' }} className="transition-colors">
      <style>{`
        .dark .hf-page { background:${BG}; }
        .hf-page       { background:#fff; }

        .hf-title { color:#0a0a0a; }
        .dark .hf-title { color:#fff; }
        .hf-muted { color:rgba(0,0,0,.45); }
        .dark .hf-muted { color:rgba(255,255,255,.4); }
        .hf-body  { color:rgba(0,0,0,.65); }
        .dark .hf-body  { color:rgba(255,255,255,.55); }

        .hf-label {
          display:block; font-size:11px; font-weight:700;
          letter-spacing:.2em; text-transform:uppercase;
          color:#7c3aed; margin-bottom:1.25rem;
        }
        .dark .hf-label { color:${ACCENT}; }

        .hf-h2 {
          font-size:clamp(24px,2.8vw,40px);
          font-weight:300; line-height:1.15; letter-spacing:-0.02em;
        }

        .sr-box {
          opacity:0; transform:translateY(36px);
          transition:opacity 0.85s cubic-bezier(0.16,1,0.3,1),
                      transform 0.85s cubic-bezier(0.16,1,0.3,1);
          will-change:opacity,transform;
        }
        .sr-box.sr-in { opacity:1; transform:translateY(0); }

        .grad-btn {
          background:${GRADIENT}; color:#fff; border:none;
          border-radius:48px; padding:13px 28px;
          font-size:14px; font-weight:600; cursor:pointer;
          display:inline-flex; align-items:center; gap:8px; transition:opacity .2s;
        }
        .grad-btn:hover { opacity:.85; }
        .grad-btn:focus-visible { outline:2px solid #7c3aed; outline-offset:3px; }

        /* breadcrumb */
        .studio-breadcrumb {
          display:flex; align-items:center; gap:8px;
          font-size:12px; color:rgba(0,0,0,.4); margin-bottom:2.5rem;
        }
        .dark .studio-breadcrumb { color:rgba(255,255,255,.35); }
        .studio-breadcrumb a { color:inherit; text-decoration:none; }
        .studio-breadcrumb a:hover { color:#7c3aed; }
        .dark .studio-breadcrumb a:hover { color:${ACCENT}; }

        /* services chips */
        .studio-chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:2rem; }
        .studio-chip {
          font-size:12px; font-weight:400;
          border:1px solid rgba(0,0,0,.1); border-radius:999px;
          padding:5px 12px; background:#fff; color:#151515;
        }
        .dark .studio-chip { border-color:rgba(255,255,255,.1); background:transparent; color:rgba(255,255,255,.65); }

        /* works grid */
        .studio-grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:1px;
          background:rgba(0,0,0,.08);
        }
        .dark .studio-grid { background:rgba(255,255,255,.07); }
        @media(max-width:768px) { .studio-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:480px) { .studio-grid { grid-template-columns:1fr; } }

        .studio-card {
          background:#fff; overflow:hidden; position:relative;
          aspect-ratio:4/3;
          transition:opacity .2s;
        }
        .dark .studio-card { background:${CARD}; }
        .studio-card:hover .studio-card-overlay { opacity:1; }
        .studio-card:hover img { transform:scale(1.04); }

        .studio-card-overlay {
          position:absolute; inset:0; opacity:0;
          background:rgba(0,0,0,.55);
          display:flex; flex-direction:column;
          justify-content:flex-end; padding:1.25rem;
          transition:opacity .25s;
        }
        .studio-card-title {
          font-size:14px; font-weight:500; color:#fff;
          letter-spacing:-0.01em; line-height:1.35;
        }
        .studio-card-tags {
          font-size:11px; color:rgba(255,255,255,.65);
          margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .studio-card img { transition:transform .5s ease; }

        .studio-empty {
          grid-column:1/-1; text-align:center;
          padding:5rem 2rem; color:rgba(0,0,0,.3);
          font-size:14px;
        }
        .dark .studio-empty { color:rgba(255,255,255,.25); }

        /* CTA section */
        .dark .studio-cta { background:${CARD}; }
        .studio-cta { background:#f5f3ff; }
      `}</style>

      <div className="hf-page">

        {/* ── HERO ── */}
        <section className="px-6 lg:px-8 pt-32 pb-20 border-b border-black/8 dark:border-white/7">
          <div className="max-w-7xl mx-auto">
            <nav className="studio-breadcrumb" aria-label="Breadcrumb">
              <Link href="/works">Works</Link>
              <span aria-hidden="true">/</span>
              <span>{config.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
              <div>
                <span className="hf-label">{config.slug.charAt(0).toUpperCase() + config.slug.slice(1)}</span>
                <h1
                  className="hf-title"
                  style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}
                >
                  {config.name}
                </h1>
                <p className="hf-body" style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.8 }}>
                  {config.desc}
                </p>
                <div className="studio-chips" role="list" aria-label="Services offered">
                  {config.services.map(s => (
                    <span key={s} className="studio-chip" role="listitem">{s}</span>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p className="hf-muted" style={{ fontSize: 13, marginBottom: '1rem' }}>
                  {works.length} project{works.length !== 1 ? 's' : ''} in this studio
                </p>
                <EnquiryCTAButton className="grad-btn" id={`studio-${config.slug}-cta`}>
                  Start a Project <ArrowRight size={14} aria-hidden="true" />
                </EnquiryCTAButton>
              </div>
            </div>
          </div>
        </section>

        {/* ── WORKS GRID ── */}
        <section className="border-b border-black/8 dark:border-white/7">
          <div className="studio-grid" role="list" aria-label={`${config.name} case studies`}>
            {works.length === 0 ? (
              <p className="studio-empty">No case studies published yet.</p>
            ) : (
              works.map((work, i) => (
                <ScrollReveal key={work.id} delay={Math.min(i % 6, 3) * 60}>
                  <Link
                    href={`/works/${work.id}`}
                    className="studio-card block"
                    role="listitem"
                    aria-label={work.title}
                  >
                    {work.imageUrl ? (
                      <Image
                        src={work.imageUrl}
                        alt=""
                        fill
                        className="object-cover object-top"
                        sizes="(max-width:480px) 100vw, (max-width:768px) 50vw, 33vw"
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,.05)' }} className="dark:bg-white/4" />
                    )}
                    <div className="studio-card-overlay" aria-hidden="true">
                      <p className="studio-card-title">{work.title}</p>
                      {work.tags.length > 0 && (
                        <p className="studio-card-tags">{work.tags.slice(0, 3).join(' · ')}</p>
                      )}
                    </div>
                  </Link>
                </ScrollReveal>
              ))
            )}
          </div>
        </section>

        {/* ── OTHER STUDIOS ── */}
        <section className="px-6 lg:px-8 py-16 border-b border-black/8 dark:border-white/7">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <p className="hf-muted" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                Other studios
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[
                  { slug: 'hikari',     label: 'Hikari · Brand Identity'  },
                  { slug: 'dravenclaw', label: 'Dravenclaw · Illustration' },
                  { slug: 'thinksoft',  label: 'Thinksoft · Development'   },
                  { slug: 'mitayani',   label: 'Mitayani · Graphic Design' },
                ]
                  .filter(s => s.slug !== config.slug)
                  .map(s => (
                    <Link
                      key={s.slug}
                      href={`/works/${s.slug}`}
                      style={{
                        fontSize: 13, fontWeight: 400,
                        border: '1px solid rgba(0,0,0,.1)', borderRadius: 999,
                        padding: '7px 14px', textDecoration: 'none',
                        transition: 'border-color .15s',
                      }}
                      className="hf-title dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"
                    >
                      {s.label}
                    </Link>
                  ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="studio-cta px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto" style={{ textAlign: 'center' }}>
            <ScrollReveal>
              <span className="hf-label" style={{ display: 'block', textAlign: 'center' }}>Work with us</span>
              <h2
                className="hf-title"
                style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}
              >
                Got a {config.tagline.toLowerCase()} project?
              </h2>
              <p className="hf-body" style={{ fontSize: 15, maxWidth: 400, margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
                Tell us what you need — we'll get back within 24 hours with a clear proposal.
              </p>
              <EnquiryCTAButton className="grad-btn" id={`studio-${config.slug}-bottom-cta`} style={{ fontSize: 15, padding: '15px 36px' }}>
                Start a Project <ArrowRight size={15} aria-hidden="true" />
              </EnquiryCTAButton>
            </ScrollReveal>
          </div>
        </section>

      </div>

      <HomeFloatingCTA ctaBtnId={`studio-${config.slug}-cta`} scrollThreshold={300} />
    </div>
  )
}
