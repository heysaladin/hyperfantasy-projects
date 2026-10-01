import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { ArrowRight, Check } from 'lucide-react'
import { EnquiryCTAButton } from '@/components/enquiry-cta-button'
import { ScrollReveal } from '@/components/scroll-reveal'
import { FaqAccordion } from '@/components/faq-accordion'

const HomeFloatingCTA = dynamic(() =>
  import('@/components/home-floating-cta').then(m => ({ default: m.HomeFloatingCTA }))
)

/* ── Tokens ─────────────────────────────────────── */
const BG       = '#030017'
const CARD     = '#0e0b2e'
const ACCENT   = '#b394f4'
const GRADIENT = 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)'

/* ── Static data ─────────────────────────────────── */
const OFFERS = [
  {
    num: '01',
    tag: 'Brand + Web',
    name: 'Launch Kit',
    tagline: 'Go from zero to live — in two weeks.',
    desc: 'Everything a new product needs to make a great first impression: a sharp brand identity and a high-converting landing page, built together so they feel like one thing.',
    price: 'From $3,500',
    timeline: '2 weeks',
    ideal: 'Funded startups & solo founders launching their first product.',
    deliverables: [
      'Logo + colour & type system',
      'Brand guidelines (PDF)',
      'Landing page design (Figma)',
      'Responsive Next.js build',
      'Basic SEO + OG tags',
      'CMS setup (optional)',
    ],
    accent: '#7c3aed',
  },
  {
    num: '02',
    tag: 'UI/UX',
    name: 'Dashboard Sprint',
    tagline: 'A production-ready dashboard UI, fast.',
    desc: 'We design and build a fully functional dashboard interface using Cubicle Design System — consistent components, light/dark mode, and clean data visualisation out of the box.',
    price: 'From $4,000',
    timeline: '2 weeks',
    ideal: 'SaaS teams who need a polished internal or customer-facing dashboard without the back-and-forth.',
    deliverables: [
      'UX wireframes + hi-fi Figma',
      'Responsive React/Next.js build',
      'Built on Cubicle Design System',
      'Light & dark mode',
      'Up to 6 core screens',
      'Handover + component docs',
    ],
    accent: '#1e40af',
  },
  {
    num: '03',
    tag: 'Design System',
    name: 'Design System Setup',
    tagline: 'One source of truth for design and code.',
    desc: "We build your Figma library and matching component codebase so design and dev finally speak the same language. Tokens, components, docs — ready to scale.",
    price: 'From $5,000',
    timeline: '3 weeks',
    ideal: 'Scale-ups and product teams whose design and dev are still operating from separate playbooks.',
    deliverables: [
      'Figma Variables (colour, type, spacing)',
      'Published Team Library',
      'Core component set (~20 components)',
      'React/Next.js component library',
      'Figma Code Connect per component',
      'Usage docs + handover session',
    ],
    accent: '#be185d',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Brief in 10 minutes',
    desc: 'Fill out the enquiry form. No long calls upfront — we read carefully and come prepared.',
  },
  {
    num: '02',
    title: 'Proposal within 24 h',
    desc: 'You get a fixed-price proposal: scope, deliverables, timeline, and total. No surprises.',
  },
  {
    num: '03',
    title: 'We build',
    desc: 'Work starts immediately after sign-off. You see progress as it happens, not at the end.',
  },
  {
    num: '04',
    title: 'Handover',
    desc: 'All source files, assets, and docs are yours. We stay available for questions post-delivery.',
  },
]

const FAQ_ITEMS = [
  {
    q: 'Can I customise the scope of a package?',
    a: "Yes. The packages are starting points, not rigid boxes. If you need a slightly different mix of deliverables, tell us in the brief and we'll scope it accordingly — usually at a similar price.",
  },
  {
    q: 'What do I need to prepare before we start?',
    a: "For Launch Kit: brand direction (moodboard, references, or a competitor you like/dislike). For Dashboard Sprint: your data model and a list of screens. For Design System Setup: existing Figma files and your component inventory. We'll send a brief template once you sign off.",
  },
  {
    q: 'Do the timelines include revision rounds?',
    a: 'Yes — two revision rounds per major deliverable are built into every package. The timeline only shifts if the scope changes after kick-off.',
  },
  {
    q: "We're based in the US / Australia / NZ. How does the timezone work?",
    a: "We're in East Java, Indonesia (GMT+7). For US clients we work asynchronously — you brief us, we build overnight, you wake up to progress. Most clients find the gap actually speeds things up.",
  },
  {
    q: 'What if we need ongoing support after handover?',
    a: "Many clients move to a monthly design retainer after a package — maintenance, iterations, and new assets on a recurring basis. Ask about retainer options in your brief.",
  },
  {
    q: 'How do I pay?',
    a: '50% upfront, 50% on delivery. We accept USD bank transfer and Wise. IDR available for local clients.',
  },
]

