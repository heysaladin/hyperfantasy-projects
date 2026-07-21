export const dynamic = 'force-dynamic'

import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, ArrowDown } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { HomeFloatingCTA } from "@/components/home-floating-cta"
import { OpenEnquiryButton } from "@/components/open-enquiry-button"
import { TeamPortfolioGrid } from "@/components/team-portfolio-grid"
import localPortfolios from "./data/portfolios"

export const metadata: Metadata = {
  title: "Dravenclaw – Illustration Studio",
  description: "Dravenclaw creates hand-crafted and digital illustrations—characters, concepts, and worlds brought to life.",
}

const SERVICES = [
  { no: "01", title: "Character Illustration", desc: "Bringing personalities to life through expressive, detailed character design for games, books, and brands." },
  { no: "02", title: "Concept Art", desc: "Building visual foundations for worlds, creatures, and environments through iterative concept development." },
  { no: "03", title: "Editorial Illustration", desc: "Visual storytelling for publications and editorial content that captures the essence of the subject." },
  { no: "04", title: "Commercial Art", desc: "Custom illustration solutions for brands seeking to communicate through compelling visual narratives." },
]

const SPECIALIZATIONS = [
  "Character Design", "Concept Art", "Editorial Art", "Book Illustration",
  "Game Art", "Poster Design", "T-Shirt Art", "Brand Illustration",
]

export default async function DravenclawPage() {
  const raw = await prisma.portfolio.findMany({
    where: {
      AND: [
        { OR: [{ isVisible: true }, { isVisible: null }] },
        { category: 'Illustration' },
        { projectDate: { gte: new Date('2011-01-01') } },
      ],
    },
    orderBy: [{ orderIndex: 'desc' }, { projectDate: 'desc' }],
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      category: true,
      tags: true,
      stack: true,
      liveUrl: true,
      projectDate: true,
      complexity: true,
    },
  })

  const dbPortfolios = raw.map(p => ({
    ...p,
    projectDate: p.projectDate ? p.projectDate.toISOString() : null,
  }))

  const portfolios = [...localPortfolios, ...dbPortfolios]

  return (
    <div className="min-h-screen text-slate-900 dark:text-white transition-colors">

      {/* ── Hero — full screen dark ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_60%,rgba(60,40,20,0.25)_0%,transparent_70%)]" />

        <div className="absolute top-0 left-0 right-0 pt-20 px-8 z-10">
          <Link
            href="/about/team"
            className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/70 transition"
          >
            <ArrowLeft size={15} />
            Team
          </Link>
        </div>

        <div className="relative z-10 text-center px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/25 mb-8">
            Illustration Studio
          </p>
          <h1 className="text-7xl md:text-[9rem] lg:text-[12rem] font-bold text-white leading-none tracking-tight mb-8">
            Dravenclaw
          </h1>
          <p className="text-base md:text-lg text-white/40 max-w-md mx-auto leading-relaxed">
            Hand-crafted and digital illustrations — characters, concepts, and worlds brought to life.
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/20 z-10">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <ArrowDown size={14} className="animate-bounce" />
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-28 px-8 bg-white dark:bg-[#0a0a0a] border-b border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-white/25 mb-5">
                About the Studio
              </p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-white">
                We draw worlds<br />worth exploring.
              </h2>
            </div>
            <div className="lg:pt-10">
              <p className="text-lg text-slate-600 dark:text-white/50 leading-relaxed mb-6">
                Dravenclaw is an illustration studio dedicated to creating visual narratives with depth and character. Every piece is crafted with careful attention to detail — designed to be engaging, expressive, and narratively rich.
              </p>
              <p className="text-lg text-slate-600 dark:text-white/50 leading-relaxed">
                From fantastical characters and mythical creatures to soulful compositions and poster art, we approach every project with one goal: making illustrations worth looking at twice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-28 px-8 bg-[#111] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/25 mb-4">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-bold">Our Craft</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-white/10">
            {SERVICES.map((s, i) => (
              <div
                key={s.no}
                className={[
                  "py-10 px-8 border-b border-white/10 flex gap-8 items-start",
                  i % 2 === 0 ? "md:border-r md:border-white/10" : "",
                ].join(" ")}
              >
                <span className="text-xs font-semibold text-white/20 mt-1 shrink-0">{s.no}</span>
                <div>
                  <h3 className="text-lg font-semibold mb-3">{s.title}</h3>
                  <p className="text-white/40 leading-relaxed text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specializations marquee ── */}
      <section className="py-14 bg-white dark:bg-[#0a0a0a] border-b border-slate-100 dark:border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-white/25">Specializations</p>
        </div>
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {[...SPECIALIZATIONS, ...SPECIALIZATIONS].map((label, i) => (
            <span
              key={i}
              className="text-2xl md:text-3xl font-bold text-slate-100 dark:text-white/8 inline-block select-none"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Portfolio (keep as current) ── */}
      <section className="py-16 px-6 lg:px-8 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-3">Illustration Portfolio</h2>
            <p className="text-slate-500 dark:text-white/40 max-w-xl">
              Illustrations created from 2011 to the present—each piece a window into a world of its own.
            </p>
          </div>
          <TeamPortfolioGrid portfolios={portfolios} emptyMessage="No illustration projects available." />
        </div>
      </section>

      {/* ── Contact / CTA — dark ── */}
      <section className="py-32 px-8 bg-[#0d0d0d] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/25 mb-5">Get in Touch</p>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
                Have a creative<br />vision?
              </h2>
              <p className="text-lg text-white/40 leading-relaxed max-w-md">
                We&apos;d love to bring your ideas to life through illustration. Tell us about your project and let&apos;s create something together.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <OpenEnquiryButton className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-black bg-white hover:bg-white/90 transition cursor-pointer w-full">
                Start a Project <ArrowUpRight size={18} aria-hidden="true" />
              </OpenEnquiryButton>
              <div className="border border-white/10 rounded-2xl p-8">
                <p className="text-white/25 text-xs uppercase tracking-widest mb-5">What we love drawing</p>
                <div className="flex flex-wrap gap-2">
                  {SPECIALIZATIONS.map(c => (
                    <span key={c} className="px-3 py-1.5 rounded-full border border-white/10 text-sm text-white/40">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeFloatingCTA ctaBtnId="" alwaysVisible />
    </div>
  )
}
