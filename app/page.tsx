import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ArrowRight, ArrowUpRight, Mail, Star } from 'lucide-react'
import { EnquiryCTAButton } from '@/components/enquiry-cta-button'
import { ScrollReveal } from '@/components/scroll-reveal'
import { FaqAccordion } from '@/components/faq-accordion'
import { testimonials } from '@/data/testimonials'
import { resolveContentAsText } from '@/lib/tiptap-content'
import { prisma } from '@/lib/prisma'

const HomeFloatingCTA = dynamic(() =>
  import('@/components/home-floating-cta').then(m => ({ default: m.HomeFloatingCTA }))
)

/* ── Tokens ─────────────────────────────────────── */
const BG       = '#030017'
const CARD     = '#0e0b2e'
const ACCENT   = '#b394f4'
const GRADIENT = 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)'

/* ── Static data ─────────────────────────────────── */
const STATS = [
  { value: '47+', label: 'Projects delivered' },
  { value: '4',   label: 'Countries served'   },
  { value: '10+', label: 'Years in design'     },
]

const TIMEZONES = [
  { city: 'Jakarta',  offset: 'GMT+7' },
  { city: 'Dubai',    offset: 'GMT+4' },
  { city: 'Riyadh',   offset: 'GMT+3' },
  { city: 'London',   offset: 'GMT+1' },
  { city: 'New York', offset: 'GMT−5' },
]

const INDUSTRIES = [
  'SaaS', 'E-Commerce', 'Fintech', 'Healthcare', 'Real Estate',
  'Education', 'Web3 / Blockchain', 'AI / ML', 'Fashion', 'F&B',
  'Logistics', 'Government', 'Media', 'Travel & Hospitality',
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

const FAQ_ITEMS = [
  {
    q: 'How does working across timezones work?',
    a: "We're based in Indonesia (GMT+7), which overlaps comfortably with the Middle East and mornings in Europe. For US clients, we work asynchronously — you brief us, sleep, and wake up to progress. Most clients find the gap actually accelerates the work.",
  },
  {
    q: 'Who actually works on my project?',
    a: "Hyperfantasy runs as a collective. Instead of a bloated agency where juniors handle your work, we assemble trusted senior specialists per project — only the skills your scope needs. You work directly with the people doing the work.",
  },
  {
    q: 'What does a typical project cost?',
    a: "Scope-dependent, but we're transparent early. After a discovery call you'll get a fixed-price proposal — deliverables, timeline, and total. No hourly billing surprises. As a lean collective our rates sit well below traditional agency pricing for the same seniority.",
  },
  {
    q: 'How do I track progress?',
    a: "Milestone check-ins and direct access to work-in-progress files. No black box — you see the work evolve, and feedback rounds are built into the timeline from day one.",
  },
  {
    q: "What's your revision policy?",
    a: "Proposals include a defined number of revision rounds per deliverable (typically two). Small copy or layout tweaks are always fine. Significant direction pivots are scoped separately so the timeline stays honest.",
  },
  {
    q: 'What happens after delivery?',
    a: "You receive all final assets and source files — you own everything. Many clients start with one project and grow into an ongoing partnership.",
  },
]

function TestimonialCard({ t }: { t: typeof testimonials[number] }) {
  return (
    <div
      className="hf-card border border-black/10 dark:border-white/10 rounded-2xl p-7 shrink-0 flex flex-col"
      style={{ width: 340 }}
    >
      <div className="flex gap-0.5 mb-5" role="img" aria-label={`Rating: ${t.rating} out of 5`}>
        {Array.from({ length: Math.floor(t.rating) }).map((_, j) => (
          <Star key={j} size={12} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
        ))}
      </div>
      <p
        style={{ fontSize: t.content.length < 120 ? 20 : t.content.length < 200 ? 16 : 13, fontWeight: 400, lineHeight: '165%' }}
        className="hf-body mb-6 grow"
      >
        &ldquo;{t.content}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-black/10 dark:border-white/10 mt-auto">
        {t.image && (
          <Image src={t.image} alt={t.name} width={40} height={40} className="rounded-xl object-cover shrink-0" />
        )}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600 }} className="hf-title">{t.name}</p>
          <p style={{ fontSize: 12 }} className="hf-muted">{t.role}{t.company ? `, ${t.company}` : ''}</p>
        </div>
      </div>
    </div>
  )
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