export const metadata: Metadata = {
  title: 'Productized Offers — Hyperfantasy',
  description: 'Fixed scope. Fixed price. Fixed timeline. Three productized offers for startups and founders who need senior-quality design and development without the agency overhead.',
}

export default function OfferPage() {
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

        /* ── Buttons ── */
        .grad-btn {
          background:${GRADIENT}; color:#fff; border:none;
          border-radius:48px; padding:13px 28px;
          font-size:14px; font-weight:600; cursor:pointer;
          display:inline-flex; align-items:center; gap:8px; transition:opacity .2s;
        }
        .grad-btn:hover { opacity:.85; }
        .grad-btn:focus-visible { outline:2px solid #7c3aed; outline-offset:3px; }

        .ghost-btn {
          background:transparent; color:rgba(0,0,0,.7);
          border:1px solid rgba(0,0,0,.15);
          border-radius:48px; padding:12px 26px;
          font-size:14px; font-weight:500; cursor:pointer;
          display:inline-flex; align-items:center; gap:8px; transition:background .15s, color .15s;
        }
        .dark .ghost-btn { color:rgba(255,255,255,.7); border-color:rgba(255,255,255,.18); }
        .ghost-btn:hover { background:rgba(0,0,0,.04); }
        .dark .ghost-btn:hover { background:rgba(255,255,255,.06); }

        /* ── Hero pill ── */
        .hero-pill {
          display:inline-flex; align-items:center; gap:8px;
          border:1px solid rgba(0,0,0,.1); border-radius:999px;
          padding:6px 14px 6px 6px; font-size:12px; font-weight:500;
          color:rgba(0,0,0,.55); background:#fff;
          margin-bottom:2rem;
        }
        .dark .hero-pill { border-color:rgba(255,255,255,.12); background:rgba(255,255,255,.05); color:rgba(255,255,255,.5); }
        .hero-pill-dot {
          width:8px; height:8px; border-radius:50%;
          background:${GRADIENT};
        }

        /* ── Offer cards ── */
        .offer-grid {
          display:grid; grid-template-columns:repeat(3,1fr); gap:1rem;
        }
        @media(max-width:1024px) { .offer-grid { grid-template-columns:1fr; } }

        .offer-card {
          border:1px solid rgba(0,0,0,.09); border-radius:16px;
          padding:2rem; display:flex; flex-direction:column;
          background:#fff; transition:box-shadow .2s, transform .2s;
        }
        .dark .offer-card { border-color:rgba(255,255,255,.09); background:${CARD}; }
        .offer-card:hover { box-shadow:0 8px 40px rgba(0,0,0,.07); transform:translateY(-2px); }
        .dark .offer-card:hover { box-shadow:0 8px 40px rgba(0,0,0,.4); }

        .offer-num { font-size:12px; font-weight:400; color:rgba(0,0,0,.3); margin-bottom:.5rem; }
        .dark .offer-num { color:rgba(255,255,255,.25); }

        .offer-tag {
          display:inline-block; font-size:11px; font-weight:600;
          letter-spacing:.12em; text-transform:uppercase;
          border-radius:999px; padding:4px 10px;
          background:rgba(124,58,237,.1); color:#7c3aed;
          margin-bottom:1.25rem;
        }
        .dark .offer-tag { background:rgba(179,148,244,.12); color:${ACCENT}; }

        .offer-name {
          font-size:clamp(20px,2vw,26px); font-weight:500;
          letter-spacing:-0.02em; margin-bottom:.5rem;
        }
        .offer-tagline { font-size:14px; font-weight:400; margin-bottom:1rem; color:rgba(0,0,0,.55); }
        .dark .offer-tagline { color:rgba(255,255,255,.45); }
        .offer-desc { font-size:14px; line-height:1.75; color:rgba(0,0,0,.6); margin-bottom:1.75rem; flex:1; }
        .dark .offer-desc { color:rgba(255,255,255,.5); }

        .offer-meta {
          display:flex; gap:.75rem; margin-bottom:1.5rem;
          padding:1rem; border-radius:10px;
          background:rgba(0,0,0,.03);
        }
        .dark .offer-meta { background:rgba(255,255,255,.04); }
        .offer-meta-item { display:flex; flex-direction:column; gap:3px; }
        .offer-meta-label { font-size:10px; font-weight:600; letter-spacing:.15em; text-transform:uppercase; color:rgba(0,0,0,.35); }
        .dark .offer-meta-label { color:rgba(255,255,255,.3); }
        .offer-meta-value { font-size:15px; font-weight:600; letter-spacing:-0.01em; }

        .offer-divider { border:none; border-top:1px solid rgba(0,0,0,.07); margin:1.25rem 0; }
        .dark .offer-divider { border-color:rgba(255,255,255,.07); }

        .offer-deliverables { list-style:none; margin:0 0 1.5rem; padding:0; display:flex; flex-direction:column; gap:.6rem; }
        .offer-deliverables li { display:flex; align-items:flex-start; gap:.6rem; font-size:13px; color:rgba(0,0,0,.7); line-height:1.5; }
        .dark .offer-deliverables li { color:rgba(255,255,255,.6); }
        .offer-check { flex-shrink:0; margin-top:1px; }

        .offer-ideal { font-size:12px; color:rgba(0,0,0,.4); line-height:1.6; margin-bottom:1.5rem; }
        .dark .offer-ideal { color:rgba(255,255,255,.3); }

        /* ── Process steps ── */
        .steps-grid {
          display:grid; grid-template-columns:repeat(4,1fr); gap:1px;
          border:1px solid rgba(0,0,0,.08); border-radius:16px; overflow:hidden;
        }
        @media(max-width:768px) { .steps-grid { grid-template-columns:1fr 1fr; } }
        @media(max-width:480px) { .steps-grid { grid-template-columns:1fr; } }

        .step-cell {
          padding:2rem; background:#fff;
          border-right:1px solid rgba(0,0,0,.06);
        }
        .dark .step-cell { background:${CARD}; border-color:rgba(255,255,255,.06); }
        .step-cell:last-child { border-right:none; }

        .step-num { font-size:11px; font-weight:600; letter-spacing:.15em; color:rgba(0,0,0,.3); margin-bottom:1.25rem; }
        .dark .step-num { color:rgba(255,255,255,.25); }
        .step-title { font-size:15px; font-weight:500; margin-bottom:.6rem; letter-spacing:-0.01em; }
        .step-desc { font-size:13px; line-height:1.7; color:rgba(0,0,0,.55); }
        .dark .step-desc { color:rgba(255,255,255,.45); }

        /* ── Bottom CTA ── */
        .dark .cta-section { background:${CARD}; }
        .cta-section { background:#f5f3ff; }
      `}</style>

      <div className="hf-page">

        {/* ── 01 · HERO ── */}
        <section className="px-6 lg:px-8 border-b border-black/8 dark:border-white/7 pt-32 pb-20">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="hero-pill">
                <span className="hero-pill-dot" aria-hidden="true" />
                Fixed scope · Fixed price · Fixed timeline
              </div>
              <span className="hf-label">Productized Offers</span>
              <h1
                className="hf-title"
                style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.03em', maxWidth: 780, marginBottom: '1.5rem' }}
              >
                Senior-quality work,<br />without the agency overhead.
              </h1>
              <p className="hf-body" style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.8, maxWidth: 540, marginBottom: '2.5rem' }}>
                Three focused packages for funded startups and solo founders in US, AU, and NZ. Each one delivers a complete outcome — on a fixed price and a real timeline.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <EnquiryCTAButton className="grad-btn" id="offer-hero-cta">
                  Start a Project <ArrowRight size={14} aria-hidden="true" />
                </EnquiryCTAButton>
                <a href="#packages" className="ghost-btn">
                  See packages
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── 02 · VALUE PROPS ── */}
        <section className="px-6 lg:px-8 py-16 border-b border-black/8 dark:border-white/7">
          <div className="max-w-7xl mx-auto">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem' }} className="max-[640px]:grid-cols-1">
              {[
                { title: 'No surprises', desc: 'Flat price agreed upfront. The proposal is the contract — nothing moves without your sign-off.' },
                { title: 'Senior people only', desc: 'You work directly with the specialists doing the work. No account managers in the middle.' },
                { title: 'Real timelines', desc: 'Two weeks means two weeks. Revision rounds are already factored in, not bolted on at the end.' },
              ].map((v, i) => (
                <ScrollReveal key={v.title} delay={i * 80}>
                  <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,.08)' }} className="dark:border-white/7">
                    <h3 className="hf-title" style={{ fontSize: 17, fontWeight: 500, marginBottom: '.5rem', letterSpacing: '-0.01em' }}>{v.title}</h3>
                    <p className="hf-body" style={{ fontSize: 14, lineHeight: 1.75 }}>{v.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 03 · PACKAGES ── */}
        <section id="packages" className="px-6 lg:px-8 py-20 border-b border-black/8 dark:border-white/7">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <span className="hf-label">Packages</span>
              <h2 className="hf-title hf-h2" style={{ maxWidth: 520, marginBottom: '3rem' }}>
                Pick the package that matches where you are right now.
              </h2>
            </ScrollReveal>

            <div className="offer-grid">
              {OFFERS.map((offer, i) => (
                <ScrollReveal key={offer.num} delay={i * 100}>
                  <article className="offer-card">
                    <p className="offer-num">{offer.num}</p>
                    <span className="offer-tag">{offer.tag}</span>
                    <h3 className="offer-name hf-title">{offer.name}</h3>
                    <p className="offer-tagline">{offer.tagline}</p>
                    <p className="offer-desc">{offer.desc}</p>

                    <div className="offer-meta">
                      <div className="offer-meta-item" style={{ flex: 1 }}>
                        <span className="offer-meta-label">Starting at</span>
                        <span className="offer-meta-value hf-title">{offer.price}</span>
                      </div>
                      <div style={{ width: 1, background: 'rgba(0,0,0,.07)' }} className="dark:bg-white/7" />
                      <div className="offer-meta-item" style={{ flex: 1, paddingLeft: '.75rem' }}>
                        <span className="offer-meta-label">Timeline</span>
                        <span className="offer-meta-value hf-title">{offer.timeline}</span>
                      </div>
                    </div>

                    <hr className="offer-divider" />

                    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,.35)', marginBottom: '.75rem' }} className="dark:text-white/30">
                      What's included
                    </p>
                    <ul className="offer-deliverables">
                      {offer.deliverables.map(d => (
                        <li key={d}>
                          <Check size={13} className="offer-check" style={{ color: offer.accent }} aria-hidden="true" />
                          {d}
                        </li>
                      ))}
                    </ul>

                    <p className="offer-ideal">
                      <strong style={{ fontWeight: 600 }}>Best for:</strong> {offer.ideal}
                    </p>

                    <EnquiryCTAButton
                      className="grad-btn"
                      id={`offer-cta-${i}`}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Get started <ArrowRight size={14} aria-hidden="true" />
                    </EnquiryCTAButton>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 04 · PROCESS ── */}
        <section className="px-6 lg:px-8 py-20 border-b border-black/8 dark:border-white/7">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <span className="hf-label">How it works</span>
              <h2 className="hf-title hf-h2" style={{ maxWidth: 440, marginBottom: '3rem' }}>
                From brief to handover in four steps.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="steps-grid">
                {STEPS.map(step => (
                  <div key={step.num} className="step-cell">
                    <p className="step-num">{step.num}</p>
                    <h3 className="step-title hf-title">{step.title}</h3>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── 05 · FAQ ── */}
        <section className="px-6 lg:px-8 py-24 border-b border-black/8 dark:border-white/7">
          <div className="max-w-7xl mx-auto">
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>

        {/* ── 06 · BOTTOM CTA ── */}
        <section className="cta-section px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto" style={{ textAlign: 'center' }}>
            <ScrollReveal>
              <span className="hf-label" style={{ textAlign: 'center' }}>Ready?</span>
              <h2
                className="hf-title"
                style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}
              >
                Tell us what you're building.
              </h2>
              <p className="hf-body" style={{ fontSize: 15, maxWidth: 420, margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
                Fill in the brief — takes 10 minutes. We'll send a fixed-price proposal within 24 hours.
              </p>
              <EnquiryCTAButton className="grad-btn" id="offer-bottom-cta" style={{ fontSize: 15, padding: '15px 36px' }}>
                Start a Project <ArrowRight size={15} aria-hidden="true" />
              </EnquiryCTAButton>
            </ScrollReveal>
          </div>
        </section>

      </div>

      <HomeFloatingCTA ctaBtnId="offer-hero-cta" scrollThreshold={300} />
    </div>
  )
}
