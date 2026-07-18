import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ArrowRight } from 'lucide-react'
import { EnquiryCTAButton } from '@/components/enquiry-cta-button'
import { ScrollReveal } from '@/components/scroll-reveal'
import { prisma } from '@/lib/prisma'

const HomeFloatingCTA = dynamic(() =>
  import('@/components/home-floating-cta').then(m => ({ default: m.HomeFloatingCTA }))
)

/* ── Tokens ─────────────────────────────────────── */
const BG       = '#030017'
const ACCENT   = '#b394f4'
const GRADIENT = 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)'

/* ── Static data ─────────────────────────────────── */
const STATS = [
  { value: '47+', label: 'Projects delivered' },
  { value: '4',   label: 'Countries served'   },
  { value: '10+', label: 'Years in design'     },
]

const SERVICES = [
  {
    num: '01',
    label: 'UI/UX & Product Design',
    desc: 'Intuitive interfaces for web and mobile — from first wireframe to production-ready design system.',
    tags: ['Landing Page', 'Mobile App', 'Dashboard', 'Design System', 'Prototype'],
    href: '/about/team/heysaladin',
    galleryTags: ['UI/UX', 'Mobile App', 'Landing Page', 'Dashboard', 'Design System', 'Prototype'],
  },
  {
    num: '02',
    label: 'Development',
    desc: 'Responsive and scalable websites and web apps, built with React / Next.js.',
    tags: ['Website', 'Web App', 'Micro-interactions', 'CMS', 'API Integrations'],
    href: '/about/team/thinksoft',
    galleryTags: ['Dashboard', 'Web App', 'Website', 'CMS'],
  },
  {
    num: '03',
    label: 'Brand Identity',
    desc: 'From brand strategy and naming to full visual identity with guidelines.',
    tags: ['Logo', 'Visual Identity', 'Brand Guidelines', 'Illustration', 'Packaging'],
    href: '/about/team/hikari',
    galleryTags: ['Logo', 'Brand', 'Visual Identity', 'Brand Identity', 'Branding', 'Illustration', 'Packaging'],
  },
]

const UIUX_PINNED_IDS = [
  'bfa69f1e-9ce3-4c1b-93b2-c9ffb5e05367',
  'c0020417-5c30-427d-b6d9-e5d26dc29178',
  'c8b1eab7-03e0-4fda-bb83-af33f4558b7c',
]

const LOGOS = [
  { src: '/lab/heysaladin/logos/logo-05.svg', alt: 'Logo 5' },
  { src: '/lab/heysaladin/logos/logo-04.svg', alt: 'Logo 4' },
  { src: '/lab/heysaladin/logos/logo-01.svg', alt: 'Logo 1' },
  { src: '/lab/heysaladin/logos/logo-02.svg', alt: 'Logo 2' },
  { src: '/lab/heysaladin/logos/logo-03.png', alt: 'Logo 3' },
  { src: '/lab/heysaladin/logos/logo-06.svg', alt: 'Logo 6' },
  { src: '/lab/heysaladin/logos/logo-07.png', alt: 'Logo 7' },
]

async function getUiuxGallery() {
  const [vaksini, pinned] = await Promise.all([
    prisma.portfolio.findFirst({
      where: { tags: { hasSome: ['Mobile App', 'Mobile'] }, imageUrl: { not: null }, isVisible: true },
      select: { id: true, imageUrl: true, tags: true },
      orderBy: { orderIndex: 'desc' },
    }),
    prisma.portfolio.findMany({
      where: { id: { in: UIUX_PINNED_IDS }, imageUrl: { not: null } },
      select: { id: true, imageUrl: true, tags: true },
    }),
  ])
  return [...(vaksini ? [vaksini] : []), ...pinned]
}

async function getServiceGallery(tagSets: string[][]) {
  const allTags = tagSets.flat()
  const rows = await prisma.portfolio.findMany({
    where: { tags: { hasSome: allTags }, imageUrl: { not: null }, isVisible: true },
    select: { id: true, imageUrl: true, tags: true },
    orderBy: { orderIndex: 'desc' },
    take: 40,
  })
  return tagSets.map(tags =>
    rows.filter(r => r.tags.some(t => tags.some(st => t.toLowerCase().includes(st.toLowerCase()))))
  )
}