export default async function Home() {
  const [portfolios, svcGalleries, articles] = await Promise.all([
    prisma.portfolio.findMany({
      where: { isVisible: true, imageUrl: { not: null } },
      orderBy: [{ isFeatured: 'desc' }, { orderIndex: 'desc' }],
      take: 9,
      select: { id: true, title: true, description: true, imageUrl: true, category: true },
    }),
    getServiceGallery(SERVICES.map(s => s.galleryTags)),
    prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: [{ index: 'desc' }],
      take: 3,
      select: { id: true, slug: true, title: true, excerpt: true, coverImage: true, tags: true },
    }),
  ])

  const clientTestimonials = testimonials.filter(t => t.client === true)
  const peerTestimonials   = testimonials.filter(t => t.client === false)

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

        /* ── Dividers ── */
        .hf-line { border-top:1px solid rgba(0,0,0,.08); }
        .dark .hf-line { border-color:rgba(255,255,255,.07); }

        /* ── Buttons ── */
        .grad-btn {
          background:${GRADIENT}; color:#fff; border:none;
          border-radius:48px; padding:13px 28px;
          font-size:14px; font-weight:600; cursor:pointer;
          display:inline-flex; align-items:center; gap:8px; transition:opacity .2s;
        }
        .grad-btn:hover { opacity:.85; }
        .ghost-btn {
          border:1px solid rgba(0,0,0,.22); border-radius:48px;
          padding:12px 24px; font-size:14px; font-weight:500;
          display:inline-flex; align-items:center; gap:8px;
          color:inherit; background:transparent; transition:all .18s;
        }
        .dark .ghost-btn { border-color:rgba(255,255,255,.25); }
        .ghost-btn:hover { background:rgba(0,0,0,.04); }
        .dark .ghost-btn:hover { background:rgba(255,255,255,.06); }

        /* ── Hero ── */
        .hf-hero-h1 {
          font-size:clamp(52px,9vw,108px);
          font-weight:700; letter-spacing:-0.055em; line-height:.94;
        }
        .hf-hero-accent {
          font-style:italic;
          background:${GRADIENT};
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }

        /* ── Hero entrance animation ── */
        @keyframes hf-rise {
          from { opacity:0; transform:translateY(36px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .hf-rise {
          opacity:0;
          animation:hf-rise 0.9s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        /* ── Scroll reveal ── */
        .sr-box {
          opacity:0;
          transform:translateY(36px);
          transition:opacity 0.85s cubic-bezier(0.16,1,0.3,1),
                      transform 0.85s cubic-bezier(0.16,1,0.3,1);
          will-change:opacity,transform;
        }
        .sr-box.sr-in {
          opacity:1;
          transform:translateY(0);
        }

        /* ── Timezone strip ── */
        .hf-tz-strip {
          display:flex; flex-wrap:wrap; gap:0;
          font-size:11px; font-weight:500; letter-spacing:.08em;
        }
        .hf-tz-item {
          display:flex; align-items:center; gap:6px;
          padding:6px 16px; border-left:1px solid rgba(0,0,0,.1);
          color:rgba(0,0,0,.35);
        }
        .dark .hf-tz-item { border-color:rgba(255,255,255,.1); color:rgba(255,255,255,.3); }
        .hf-tz-item:first-child { padding-left:0; border-left:none; }
        .hf-tz-dot { width:5px; height:5px; border-radius:50%; background:#22c55e; flex-shrink:0; }

        /* ── Stats ── */
        .hf-stat-num {
          font-size:clamp(44px,6vw,80px); font-weight:700;
          letter-spacing:-0.05em; line-height:1;
        }

        /* ── Industry tags ── */
        .hf-industry-tag {
          display:inline-flex; padding:8px 18px; border-radius:100px;
          border:1px solid rgba(0,0,0,.14); font-size:13px; font-weight:500;
          color:rgba(0,0,0,.6); transition:all .15s; white-space:nowrap;
        }
        .dark .hf-industry-tag { border-color:rgba(255,255,255,.14); color:rgba(255,255,255,.5); }
        .hf-industry-tag:hover { background:rgba(0,0,0,.04); border-color:rgba(0,0,0,.25); }
        .dark .hf-industry-tag:hover { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.25); }

        /* ── Selected Works — 3-col Kretya gallery ── */
        .sw-gallery {
          display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; align-items:start;
        }
        @media(max-width:900px) { .sw-gallery { grid-template-columns:1fr 1fr; } }
        @media(max-width:540px) { .sw-gallery { grid-template-columns:1fr; } }
        .sw-col { display:flex; flex-direction:column; gap:14px; }
        .sw-col:nth-child(2) { margin-top:56px; }
        .sw-col:nth-child(3) { margin-top:28px; }
        @media(max-width:540px) {
          .sw-col:nth-child(2), .sw-col:nth-child(3) { margin-top:0; }
        }
        .sw-card { display:block; text-decoration:none; color:inherit; }
        .sw-img {
          position:relative; overflow:hidden; border-radius:4px;
          background:rgba(0,0,0,.06);
        }
        .dark .sw-img { background:rgba(255,255,255,.05); }
        .sw-img img { transition:transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .sw-card:hover .sw-img img { transform:scale(1.04); }
        .sw-meta { padding:12px 0 4px; }
        .sw-title { font-size:15px; font-weight:500; letter-spacing:-0.01em; line-height:1.3; }
        .sw-tagline { font-size:12px; margin-top:3px; line-height:1.4; color:rgba(0,0,0,.45); }
        .dark .sw-tagline { color:rgba(255,255,255,.4); }

        /* ── Services — 2-col + sticky-stack (Kretya) ── */
        .svc-outer {
          display:grid;
          grid-template-columns:2fr 3fr;
          align-items:start;
          border:1px solid rgba(0,0,0,.09);
        }
        .dark .svc-outer { border-color:rgba(255,255,255,.09); }
        @media(max-width:768px) {
          .svc-outer { grid-template-columns:1fr; }
        }

        /* Left sticky panel */
        .svc-left {
          position:sticky; top:4.5rem;
          padding:2.5rem;
          border-right:1px solid rgba(0,0,0,.09);
          align-self:start;
        }
        .dark .svc-left { border-color:rgba(255,255,255,.09); }
        @media(max-width:768px) {
          .svc-left { position:static; border-right:none; border-bottom:1px solid rgba(0,0,0,.09); }
          .dark .svc-left { border-bottom-color:rgba(255,255,255,.09); }
        }
        .svc-section-cta {
          display:inline-block; margin-top:2rem;
          font-size:14px; font-weight:400;
          color:rgba(0,0,0,.5); transition:color .2s; text-decoration:none;
        }
        .dark .svc-section-cta { color:rgba(255,255,255,.4); }
        .svc-section-cta:hover { color:#7c3aed; }
        .dark .svc-section-cta:hover { color:#b394f4; }

        /* Right: stacked sticky cards */
        .svc-right { display:flex; flex-direction:column; }
        .svc-block {
          position:sticky; top:4.5rem;
          border-top:1px solid rgba(0,0,0,.09);
          padding:2.5rem;
          background:#fff;
          will-change:transform;
        }
        .dark .svc-block { border-color:rgba(255,255,255,.09); background:${BG}; }
        .svc-block:first-child { border-top:none; }
        .svc-block:nth-child(1) { z-index:1; }
        .svc-block:nth-child(2) { z-index:2; }
        .svc-block:nth-child(3) { z-index:3; }

        .svc-block-header {
          display:flex; align-items:baseline; gap:1.25rem; margin-bottom:1rem;
        }
        .svc-num { font-size:13px; color:rgba(0,0,0,.4); font-weight:400; flex-shrink:0; }
        .dark .svc-num { color:rgba(255,255,255,.3); }
        .svc-title { font-size:clamp(18px,2vw,22px); font-weight:500; letter-spacing:-0.02em; }
        .svc-desc {
          font-size:14px; line-height:1.75; color:rgba(0,0,0,.55);
          margin-bottom:1.75rem;
        }
        .dark .svc-desc { color:rgba(255,255,255,.45); }

        /* 2×2 gallery */
        .svc-gallery {
          display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr;
          gap:5px; aspect-ratio:2.4/1; margin-bottom:1.5rem; overflow:hidden;
        }
        .svc-gallery-item { position:relative; overflow:hidden; background:rgba(0,0,0,.05); }
        .dark .svc-gallery-item { background:rgba(255,255,255,.04); }
        .svc-gallery-item img { transition:transform 0.55s ease; }
        .svc-block:hover .svc-gallery-item img { transform:scale(1.04); }

        /* Tags */
        .svc-tags { display:flex; flex-wrap:wrap; gap:5px; }
        .svc-tag {
          border:1px solid rgba(0,0,0,.1); border-radius:2px;
          padding:5px 11px; font-size:12px; font-weight:400;
          background:#fff; color:#151515; white-space:nowrap;
        }
        .dark .svc-tag { border-color:rgba(255,255,255,.1); background:transparent; color:rgba(255,255,255,.65); }

        /* ── FAQ ── */
        .faq-layout {
          display:grid;
          grid-template-columns:2fr 3fr;
          gap:0;
          align-items:start;
        }
        @media(max-width:860px) {
          .faq-layout { grid-template-columns:1fr; }
          .faq-heading-box { margin-bottom:2.5rem; }
        }
        .faq-heading-box {
          padding-right:4rem;
        }
        .faq-heading-box h2 {
          position:sticky; top:6rem;
          font-size:clamp(32px,3.5vw,52px);
          font-weight:700; letter-spacing:-0.03em; line-height:1.1;
        }
        .faq-list { border-top:1px solid rgba(0,0,0,.1); }
        .dark .faq-list { border-color:rgba(255,255,255,.08); }
        .faq-item { border-bottom:1px solid rgba(0,0,0,.1); }
        .dark .faq-item { border-color:rgba(255,255,255,.08); }
        .faq-toggle {
          display:flex; align-items:center; justify-content:space-between;
          gap:24px; width:100%; padding:22px 0;
          background:none; border:none; cursor:pointer; text-align:left;
        }
        .faq-question {
          font-size:15px; font-weight:500; line-height:1.4;
        }
        .faq-icon {
          position:relative; width:20px; height:20px; flex-shrink:0;
        }
        .faq-icon-h {
          position:absolute; top:50%; left:0; right:0; height:1px;
          background:currentColor; opacity:.5; transform:translateY(-50%);
        }
        .faq-icon-v {
          position:absolute; left:50%; top:0; bottom:0; width:1px;
          background:currentColor; opacity:.5; transform:translateX(-50%);
          transition:opacity 0.25s ease, transform 0.25s ease;
        }
        .faq-icon-v-hidden {
          opacity:0; transform:translateX(-50%) scaleY(0);
        }
        .faq-content {
          display:grid; grid-template-rows:0fr;
          transition:grid-template-rows 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .faq-content.open { grid-template-rows:1fr; }
        .faq-content-inner { overflow:hidden; }
        .faq-content-inner p {
          padding-bottom:24px;
          font-size:15px; line-height:1.8; font-weight:300;
          color:rgba(0,0,0,.5);
        }
        .dark .faq-content-inner p { color:rgba(255,255,255,.45); }

        /* ── Testimonials marquee ── */
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes marquee-rev { from{transform:translateX(-50%)} to{transform:translateX(0)} }
        .hf-marquee { animation:marquee 52s linear infinite; display:flex; gap:20px; width:max-content; }
        .hf-marquee-rev { animation:marquee-rev 60s linear infinite; display:flex; gap:20px; width:max-content; }
        .hf-marquee:hover, .hf-marquee-rev:hover { animation-play-state:paused; }
        .hf-fade-l { background:linear-gradient(to right,#fff,transparent); }
        .hf-fade-r { background:linear-gradient(to left,#fff,transparent); }
        .dark .hf-fade-l { background:linear-gradient(to right,${BG},transparent); }
        .dark .hf-fade-r { background:linear-gradient(to left,${BG},transparent); }

        /* ── Card (testimonials) ── */
        .hf-card { background:#f4f2fe; }
        .dark .hf-card { background:${CARD}; }

        /* ── Accent text ── */
        .hf-accent { color:#7c3aed; }
        .dark .hf-accent { color:${ACCENT}; }

        /* ── CTA section ── */
        .dark .hf-cta-bg { background:#0e0b2e; }
        .hf-cta-bg { background:#f5f4ff; }
      `}</style>

      <main className="hf-page">

        {/* ─────────────────────────────────────── */}
        {/* 01 · HERO                               */}
        {/* ─────────────────────────────────────── */}
        <section aria-label="Hero" className="px-6 lg:px-8" style={{ paddingTop: '7rem', paddingBottom: '5rem' }}>
          <div className="max-w-7xl mx-auto">

            {/* Top row: badge + timezones */}
            <div className="hf-rise flex flex-wrap items-center justify-between gap-6 mb-14"
              style={{ animationDelay: '0.05s' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(124,58,237,.08)', border: '1px solid rgba(124,58,237,.2)',
                borderRadius: 32, padding: '5px 14px',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
                color: '#7c3aed', textTransform: 'uppercase',
              }} className="dark:bg-purple-400/5 dark:border-purple-400/20 dark:text-purple-300">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                Creative Collective · Est. 2011
              </div>

              <div className="hf-tz-strip">
                {TIMEZONES.map((t, i) => (
                  <div key={t.city} className="hf-tz-item">
                    {i === 0 && <span className="hf-tz-dot" />}
                    <span>{t.city}</span>
                    <span style={{ opacity: 0.55 }}>{t.offset}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Headline */}
            <h1 className="hf-hero-h1 hf-title hf-rise"
              style={{ animationDelay: '0.18s', marginBottom: '3rem', maxWidth: '90%' }}>
              Designing visuals<br />
              that turn <span className="hf-hero-accent">fantasy</span><br />
              into reality.
            </h1>

            {/* Sub + CTAs */}
            <div className="hf-rise flex flex-col sm:flex-row sm:items-end justify-between gap-8"
              style={{ animationDelay: '0.36s' }}>
              <p className="hf-body"
                style={{ fontSize: 'clamp(15px,1.5vw,18px)', fontWeight: 300, lineHeight: 1.7, maxWidth: 400 }}>
                A creative collective for brands that refuse to blend in — branding, illustration, design, and development under one roof.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
                <EnquiryCTAButton className="grad-btn">
                  Start a Project <ArrowRight size={15} aria-hidden="true" />
                </EnquiryCTAButton>
                <Link href="/projects" className="ghost-btn dark:text-white text-slate-800">
                  See Our Work
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────── */}
        {/* 02 · LOGO CAROUSEL                      */}
        {/* ─────────────────────────────────────── */}
        <section className="border-t border-black/8 dark:border-white/7 py-10">
          <div className="marquee-wrapper mb-8" dir="ltr">
            <div className="marquee-track" style={{ animationDuration: '35.4333s' }}>
              {[
                { src: '/lab/heysaladin/logos/logo-05.svg', alt: 'Logo 5' },
                { src: '/lab/heysaladin/logos/logo-04.svg', alt: 'Logo 4' },
                { src: '/lab/heysaladin/logos/logo-01.svg', alt: 'Logo 1' },
                { src: '/lab/heysaladin/logos/logo-02.svg', alt: 'Logo 2' },
                { src: '/lab/heysaladin/logos/logo-03.png', alt: 'Logo 3' },
                { src: '/lab/heysaladin/logos/logo-06.svg', alt: 'Logo 6' },
                { src: '/lab/heysaladin/logos/logo-07.png', alt: 'Logo 7' },
                { src: '/lab/heysaladin/logos/logo-05.svg', alt: 'Logo 5' },
                { src: '/lab/heysaladin/logos/logo-04.svg', alt: 'Logo 4' },
                { src: '/lab/heysaladin/logos/logo-01.svg', alt: 'Logo 1' },
                { src: '/lab/heysaladin/logos/logo-02.svg', alt: 'Logo 2' },
                { src: '/lab/heysaladin/logos/logo-03.png', alt: 'Logo 3' },
                { src: '/lab/heysaladin/logos/logo-06.svg', alt: 'Logo 6' },
                { src: '/lab/heysaladin/logos/logo-07.png', alt: 'Logo 7' },
              ].map((logo, i) => (
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

        {/* ─────────────────────────────────────── */}
        {/* 03 · ABOUT + STATS                      */}
        {/* ─────────────────────────────────────── */}
        <section className="px-6 lg:px-8 py-20 hf-line border-t border-b border-black/8 dark:border-white/7">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left: prose */}
              <ScrollReveal>
                <span className="hf-label">About Us</span>
                <p className="hf-title"
                  style={{ fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
                  No bloated agency structure — just trusted senior specialists assembled per project.
                </p>
                <p className="hf-body"
                  style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.8, marginBottom: '2rem' }}>
                  Hyperfantasy is a creative collective based in East Java, Indonesia. We work with growth-stage startups and established brands across 4 countries — delivering senior-quality work without the overhead.
                </p>
                <Link href="/about" className="ghost-btn dark:text-white text-slate-800">
                  More About Us <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </ScrollReveal>

              {/* Right: stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem' }}>
                {STATS.map((s, i) => (
                  <ScrollReveal key={s.label} delay={100 + i * 110}>
                    <div className="hf-stat-num hf-title">{s.value}</div>
                    <div className="hf-muted"
                      style={{ fontSize: 12, marginTop: 8, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                      {s.label}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────── */}
        {/* 03 · INDUSTRIES                         */}
        {/* ─────────────────────────────────────── */}
        <section className="px-6 lg:px-8 py-16 border-b border-black/8 dark:border-white/7">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-8 gap-4">
                <span className="hf-label" style={{ marginBottom: 0 }}>Industries We Work With</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {INDUSTRIES.map(ind => (
                  <span key={ind} className="hf-industry-tag">{ind}</span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─────────────────────────────────────── */}
        {/* 04 · SELECTED WORKS                     */}
        {/* ─────────────────────────────────────── */}
        {portfolios.length > 0 && (() => {
          // Split into 3 columns by modulo index
          const cols: typeof portfolios[] = [[], [], []]
          portfolios.forEach((p, i) => cols[i % 3].push(p))
          return (
          <section className="px-6 lg:px-8 py-20">
            <div className="max-w-7xl mx-auto">

              {/* Header */}
              <ScrollReveal>
                <div className="flex items-end justify-between mb-4 gap-4">
                  <div>
                    <span className="hf-label">Selected Work</span>
                    <h2 style={{ fontSize: 'clamp(28px,3.8vw,46px)', fontWeight: 350, letterSpacing: '-0.011em', lineHeight: 1.26 }}
                      className="hf-title">
                      Selected work that blends product thinking,<br />
                      branding, and UI/UX. Crafted to drive results.
                    </h2>
                  </div>
                </div>
              </ScrollReveal>

              {/* 3-column Kretya gallery */}
              <div className="sw-gallery mt-10">
                {cols.map((col, colIdx) => (
                  <div key={colIdx} className="sw-col">
                    {col.map((p, rowIdx) => {
                      // Alternate tall (3:4) and square (1:1) cards — tall card shifts per column
                      const tall = (colIdx === 0 && rowIdx === 0) || (colIdx === 1 && rowIdx === 1) || (colIdx === 2 && rowIdx === 0)
                      return (
                        <Link key={p.id} href={`/projects/${p.id}`} className="sw-card">
                          <div className="sw-img" style={{ aspectRatio: tall ? '3/4' : '1/1' }}>
                            {p.imageUrl && (
                              <Image
                                src={p.imageUrl}
                                alt={p.title}
                                fill
                                className="object-cover"
                                sizes="(max-width:540px) 100vw, (max-width:900px) 50vw, 33vw"
                              />
                            )}
                          </div>
                          <div className="sw-meta">
                            <p className="sw-title hf-title">{p.title}</p>
                            {p.category && <p className="sw-tagline">{p.category}</p>}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <ScrollReveal>
                <div className="mt-14 flex justify-center">
                  <Link href="/projects" className="ghost-btn dark:text-white text-slate-800">
                    ↳ See all works <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </ScrollReveal>

            </div>
          </section>
          )
        })()}

        {/* ─────────────────────────────────────── */}
        {/* 05 · SERVICES                           */}
        {/* ─────────────────────────────────────── */}
        <section id="services" className="border-t border-black/8 dark:border-white/7">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
            <div className="svc-outer">

              {/* Left: sticky panel */}
              <div className="svc-left">
                <span className="hf-label">Service</span>
                <h2 className="hf-title" style={{
                  fontSize: 'clamp(22px,2.4vw,32px)',
                  fontWeight: 400,
                  letterSpacing: '-0.009em',
                  lineHeight: 1.28,
                }}>
                  A Unified Approach to Digital Growth Through Strategic Design, Development, and Branding
                </h2>
                <Link href="/projects" className="svc-section-cta">
                  ↳ See Our Work
                </Link>
              </div>

              {/* Right: sticky-stacked service cards */}
              <div className="svc-right">
                {SERVICES.map(({ num, label, desc, tags, href }, svcIdx) => {
                  const gallery = svcGalleries[svcIdx]
                  const fallback = portfolios
                  return (
                  <div key={num} className="svc-block">

                    {/* Header: number + title */}
                    <div className="svc-block-header">
                      <span className="svc-num">{num}</span>
                      <Link href={href}>
                        <h3 className="svc-title hf-title">{label}</h3>
                      </Link>
                    </div>

                    {/* Description */}
                    <p className="svc-desc">{desc}</p>

                    {/* 2×2 gallery */}
                    <div className="svc-gallery">
                      {[0, 1, 2, 3].map(j => {
                        const pool = gallery.length > 0 ? gallery : fallback
                        const p = pool[j % Math.max(pool.length, 1)]
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

                    {/* Tags */}
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

        {/* ─────────────────────────────────────── */}
        {/* 06 · FAQ                                */}
        {/* ─────────────────────────────────────── */}
        <section className="px-6 lg:px-8 py-24 border-t border-black/8 dark:border-white/7">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <FaqAccordion items={FAQ_ITEMS} />
            </ScrollReveal>
          </div>
        </section>

        {/* ─────────────────────────────────────── */}
        {/* 07 · TESTIMONIALS                       */}
        {/* ─────────────────────────────────────── */}
        <section className="py-20 border-t border-black/8 dark:border-white/7 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
            <ScrollReveal>
              <span className="hf-label">Testimonials</span>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,44px)', fontWeight: 600, letterSpacing: '-0.025em' }}
                className="hf-title">
                What clients say
              </h2>
            </ScrollReveal>
          </div>

          <div className="relative flex flex-col gap-4 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 hf-fade-l" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 hf-fade-r" />

            {/* Row 1 — clients, left → */}
            <div className="hf-marquee">
              {[...clientTestimonials, ...clientTestimonials].map((t, i) => (
                <TestimonialCard key={i} t={t} />
              ))}
            </div>

            {/* Row 2 — peers, ← right (reverse) */}
            <div className="hf-marquee-rev">
              {[...peerTestimonials, ...peerTestimonials].map((t, i) => (
                <TestimonialCard key={i} t={t} />
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────── */}
        {/* 08 · LATEST ARTICLES                    */}
        {/* ─────────────────────────────────────── */}
        {articles.length > 0 && (
          <section className="px-6 lg:px-8 py-20 border-t border-black/8 dark:border-white/7">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal>
                <div className="flex items-end justify-between mb-10 gap-4">
                  <div>
                    <span className="hf-label">From the Blog</span>
                    <h2 style={{ fontSize: 'clamp(24px,3.5vw,44px)', fontWeight: 600, letterSpacing: '-0.025em' }}
                      className="hf-title">
                      Latest articles
                    </h2>
                  </div>
                  <Link href="/articles" className="hf-accent"
                    style={{ fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    All articles <ArrowUpRight size={13} />
                  </Link>
                </div>
              </ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {articles.map((a, i) => (
                  <ScrollReveal key={a.id} delay={i * 80}>
                    <Link href={`/articles/${a.slug}`}>
                      <article style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,.08)' }}
                        className="dark:border-white/10 group h-full flex flex-col"
                      >
                        <div style={{ aspectRatio: '16/9', background: '#e5e4f7', position: 'relative', overflow: 'hidden' }}
                          className="dark:bg-white/5"
                        >
                          {a.coverImage && (
                            <Image src={a.coverImage} alt={a.title} fill
                              sizes="(max-width:768px) 100vw,33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          )}
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          {a.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                              {a.tags.slice(0, 2).map(tag => (
                                <span key={tag} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}
                                  className="hf-accent">{tag}</span>
                              ))}
                            </div>
                          )}
                          <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: '140%', marginBottom: 8 }}
                            className="hf-title group-hover:opacity-70 transition">
                            {a.title}
                          </h3>
                          {a.excerpt && (
                            <p style={{ fontSize: 13, lineHeight: '165%' }}
                              className="hf-muted line-clamp-2 grow">
                              {a.excerpt}
                            </p>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12 }} className="hf-accent">
                            <span style={{ fontSize: 12, fontWeight: 700 }}>Read more</span>
                            <ArrowUpRight size={11} />
                          </div>
                        </div>
                      </article>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────── */}
        {/* 09 · FINAL CTA                          */}
        {/* ─────────────────────────────────────── */}
        <section id="hf-cta" className="hf-cta-bg px-6 lg:px-8 py-28 border-t border-black/8 dark:border-white/7">
          <ScrollReveal className="max-w-3xl mx-auto text-center">
            <span className="hf-label" style={{ textAlign: 'center' }}>Ready to start?</span>
            <h2 style={{ fontSize: 'clamp(40px,7vw,84px)', fontWeight: 700, lineHeight: 0.97, letterSpacing: '-0.05em', marginBottom: '1.5rem' }}
              className="hf-title">
              Got a fantasy?<br />
              <span className="hf-hero-accent">Let&apos;s make it real.</span>
            </h2>
            <p className="hf-muted" style={{ fontSize: 15, marginBottom: '2.5rem', fontWeight: 300 }}>
              hello@hyperfantasy.co
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <EnquiryCTAButton id="hf-cta-btn" className="grad-btn">
                <Mail size={16} aria-hidden="true" /> Start a Project
              </EnquiryCTAButton>
              <Link href="/projects" className="ghost-btn dark:text-white text-slate-700">
                See Our Work
              </Link>
            </div>
          </ScrollReveal>
        </section>

      </main>

      <HomeFloatingCTA ctaBtnId="hf-cta-btn" scrollThreshold={300} />
    </div>
  )
}
