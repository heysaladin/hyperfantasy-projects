import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Mail, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { testimonials } from "@/data/testimonials"
import dynamic from 'next/dynamic'
import { EnquiryCTAButton } from '@/components/enquiry-cta-button'

const HomeFloatingCTA = dynamic(() =>
  import('@/components/home-floating-cta').then(m => ({ default: m.HomeFloatingCTA }))
)

const BG       = '#030017'
const CARD     = '#181346'
const ACCENT   = '#b394f4'
const GRADIENT = 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)'

const CLIENTS = [
  { name: 'EZ Laundry', logo: '/logos/logo-ezlaundry.png' },
  { name: 'Greatsoft',  logo: '/logos/logo-greatsoft.png'  },
  { name: 'Tresnan',    logo: '/logos/logo-tresnan.png'    },
  { name: 'Akasia',     logo: '/logos/logo-akasia.png'     },
  { name: 'Tammwel',    logo: '/logos/logo-tammwel.png'    },
  { name: 'Sigmatech',  logo: '/logos/logo-sigmatech.png'  },
]

export const metadata: Metadata = {
  title: "About — Hyperfantasy Creative Studio",
  description: "We are a creative studio founded on the belief that great design can transform businesses. Learn more about our story, values, and team.",
}

export default function AboutPage() {
  return (
    <div style={{ fontFamily: 'var(--font-sora, sans-serif)' }} className="min-h-screen hf-page text-slate-900 dark:text-white transition-colors pt-16">
      <style>{`
        .hf-page        { background-color: #ffffff; }
        .dark .hf-page  { background-color: ${BG}; }
        .hf-card        { background: #f1f0ff; }
        .dark .hf-card  { background: ${CARD}; }
        .before-title   { color:#7c3aed; display:block; font-size:14px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; margin-bottom:16px; }
        .dark .before-title { color:${ACCENT}; }
        .hf-accent-text { color:#7c3aed; }
        .dark .hf-accent-text { color:${ACCENT}; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .about-marquee-track { animation: marquee 40s linear infinite; display:flex; gap:24px; width:max-content; }
        .about-marquee-track:hover { animation-play-state: paused; }
        .about-fade-l { background: linear-gradient(to right, #ffffff, transparent); }
        .about-fade-r { background: linear-gradient(to left,  #ffffff, transparent); }
        .dark .about-fade-l { background: linear-gradient(to right, ${BG}, transparent); }
        .dark .about-fade-r { background: linear-gradient(to left,  ${BG}, transparent); }
      `}</style>

      {/* Hero */}
      <section className="pt-24 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="before-title">About Us</span>
          <h1 style={{ fontSize: 'clamp(40px,7vw,86px)', fontWeight: 600, lineHeight: '135%' }} className="mb-8 max-w-4xl dark:text-white text-slate-900">
            We believe in
            <br />
            <span className="dark:text-white/40 text-slate-500">creative excellence</span>
          </h1>
          <p style={{ fontSize: 18, fontWeight: 300, lineHeight: '150%' }} className="dark:text-white/70 text-slate-600 max-w-2xl">
            Hyperfantasy is a creative studio founded on the belief that great design
            can transform businesses. We combine strategic thinking with beautiful
            execution to create digital experiences that resonate.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { value: '50+', label: 'Projects Completed' },
              { value: '30+', label: 'Happy Clients' },
              { value: '5+',  label: 'Years Experience' },
              { value: '5',   label: 'Specialist Teams' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontSize: 'clamp(40px,5vw,64px)', fontWeight: 600 }} className="hf-accent-text mb-2">{value}</div>
                <div style={{ fontSize: 14, fontWeight: 400 }} className="dark:text-white/60 text-slate-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 px-6 lg:px-8 hf-card border-t border-black/10 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div>
              <span className="before-title">Our Story</span>
              <h3 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 600, lineHeight: '135%' }} className="dark:text-white text-slate-900 mb-8">
                Born from a passion for design and technology
              </h3>
            </div>
            <div className="space-y-6 leading-relaxed" style={{ fontSize: 18, fontWeight: 300, lineHeight: '160%' }} >
              <p>
                Founded in 2021, Hyperfantasy started as a small team of designers and developers
                with a shared vision: to create digital work that genuinely moves people. We
                believed the industry needed more studios that cared as much about the craft
                as the outcome.
              </p>
              <p>
                Over the years, we've grown into a full-service creative studio working with
                startups, scale-ups, and established brands across the globe. Every project
                we take on is approached with the same curiosity, rigour, and attention to detail.
              </p>
              <p>
                Today we are a team of specialists in design, engineering, and strategy —
                united by an obsession with making things that work beautifully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <span className="before-title" style={{ marginBottom: 64, display: 'block' }}>Our Values</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { n: '01', title: 'Craft over speed',      body: 'We take the time to get things right. Quality is never negotiated, and every pixel and line of code is treated with intention.' },
              { n: '02', title: 'Honest collaboration',  body: 'We work closely with our clients, sharing our thinking openly and welcoming feedback at every stage of the process.' },
              { n: '03', title: 'Curiosity-driven',      body: 'We stay ahead by constantly exploring new ideas, tools, and disciplines — bringing fresh thinking to every brief.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="space-y-4 border-t border-black/10 dark:border-white/10 pt-8">
                <div style={{ fontSize: 40, fontWeight: 700 }} className="hf-accent-text opacity-30">{n}</div>
                <h3 style={{ fontSize: 22, fontWeight: 600 }} className="dark:text-white text-slate-900">{title}</h3>
                <p style={{ fontSize: 16, fontWeight: 300, lineHeight: '160%' }} className="dark:text-white/60 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients / Logos */}
      <section className="py-20 px-6 lg:px-8 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {CLIENTS.map(({ name, logo }) => (
              <div key={name} className="flex items-center justify-center" style={{ height: 56 }}>
                <Image src={logo} alt={name} width={160} height={56}
                  className="object-contain dark:invert dark:opacity-60 opacity-60 hover:opacity-100 dark:hover:opacity-90 transition-opacity"
                  style={{ maxWidth: 160, height: 'auto' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-black/10 dark:border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
          <span className="before-title" style={{ textAlign: 'center' }}>Testimonials</span>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600 }} className="dark:text-white text-slate-900">
            What they said about us
          </h2>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 about-fade-l" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 about-fade-r" />
          <div className="about-marquee-track">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="about-card border border-black/10 dark:border-white/10 rounded-2xl p-8 shrink-0"
                style={{ width: 380 }}
              >
                <div className="flex gap-0.5 mb-5" role="img" aria-label={`Rating: ${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-white/70 mb-6" style={{ fontSize: 16, fontWeight: 400, lineHeight: '160%' }}>
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                  {t.image && (
                    <Image src={t.image} alt={t.name} width={48} height={48} className="rounded-2xl object-cover shrink-0" />
                  )}
                  <div>
                    <p className="text-slate-900 dark:text-white" style={{ fontSize: 16, fontWeight: 500 }}>{t.name}</p>
                    <p className="text-slate-500 dark:text-white/50" style={{ fontSize: 14 }}>{t.role}{t.company ? `, ${t.company}` : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-20 px-6 lg:px-8 hf-card border-t border-black/10 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet the team</h2>
            <p className="text-lg text-slate-600 dark:text-white/60 max-w-lg">
              The talented people behind every project. Get to know the designers,
              engineers, and strategists who make Hyperfantasy what it is.
            </p>
          </div>
          <Link href="/about/team">
            <Button size="lg" className="bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-white/90 group shrink-0" aria-label="Meet the Hyperfantasy team">
              View Team
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Block */}
      <section className="py-24 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl text-center text-white" style={{ background: CARD, padding: '100px 64px' }}>
            <h2 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 600, lineHeight: '150%', marginBottom: 40 }}>
              Have any awesome fantasy?
            </h2>
            <EnquiryCTAButton id="about-cta-btn" style={{ background: GRADIENT, color: '#fff', borderRadius: 48, padding: '14px 32px', fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Mail size={18} aria-hidden="true" /> Let&apos;s talk!
            </EnquiryCTAButton>
          </div>
        </div>
      </section>

      <HomeFloatingCTA ctaBtnId="about-cta-btn" scrollThreshold={300} />


    </div>
  )
}
