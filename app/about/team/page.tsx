import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { team } from "@/data/team"
import { TeamImageFlicker } from "@/components/team-image-flicker"
import dynamic from 'next/dynamic'
import { EnquiryCTAButton } from '@/components/enquiry-cta-button'

const HomeFloatingCTA = dynamic(() =>
  import('@/components/home-floating-cta').then(m => ({ default: m.HomeFloatingCTA }))
)

const BG       = '#030017'
const CARD     = '#181346'
const ACCENT   = '#b394f4'
const GRADIENT = 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)'

export const metadata: Metadata = {
  title: "Team — Hyperfantasy Creative Studio",
  description: "Meet the designers, engineers, and strategists behind Hyperfantasy Creative Studio.",
}

export default async function TeamPage() {

  return (
    <div style={{ fontFamily: 'var(--font-sora, sans-serif)' }} className="min-h-screen hf-page text-slate-900 dark:text-white transition-colors pt-16">
      <style>{`
        .hf-page        { background-color: #ffffff; }
        .dark .hf-page  { background-color: ${BG}; }
        .hf-card        { background: #f1f0ff; }
        .dark .hf-card  { background: ${CARD}; }
        .before-title   { color:#7c3aed; display:block; font-size:14px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; margin-bottom:16px; }
        .dark .before-title { color:${ACCENT}; }
      `}</style>

      {/* Header */}
      <section className="pt-16 pb-20 px-6 lg:px-8 border-b border-black/10 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm dark:text-white/40 text-slate-500 hover:text-slate-900 dark:hover:text-white transition mb-10"
            aria-label="Back to About"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            About
          </Link>
          <span className="before-title">The Team</span>
          <h1 style={{ fontSize: 'clamp(40px,7vw,86px)', fontWeight: 600, lineHeight: '135%' }} className="mb-8 dark:text-white text-slate-900">
            The people
            <br />
            <span className="dark:text-white/40 text-slate-500">behind the work</span>
          </h1>
          <p style={{ fontSize: 18, fontWeight: 300, lineHeight: '150%' }} className="dark:text-white/70 text-slate-600 max-w-2xl">
            A small, focused team of designers, engineers, and strategists united by
            a shared obsession with craft and quality.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {team.map((member, index) => {
              const opacity = index === team.length - 1 ? 'opacity-25' : index === team.length - 2 ? 'opacity-50' : ''
              return (
              <article key={member.id} className={`group ${opacity}`}>
                <div className={`relative aspect-square bg-gradient-to-br ${member.gradient} rounded-lg mb-6 overflow-hidden border border-slate-200 dark:border-white/5`}>
                  {member.image ? (
                    index >= 1 && index <= 5
                      ? <TeamImageFlicker src={member.image} alt={member.name} />
                      : member.image?.startsWith('data:')
                        ? <img src={member.image} alt={member.name} className={`${index > 5 ? 'grayscale' : ''} w-full h-full object-cover group-hover:scale-105 transition-transform duration-500`} />
                        : <Image src={member.image!} alt={member.name} fill sizes="(max-width: 768px) 100vw, 33vw" className={`${index > 5 ? 'grayscale' : ''} object-cover group-hover:scale-105 transition-transform duration-500`} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-slate-300 dark:text-white/10 select-none">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-1">{member.name}</h2>
                <p className="text-sm text-slate-500 dark:text-white/40 mb-3">
                  {member.interchangeable ? 'Project-based Team' : member.role}
                </p>
                {member.bio && <p className="text-slate-600 dark:text-white/60 leading-relaxed text-sm">{member.bio}</p>}
              </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Block */}
      <section className="py-24 px-6 lg:px-8 border-t border-black/10 dark:border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl text-center text-white" style={{ background: CARD, padding: '100px 64px' }}>
            <h2 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 600, lineHeight: '150%', marginBottom: 40 }}>
              Have any awesome fantasy?
            </h2>
            <EnquiryCTAButton id="team-cta-btn" style={{ background: GRADIENT, color: '#fff', borderRadius: 48, padding: '14px 32px', fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Mail size={18} aria-hidden="true" /> Let&apos;s talk!
            </EnquiryCTAButton>
          </div>
        </div>
      </section>

      <HomeFloatingCTA ctaBtnId="team-cta-btn" scrollThreshold={300} />


    </div>
  )
}
