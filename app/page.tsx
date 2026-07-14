import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ArrowRight, ArrowUpRight, Mail, Star, Monitor, Smile, ImageIcon, Printer, Gem, Globe, Smartphone } from 'lucide-react'
import { EnquiryCTAButton } from '@/components/enquiry-cta-button'
import { testimonials } from '@/data/testimonials'
import { resolveContentAsText } from '@/lib/tiptap-content'
import { prisma } from '@/lib/prisma'

const HomeAboutCarousel = dynamic(() => import('@/components/home-about-carousel').then(m => ({ default: m.HomeAboutCarousel })))
const HomeFloatingCTA   = dynamic(() => import('@/components/home-floating-cta').then(m => ({ default: m.HomeFloatingCTA })))

/* ── Design tokens ───────────────────────────────────────────── */
const BG       = '#030017'
const CARD     = '#181346'
const ACCENT   = '#b394f4'
const GRADIENT = 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)'

/* ── Data ────────────────────────────────────────────────────── */
const WORKS_IDS = [
  '0836a3b1-b559-4aac-9a14-ade27fade055',
  '66aa2874-eb23-4ce9-b520-932afefff90e',
  '9969f4b8-0147-4f4d-bb39-2157ee0d79cb',
]
const SHOTS_IDS = [
  'e0f2e536-4b60-4fce-ae18-02de8df964ae',
  '77c71f38-f6c7-4721-8190-3805758820e7',
  'd2ae0651-0693-42c3-b2d0-5d87760d2564',
]
const FEATURED_TESTIMONIAL_IDS = ['2', '4', '5', '8', '10', '1', '6', '3']

const CLIENTS = [
  { name: 'Akasia',     logo: '/logos/logo-akasia.png'     },
  { name: 'EZ Laundry', logo: '/logos/logo-ezlaundry.png' },
  { name: 'Greatsoft',  logo: '/logos/logo-greatsoft.png'  },
  { name: 'Sigmatech',  logo: '/logos/logo-sigmatech.png'  },
  { name: 'Tammwel',    logo: '/logos/logo-tammwel.png'    },
  { name: 'Tresnan',    logo: '/logos/logo-tresnan.png'    },
  { name: 'Wolftagon',  logo: '/logos/logo-wolftagon.png'  },
]

const SPECIALIST_TEAMS = [
  { slug: 'heysaladin', name: 'heysaladin', label: 'Product Design'   },
  { slug: 'dravenclaw', name: 'Dravenclaw', label: 'Graphic & Print'  },
  { slug: 'thinksoft',  name: 'Thinksoft',  label: 'Engineering'      },
  { slug: 'mitayani',   name: 'Mitayani',   label: 'Illustration'     },
  { slug: 'hikari',     name: 'Hikari',     label: 'Brand & Strategy' },
]

const SERVICES = [
  { icon: Monitor,    label: 'UI Design',        desc: 'Pixel-perfect interfaces tailored to your brand.',         team: 'heysaladin' },
  { icon: Smile,      label: 'UX Design',        desc: 'Research-driven flows that delight every user.',           team: 'heysaladin' },
  { icon: ImageIcon,  label: 'Illustration',     desc: 'Original artwork that brings concepts to life.',           team: 'mitayani'   },
  { icon: Printer,    label: 'Graphic Design',   desc: 'Visual communication across print and digital.',           team: 'dravenclaw' },
  { icon: Gem,        label: 'Brand Identity',   desc: 'Strategy-led systems that make brands memorable.',         team: 'hikari'     },
  { icon: Globe,      label: 'Web Dev.',          desc: 'Fast, accessible apps built to scale.',                    team: 'thinksoft'  },
  { icon: Smartphone, label: 'Mobile App Dev.',  desc: 'Native-quality mobile experiences for iOS & Android.',     team: 'thinksoft'  },
]

const STATS = [
  { value: '47+', label: 'Projects delivered'  },
  { value: '5',   label: 'Specialist teams'    },
  { value: '3+',  label: 'Years in the game'   },
  { value: '98%', label: 'Client satisfaction' },
]

const CAPABILITIES = [
  'UI Design', 'UX Design', 'Brand Identity', 'Illustration',
  'Web Development', 'Mobile App', 'Graphic Design', 'Motion Design',
  'Product Strategy', 'Design Systems',
]