export const metadata: Metadata = {
  title: 'About — Hyperfantasy Creative Studio',
  description: 'A creative collective of senior designers, developers, and brand strategists — assembled per project, without the agency overhead.',
}

export default async function AboutPage() {
  const [svcGalleries, uiuxGallery] = await Promise.all([
    getServiceGallery(SERVICES.map(s => s.galleryTags)),
    getUiuxGallery(),
  ])
  svcGalleries[0] = uiuxGallery

  return (
    <div style={{ fontFamily: 'var(--font-inter, sans-serif)' }} className="transition-colors">
      <style>{`
        /* ── Page ── */
        .dark .hf-page { background:${BG}; }
        .hf-page       { background:#fff; }

        /* ── Prose colours ── */
        .hf-title { color:#0a0a0a; }
        .dark .hf-title { color:#fff; }
        .hf-muted { color:rgba(0,0,0,.45); }
        .dark .hf-muted { color:rgba(255,255,255,.4); }
        .hf-body  { color:rgba(0,0,0,.65); }
        .dark .hf-body  { color:rgba(255,255,255,.55); }

        /* ── Section label ── */
        .hf-label {
          display:block; font-size:11px; font-weight:700;
          letter-spacing:.2em; text-transform:uppercase;
          color:#7c3aed; margin-bottom:1.25rem;
        }
        .dark .hf-label { color:${ACCENT}; }

        /* ── Section heading ── */
        .hf-h2 {
          font-size:clamp(24px,2.8vw,40px);
          font-weight:300; line-height:1.15; letter-spacing:-0.02em;
        }

        /* ── Scroll reveal ── */
        .sr-box {
          opacity:0; transform:translateY(36px);
          transition:opacity 0.85s cubic-bezier(0.16,1,0.3,1),
                      transform 0.85s cubic-bezier(0.16,1,0.3,1);
          will-change:opacity,transform;
        }
        .sr-box.sr-in { opacity:1; transform:translateY(0); }

        /* ── Stats ── */
        .hf-stat-num {
          font-size:clamp(40px,5vw,72px); font-weight:300;
          letter-spacing:-0.015em; line-height:1.1;
        }

        /* ── Buttons ── */
        .grad-btn {
          background:${GRADIENT}; color:#fff; border:none;
          border-radius:48px; padding:13px 28px;
          font-size:14px; font-weight:600; cursor:pointer;
          display:inline-flex; align-items:center; gap:8px; transition:opacity .2s;
        }
        .grad-btn:hover { opacity:.85; }

        /* ── Services — 2-col + sticky-stack ── */
        .svc-outer {
          display:grid; grid-template-columns:2fr 3fr;
          align-items:start; gap:3rem;
        }
        @media(max-width:768px) { .svc-outer { grid-template-columns:1fr; gap:2rem; } }

        .svc-left { position:sticky; top:4.5rem; align-self:start; }
        @media(max-width:768px) { .svc-left { position:static; } }

        .svc-right { display:flex; flex-direction:column; gap:12px; }
        .svc-block {
          position:sticky; top:4.5rem;
          border:1px solid rgba(0,0,0,.09); border-radius:12px;
          padding:2.5rem; background:#fff; will-change:transform;
        }
        .dark .svc-block { border-color:rgba(255,255,255,.09); background:${BG}; }
        .svc-block:nth-child(1) { z-index:1; }
        .svc-block:nth-child(2) { z-index:2; }
        .svc-block:nth-child(3) { z-index:3; }

        .svc-block-header { display:flex; align-items:baseline; gap:1.25rem; margin-bottom:1rem; }
        .svc-num { font-size:13px; color:rgba(0,0,0,.4); font-weight:400; flex-shrink:0; }
        .dark .svc-num { color:rgba(255,255,255,.3); }
        .svc-title { font-size:clamp(18px,2vw,22px); font-weight:500; letter-spacing:-0.02em; }
        .svc-desc { font-size:14px; line-height:1.75; color:rgba(0,0,0,.55); margin-bottom:1.75rem; }
        .dark .svc-desc { color:rgba(255,255,255,.45); }

        .svc-gallery {
          display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr;
          gap:5px; aspect-ratio:2.4/1; margin-bottom:1.5rem; overflow:hidden;
        }
        .svc-gallery-item { position:relative; overflow:hidden; background:rgba(0,0,0,.05); }
        .dark .svc-gallery-item { background:rgba(255,255,255,.04); }
        .svc-gallery-item img { transition:transform 0.55s ease; }
        .svc-block:hover .svc-gallery-item img { transform:scale(1.04); }

        .svc-tags { display:flex; flex-wrap:wrap; gap:5px; }
        .svc-tag {
          border:1px solid rgba(0,0,0,.1); border-radius:999px;
          padding:5px 11px; font-size:12px; font-weight:400;
          background:#fff; color:#151515; white-space:nowrap;
        }
        .dark .svc-tag { border-color:rgba(255,255,255,.1); background:transparent; color:rgba(255,255,255,.65); }
      `}</style>

      <main className="hf-page">

        {/* ── 01 · ABOUT + STATS ── */}
        <section className="px-6 lg:px-8 border-b border-black/8 dark:border-white/7" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left: prose */}
              <ScrollReveal>
                <span className="hf-label">About Us</span>
                <h1 className="hf-title" style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
                  No bloated agency — just senior specialists, assembled per project.
                </h1>
                <p className="hf-body" style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.8, marginBottom: '2rem' }}>
                  Hyperfantasy is a creative collective based in East Java, Indonesia. We work with growth-stage startups and established brands across 4 countries — delivering senior-quality work without the overhead.
                </p>
                <EnquiryCTAButton className="grad-btn" id="about-hero-cta">
                  Start a Project <ArrowRight size={14} aria-hidden="true" />
                </EnquiryCTAButton>
              </ScrollReveal>

              {/* Right: stats */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {STATS.map((s, i) => (
                  <ScrollReveal key={s.label} delay={100 + i * 110}>
                    <div
                      style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
                      className="dark:border-white/8"
                    >
                      <span className="hf-stat-num hf-title">{s.value}</span>
                      <span className="hf-muted" style={{ fontSize: 14, fontWeight: 400 }}>{s.label}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── 02 · LOGO CAROUSEL ── */}
        <section className="border-b border-black/8 dark:border-white/7 py-10">
          <div className="marquee-wrapper" dir="ltr">
            <div className="marquee-track" style={{ animationDuration: '35.4333s' }}>
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <Image
                  key={i}
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={48}
                  style={{ objectFit: 'contain', marginRight: 48, flexShrink: 0 }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── 03 · SERVICES ── */}
        <section id="services" className="border-b border-black/8 dark:border-white/7">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
            <div className="svc-outer">

              {/* Left: sticky label + heading */}
              <div className="svc-left">
                <span className="hf-label">Services</span>
                <h2 className="hf-title hf-h2">
                  A Unified Approach to Digital Growth Through Strategic Design, Development, and Branding
                </h2>
              </div>

              {/* Right: stacked service cards */}
              <div className="svc-right">
                {SERVICES.map(({ num, label, desc, tags, href }, svcIdx) => {
                  const gallery = svcGalleries[svcIdx]
                  return (
                    <div key={num} className="svc-block">
                      <div className="svc-block-header">
                        <span className="svc-num">{num}</span>
                        <Link href={href}>
                          <h3 className="svc-title hf-title">{label}</h3>
                        </Link>
                      </div>
                      <p className="svc-desc">{desc}</p>
                      <div className="svc-gallery">
                        {[0, 1, 2, 3].map(j => {
                          const p = gallery[j % Math.max(gallery.length, 1)]
                          return (
                            <div key={j} className="svc-gallery-item">
                              {p?.imageUrl && (
                                <Image
                                  src={p.imageUrl}
                                  alt=""
                                  fill
                                  className="object-cover object-top"
                                  sizes="(max-width:640px) 50vw, 25vw"
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                      <div className="svc-tags">
                        {tags.map(tag => (
                          <span key={tag} className="svc-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          </div>
        </section>

      </main>

      <HomeFloatingCTA ctaBtnId="about-hero-cta" scrollThreshold={300} />
    </div>
  )
}