async function getProjects(ids: string[]) {
  const rows = await prisma.portfolio.findMany({
    where: { id: { in: ids } },
    select: { id: true, title: true, description: true, imageUrl: true, category: true },
  })
  return ids.map(id => rows.find(r => r.id === id)).filter(Boolean) as typeof rows
}

export default async function Home() {
  const [portfolios, shots, articles] = await Promise.all([
    getProjects(WORKS_IDS),
    getProjects(SHOTS_IDS),
    prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: [{ index: 'desc' }],
      take: 3,
      select: { id: true, slug: true, title: true, excerpt: true, coverImage: true, tags: true },
    }),
  ])

  const featuredTestimonials = FEATURED_TESTIMONIAL_IDS
    .map(id => testimonials.find(t => t.id === id))
    .filter(Boolean) as typeof testimonials

  return (
    <div style={{ fontFamily: 'var(--font-sora, sans-serif)' }}
      className="min-h-screen bg-white dark:text-white transition-colors"
    >
      <style>{`
        .dark .hf-page { background-color: ${BG}; }
        .hf-page       { background-color: #ffffff; }

        /* Buttons */
        .grad-btn       { background:${GRADIENT}; color:#fff; border:none; border-radius:48px; padding:14px 32px; font-size:16px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:opacity .2s; }
        .grad-btn:hover { opacity:.86; }
        .ghost-btn      { border:1px solid rgba(0,0,0,.25); border-radius:24px; padding:13px 24px; font-size:14px; font-weight:500; display:inline-flex; align-items:center; gap:8px; color:inherit; background:transparent; min-height:44px; transition:all .18s; }
        .dark .ghost-btn { border-color:rgba(255,255,255,.3); }
        .ghost-btn:hover { background:rgba(0,0,0,.04); }
        .dark .ghost-btn:hover { background:rgba(255,255,255,.06); }

        /* Labels & accents */
        .before-title   { display:block; font-size:11px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; margin-bottom:14px; color:#7c3aed; }
        .dark .before-title { color:${ACCENT}; }
        .hf-accent-text { color:#7c3aed; }
        .dark .hf-accent-text { color:${ACCENT}; }

        /* Cards */
        .dark .hf-card { background:${CARD}; }
        .hf-card       { background:#f1f0ff; }

        /* Fades */
        .dark .hf-fade-l { background:linear-gradient(to right,${BG},transparent); }
        .dark .hf-fade-r { background:linear-gradient(to left,${BG},transparent); }
        .hf-fade-l { background:linear-gradient(to right,#fff,transparent); }
        .hf-fade-r { background:linear-gradient(to left,#fff,transparent); }

        /* Marquee */
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-track      { animation:marquee 40s linear infinite; display:flex; gap:24px; width:max-content; }
        .marquee-track:hover { animation-play-state:paused; }
        .marquee-track-slow { animation:marquee 80s linear infinite; display:flex; gap:0; width:max-content; }

        /* Hero */
        .hf-hero-bg {
          position:absolute; inset:0; width:100%; height:100%;
          background-image:
            linear-gradient(to bottom,rgba(255,255,255,1) 0%,rgba(255,255,255,.92) 40%,rgba(255,255,255,.55) 70%,transparent 100%),
            url('/bg-light.png');
          background-size:cover; background-position:center;
        }
        .dark .hf-hero-bg {
          background-image:
            radial-gradient(ellipse 90% 55% at 50% 25%,rgba(124,58,237,.18) 0%,transparent 70%),
            url('/bg-hero.png');
          background-size:cover; background-position:center;
        }
        .hf-hero-title { color:#0a0a0a; }
        .hf-hero-sub   { color:rgba(0,0,0,.5); }
        .dark .hf-hero-title { color:#fff; }
        .dark .hf-hero-sub   { color:rgba(255,255,255,.5); }

        /* Gradient text on hero */
        .hf-hero-accent {
          font-style:italic;
          background:${GRADIENT};
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
        }

        /* Stat */
        .hf-stat-value { font-size:clamp(32px,5vw,60px); font-weight:700; letter-spacing:-0.04em; line-height:1; }

        /* Work rows — Cuberto-style numbered */
        .hf-work-row {
          display:grid;
          grid-template-columns:44px 1fr;
          border-top:1px solid rgba(0,0,0,.08);
          cursor:pointer;
          transition:background .18s;
          text-decoration:none;
          color:inherit;
        }
        .dark .hf-work-row { border-color:rgba(255,255,255,.07); }
        .hf-work-row:hover { background:rgba(0,0,0,.018); }
        .dark .hf-work-row:hover { background:rgba(255,255,255,.025); }

        .hf-work-num {
          font-size:11px; font-weight:700; letter-spacing:.06em;
          writing-mode:vertical-rl; text-orientation:mixed;
          transform:rotate(180deg);
          display:flex; align-items:center; justify-content:center;
          padding:32px 0;
          color:rgba(0,0,0,.2);
        }
        .dark .hf-work-num { color:rgba(255,255,255,.15); }

        .hf-work-inner {
          display:grid;
          grid-template-columns:1fr;
          gap:24px;
          padding:32px 0;
          align-items:center;
        }
        @media(min-width:768px) {
          .hf-work-inner { grid-template-columns:1fr 1fr; gap:48px; }
        }

        /* Service rows — editorial list */
        .hf-service-row {
          display:grid;
          grid-template-columns:44px 1fr;
          border-top:1px solid rgba(0,0,0,.07);
          cursor:pointer;
          transition:background .18s;
          text-decoration:none;
          color:inherit;
        }
        .dark .hf-service-row { border-color:rgba(255,255,255,.06); }
        .hf-service-row:hover { background:rgba(0,0,0,.018); }
        .dark .hf-service-row:hover { background:rgba(255,255,255,.025); }

        .hf-service-num {
          font-size:11px; font-weight:700; letter-spacing:.06em;
          display:flex; align-items:center; justify-content:center;
          color:rgba(0,0,0,.2);
        }
        .dark .hf-service-num { color:rgba(255,255,255,.15); }

        .hf-service-inner {
          display:grid;
          grid-template-columns:1fr;
          gap:6px;
          padding:22px 0;
        }
        @media(min-width:768px) {
          .hf-service-inner { grid-template-columns:200px 1fr auto; gap:32px; align-items:center; }
        }

        /* Cap tag */
        .hf-cap-tag {
          display:inline-flex; align-items:center; gap:12px;
          padding:0 28px;
          white-space:nowrap;
          font-size:13px; font-weight:500;
        }
        .hf-cap-dot { width:5px; height:5px; border-radius:50%; background:#7c3aed; flex-shrink:0; }
        .dark .hf-cap-dot { background:${ACCENT}; }

        /* Team pill */
        .hf-team-pill { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:20px; font-size:13px; font-weight:500; border:1px solid rgba(0,0,0,.15); background:transparent; transition:all .18s; }
        .dark .hf-team-pill { border-color:rgba(255,255,255,.2); }
        .hf-team-pill:hover { background:#f1f0ff; }
        .dark .hf-team-pill:hover { background:${CARD}; }

        /* Divider */
        .hf-divider { border-top:1px solid rgba(0,0,0,.08); }
        .dark .hf-divider { border-color:rgba(255,255,255,.07); }
      `}</style>

      <div className="hf-page">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section aria-label="Hero" style={{
          position: 'relative', overflow: 'hidden',
          minHeight: '100svh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '0 1.5rem',
        }}>
          <div className="hf-hero-bg" style={{ zIndex: 0 }} />

          {/* Main block */}
          <div className="max-w-5xl mx-auto w-full" style={{
            position: 'relative', zIndex: 2,
            padding: '9rem 0 4rem',
            textAlign: 'center',
          }}>
            {/* Studio badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(124,58,237,.08)',
              border: '1px solid rgba(124,58,237,.22)',
              borderRadius: 32, padding: '6px 16px',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              color: '#7c3aed', textTransform: 'uppercase',
              marginBottom: 36,
            }}
              className="dark:text-purple-300 dark:border-purple-400/20 dark:bg-purple-400/5"
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
              Creative Studio · Est. 2020
            </div>

            {/* Headline */}
            <h1 className="hf-hero-title" style={{
              fontSize: 'clamp(52px,9.5vw,112px)',
              fontWeight: 700,
              lineHeight: 0.97,
              letterSpacing: '-0.05em',
              marginBottom: 36,
            }}>
              We make your<br />
              wildest digital<br />
              <span className="hf-hero-accent">fantasies</span> real.
            </h1>

            {/* Sub */}
            <p className="hf-hero-sub" style={{
              fontSize: 'clamp(16px,1.8vw,20px)',
              fontWeight: 300,
              lineHeight: 1.65,
              maxWidth: 440,
              margin: '0 auto 44px',
            }}>
              Five specialist teams. One studio.<br />Zero compromises.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <EnquiryCTAButton className="grad-btn">
                Start a project <ArrowRight size={16} aria-hidden="true" />
              </EnquiryCTAButton>
              <Link href="/projects" className="ghost-btn dark:text-white text-slate-800">
                View our work
              </Link>
            </div>
          </div>

          {/* Stats strip — bottom of hero */}
          <div style={{
            position: 'relative', zIndex: 2,
            width: '100%', maxWidth: '72rem',
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            borderTop: '1px solid rgba(0,0,0,.08)',
            padding: '0 1.5rem',
            marginTop: 'auto',
          }}
            className="dark:border-white/10"
          >
            {STATS.map(s => (
              <div key={s.label} style={{ padding: '28px 20px', textAlign: 'center' }}>
                <div className="hf-stat-value hf-hero-title">{s.value}</div>
                <div style={{ fontSize: 12, marginTop: 6 }} className="hf-hero-sub">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CAPABILITIES MARQUEE ─────────────────────────────── */}
        <div style={{ overflow: 'hidden', position: 'relative', padding: '14px 0' }}
          className="hf-divider border-b border-black/8 dark:border-white/10"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 hf-fade-l" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 hf-fade-r" />
          <div className="marquee-track-slow">
            {[...CAPABILITIES, ...CAPABILITIES, ...CAPABILITIES, ...CAPABILITIES].map((cap, i) => (
              <span key={i} className="hf-cap-tag dark:text-white/40 text-slate-400">
                <span className="hf-cap-dot" />
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* ── CLIENTS ──────────────────────────────────────────── */}
        <section style={{ padding: '44px 1.5rem' }} className="border-b border-black/8 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textAlign: 'center', marginBottom: 28, textTransform: 'uppercase' }}
              className="dark:text-white/25 text-slate-400">
              Trusted by growing companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
              {CLIENTS.map(({ name, logo }) => (
                <div key={name} style={{ height: 36 }} className="flex items-center justify-center">
                  <Image src={logo} alt={name} width={160} height={36}
                    className="opacity-40 hover:opacity-70 transition-opacity dark:invert dark:opacity-30 dark:hover:opacity-60"
                    style={{ width: 'auto', height: '100%', maxWidth: 110, objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SELECTED WORKS ────────────────────────────────────── */}
        {portfolios.length > 0 && (
          <section className="py-24 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                paddingBottom: 24, gap: 16,
              }}
                className="hf-divider"
              >
                <div>
                  <span className="before-title">Selected Work</span>
                  <h2 style={{ fontSize: 'clamp(24px,3.5vw,44px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}
                    className="dark:text-white text-slate-900">
                    Case studies &amp; projects
                  </h2>
                </div>
                <Link href="/projects" className="ghost-btn dark:text-white text-slate-700 shrink-0">
                  View all <ArrowUpRight size={14} />
                </Link>
              </div>

              {/* Rows */}
              {portfolios.map((p, i) => (
                <Link key={p.id} href={`/projects/${p.id}`} className="hf-work-row" style={{ display: 'grid' }}>
                  <div className="hf-work-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="hf-work-inner">
                    {/* Image */}
                    <div style={{
                      aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden',
                      background: '#d4d4d4', position: 'relative',
                      order: i % 2 === 0 ? 1 : 2,
                    }}
                      className="dark:bg-white/5"
                    >
                      {p.imageUrl
                        ? <Image src={p.imageUrl} alt={p.title} fill
                            sizes="(max-width:768px) 100vw,50vw"
                            className="object-cover hover:scale-105 transition-transform duration-700" />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 56, fontWeight: 700 }} className="text-slate-300 dark:text-white/10">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                          </div>
                      }
                    </div>
                    {/* Meta */}
                    <div style={{
                      display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14,
                      order: i % 2 === 0 ? 2 : 1,
                      padding: '12px 0',
                    }}>
                      {p.category && (
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}
                          className="hf-accent-text">
                          {p.category}
                        </span>
                      )}
                      <h3 style={{ fontSize: 'clamp(22px,3vw,38px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em' }}
                        className="dark:text-white text-slate-900">
                        {p.title}
                      </h3>
                      <p style={{ fontSize: 15, lineHeight: '170%' }}
                        className="dark:text-white/50 text-slate-500 line-clamp-3">
                        {resolveContentAsText(p.description)}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }} className="hf-accent-text">
                        <span style={{ fontSize: 13, fontWeight: 600 }}>View case study</span>
                        <ArrowUpRight size={13} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="hf-divider" />
            </div>
          </section>
        )}

        {/* ── ABOUT ─────────────────────────────────────────────── */}
        <section className="py-24 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <HomeAboutCarousel />
              <div>
                <span className="before-title">About Us</span>
                <h2 style={{ fontSize: 'clamp(30px,4.5vw,56px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.03em' }}
                  className="dark:text-white text-slate-900 mb-6">
                  One studio.<br />Five specialist<br />teams.
                </h2>
                <p style={{ fontSize: 17, fontWeight: 300, lineHeight: '170%' }}
                  className="dark:text-white/60 text-slate-600 mb-8">
                  Built differently — each team a deep specialist in their craft, united under one roof. You get focused expertise without juggling multiple agencies.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {SPECIALIST_TEAMS.map(t => (
                    <Link key={t.slug} href={`/about/team/${t.slug}`}
                      className="hf-team-pill dark:text-white/80 text-slate-700"
                    >
                      <span className="hf-accent-text" style={{ fontSize: 10 }}>↗</span>
                      <span>{t.name}</span>
                      <span className="dark:text-white/30 text-slate-400" style={{ fontSize: 12 }}>· {t.label}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/about" className="ghost-btn dark:text-white text-slate-800">
                  Our story <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────────── */}
        <section className="py-24 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              paddingBottom: 24, gap: 16,
            }}
              className="hf-divider"
            >
              <div>
                <span className="before-title">What We Do</span>
                <h2 style={{ fontSize: 'clamp(24px,3.5vw,44px)', fontWeight: 600, letterSpacing: '-0.02em' }}
                  className="dark:text-white text-slate-900">
                  Our services
                </h2>
              </div>
              <span style={{ fontSize: 12 }} className="dark:text-white/25 text-slate-400 shrink-0">
                {SERVICES.length} disciplines
              </span>
            </div>

            {/* Editorial list */}
            {SERVICES.map(({ label, desc, team }, i) => (
              <Link key={label} href={`/about/team/${team}`} className="hf-service-row" style={{ display: 'grid' }}>
                <div className="hf-service-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="hf-service-inner">
                  <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}
                    className="dark:text-white text-slate-900">
                    {label}
                  </span>
                  <span style={{ fontSize: 14, lineHeight: '160%' }}
                    className="dark:text-white/45 text-slate-500">
                    {desc}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
                    className="hf-accent-text">
                    by {team} <ArrowUpRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
            <div className="hf-divider" />
          </div>
        </section>

        {/* ── DESIGN SHOTS ─────────────────────────────────────── */}
        <section className="py-24 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, gap: 16 }}>
              <div>
                <span className="before-title">Design Shots</span>
                <h2 style={{ fontSize: 'clamp(24px,3.5vw,44px)', fontWeight: 600, letterSpacing: '-0.02em' }}
                  className="dark:text-white text-slate-900">
                  Explorations &amp; experiments
                </h2>
              </div>
              <Link href="/projects" className="ghost-btn dark:text-white text-slate-700 shrink-0">
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {shots.map(p => (
                <Link key={p.id} href={`/projects/${p.id}`}>
                  <div style={{ borderRadius: 16, aspectRatio: '1', overflow: 'hidden', background: '#d4d4d4', position: 'relative' }}
                    className="dark:bg-white/5 group"
                  >
                    {p.imageUrl && (
                      <Image src={p.imageUrl} alt={p.title} fill
                        sizes="(max-width:640px) 100vw,33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────────── */}
        <section className="py-24 border-t border-black/10 dark:border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
            <span className="before-title">Testimonials</span>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,44px)', fontWeight: 600, letterSpacing: '-0.02em' }}
              className="dark:text-white text-slate-900">
              What clients say
            </h2>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 hf-fade-l" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 hf-fade-r" />
            <div className="marquee-track">
              {[...featuredTestimonials, ...featuredTestimonials].map((t, i) => (
                <div key={i} className="hf-card border border-black/10 dark:border-white/10 rounded-2xl p-7 shrink-0 flex flex-col"
                  style={{ width: 360 }}
                >
                  <div className="flex gap-0.5 mb-5" role="img" aria-label={`Rating: ${t.rating} out of 5`}>
                    {Array.from({ length: Math.floor(t.rating) }).map((_, j) => (
                      <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                  </div>
                  <p style={{ fontSize: t.content.length < 120 ? 21 : t.content.length < 200 ? 17 : 14, fontWeight: 400, lineHeight: '165%' }}
                    className="dark:text-white/65 text-slate-700 mb-6 grow">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-black/10 dark:border-white/10 mt-auto">
                    {t.image && (
                      <Image src={t.image} alt={t.name} width={44} height={44} className="rounded-xl object-cover shrink-0" />
                    )}
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600 }} className="dark:text-white text-slate-900">{t.name}</p>
                      <p style={{ fontSize: 13 }} className="dark:text-white/40 text-slate-500">
                        {t.role}{t.company ? `, ${t.company}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LATEST ARTICLES ──────────────────────────────────── */}
        {articles.length > 0 && (
          <section className="py-24 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
            <div className="max-w-7xl mx-auto">
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, gap: 16 }}>
                <div>
                  <span className="before-title">From the Blog</span>
                  <h2 style={{ fontSize: 'clamp(24px,3.5vw,44px)', fontWeight: 600, letterSpacing: '-0.02em' }}
                    className="dark:text-white text-slate-900">
                    Latest articles
                  </h2>
                </div>
                <Link href="/articles" className="ghost-btn dark:text-white text-slate-700 shrink-0">
                  All articles <ArrowUpRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {articles.map(a => (
                  <Link key={a.id} href={`/articles/${a.slug}`}>
                    <article style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,.08)' }}
                      className="dark:border-white/10 group transition-colors h-full flex flex-col"
                    >
                      <div style={{ aspectRatio: '16/9', background: '#d4d4d4', position: 'relative', overflow: 'hidden' }}
                        className="dark:bg-white/5"
                      >
                        {a.coverImage && (
                          <Image src={a.coverImage} alt={a.title} fill
                            sizes="(max-width:768px) 100vw,33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        )}
                      </div>
                      <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        {a.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                            {a.tags.slice(0, 2).map(tag => (
                              <span key={tag} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}
                                className="hf-accent-text">{tag}</span>
                            ))}
                          </div>
                        )}
                        <h3 style={{ fontSize: 17, fontWeight: 600, lineHeight: '140%', marginBottom: 10 }}
                          className="dark:text-white text-slate-900 group-hover:opacity-70 transition">
                          {a.title}
                        </h3>
                        {a.excerpt && (
                          <p style={{ fontSize: 14, lineHeight: '160%' }}
                            className="dark:text-white/40 text-slate-500 line-clamp-3 grow">
                            {a.excerpt}
                          </p>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 14 }} className="hf-accent-text">
                          <span style={{ fontSize: 12, fontWeight: 700 }}>Read more</span>
                          <ArrowUpRight size={12} />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section id="hf-cta" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
          <video autoPlay muted loop playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.45 }}>
            <source src="/surface_web.mp4" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom,#000 0%,rgba(0,0,0,.2) 30%,rgba(0,0,0,.2) 70%,#000 100%)' }} />
          <div className="max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 2, padding: '100px 1.5rem' }}>
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg,rgba(255,255,255,.10) 0%,rgba(255,255,255,.04) 100%)',
              backdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
              border: '1px solid rgba(255,255,255,.18)',
              borderRadius: 32, padding: 'clamp(48px,6vw,80px) clamp(32px,6vw,72px)',
              textAlign: 'center',
              boxShadow: '0 0 0 0.5px rgba(255,255,255,.08) inset,0 2px 0 rgba(255,255,255,.15) inset,0 32px 80px rgba(0,0,0,.4)',
            }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 32, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.12) 0%,transparent 70%)' }} />
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 20, position: 'relative' }}>
                Ready to build something extraordinary?
              </p>
              <h2 style={{ fontSize: 'clamp(32px,5.5vw,64px)', fontWeight: 700, lineHeight: 1.06, marginBottom: 44, letterSpacing: '-0.04em', color: '#fff', position: 'relative' }}>
                Let&apos;s turn your<br />fantasy into reality.
              </h2>
              <EnquiryCTAButton id="hf-cta-btn" className="grad-btn" style={{ position: 'relative' }}>
                <Mail size={18} aria-hidden="true" /> Start a project
              </EnquiryCTAButton>
            </div>
          </div>
        </section>

      </div>

      <HomeFloatingCTA ctaBtnId="hf-cta-btn" scrollThreshold={300} />
    </div>
  )
}
