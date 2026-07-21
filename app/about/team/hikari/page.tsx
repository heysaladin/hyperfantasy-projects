export const dynamic = 'force-dynamic'

import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { HomeFloatingCTA } from "@/components/home-floating-cta"
import { OpenEnquiryButton } from "@/components/open-enquiry-button"
import { TeamPortfolioGrid } from "@/components/team-portfolio-grid"

export const metadata: Metadata = {
  title: "MGDverse – Digital Marketing Strategic Growth Partner",
  description: "Since 2016, MGDverse has been delivering measurable growth for brands through immersive digital strategies.",
}

const STATS = [
  { value: "10+", label: "years helping brands grow" },
  { value: "500+", label: "clients since 2016" },
  { value: "74b+", label: "budget handled quarterly" },
  { value: "70+", label: "inspired people" },
]

const SERVICES = [
  {
    no: "01",
    title: "Digital Marketing Consultant",
    desc: "Boost your business with Digital Marketing Consultation, Sales Channel Booster, Ads Handling & Website Development.",
    items: ["Digital Marketing Consultation", "Sales Channel Booster", "Ads Handling", "Website Development"],
  },
  {
    no: "02",
    title: "Creative Performance",
    desc: "Amplify brand awareness & sales with Live Shopping, KOL Management & Creative Content.",
    items: ["Live Shopping", "KOL Management", "Creative Content"],
  },
]

const PROGRAMS = [
  {
    name: "Integrate by MGD",
    desc: "An annual event that brings together business leaders, strategists, and innovators to explore ideas, strategies, and collaborations shaping the future of business and marketing.",
    ig: "https://www.instagram.com/integratebymgd/",
  },
  {
    name: "MGD Academy",
    desc: "The learning hub of MGDverse. We provide in-company digital marketing training with performance assessments and host masterclasses with guest experts — all designed to equip teams & professionals with practical skills.",
    ig: "https://www.instagram.com/mgdacademy/",
  },
  {
    name: "BIMBEL",
    desc: "An annual event focused on actionable marketing and creative strategies, where experts share insights and real cases to help brands grow smarter and perform better.",
    ig: "https://www.instagram.com/voicebymgd/",
  },
]

const CLIENT_INDUSTRIES = ["Fashion", "Beauty", "Mom & Baby"]

export default async function HikariPage() {
  const raw = await prisma.portfolio.findMany({
    where: {
      AND: [
        { OR: [{ isVisible: true }, { isVisible: null }] },
        { category: "Branding" },
        { projectDate: { gte: new Date("2013-01-01") } },
      ],
    },
    orderBy: [{ orderIndex: "desc" }, { projectDate: "desc" }],
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

  const portfolios = raw.map(p => ({
    ...p,
    projectDate: p.projectDate ? p.projectDate.toISOString() : null,
  }))

  return (
    <div className="min-h-screen bg-white text-[#1D1D1D] transition-colors pt-16">

      {/* ── Back nav ── */}
      <div className="border-b border-[#DCDCDC] px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto py-5">
          <Link
            href="/about/team"
            className="inline-flex items-center gap-2 text-sm text-[#8E8E8E] hover:text-[#1D1D1D] transition"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Team
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="bg-[#1D1D1D] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28 lg:py-36">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8E8E8E] mb-6">
              Digital Marketing Strategic Growth Partner
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8">
              Hi There!<br />
              <span className="text-[#AAAAAA]">Ready to transform your digital presence?</span>
            </h1>
            <div className="flex flex-wrap gap-4 mt-10">
              <OpenEnquiryButton className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[64px] text-sm font-semibold bg-white text-[#1D1D1D] hover:bg-[#DCDCDC] transition cursor-pointer">
                Contact Us <ArrowUpRight size={16} aria-hidden="true" />
              </OpenEnquiryButton>
              <a
                href="https://mgdverse.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[64px] text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition"
              >
                Visit MGDverse <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-[#282828] text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/10">
            {STATS.map((s) => (
              <div key={s.value} className="px-8 py-6 first:pl-0 last:pr-0">
                <p className="text-4xl md:text-5xl font-bold mb-2">{s.value}</p>
                <p className="text-sm text-[#8E8E8E] leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="bg-white py-24 lg:py-32 px-6 lg:px-8 border-b border-[#DCDCDC]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8E8E8E] mb-5">About Us</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-8 text-[#1D1D1D]">
                More than inform,<br />we aspire to inspire.
              </h2>
              <p className="text-[#828282] text-lg leading-relaxed mb-6">
                Since 2016, MGDverse has been delivering measurable growth for brands through immersive digital strategies. We&apos;ve had the privilege of helping 500+ brands grow and thrive — and we can&apos;t wait to discover what&apos;s possible with yours!
              </p>
              <OpenEnquiryButton className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[64px] text-sm font-semibold bg-[#1D1D1D] text-white hover:bg-[#303030] transition cursor-pointer">
                Get in Touch <ArrowUpRight size={16} aria-hidden="true" />
              </OpenEnquiryButton>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] bg-[#1D1D1D] rounded-2xl overflow-hidden">
                <img
                  src="https://mgdverse.com/wp-content/uploads/2025/11/audience-194-1024x683.jpg"
                  alt="MGDverse team event"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="aspect-[4/5] bg-[#DCDCDC] rounded-2xl overflow-hidden mt-8">
                <img
                  src="https://mgdverse.com/wp-content/uploads/2025/10/DSC02887-1-scaled.jpg"
                  alt="MGDverse office"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="bg-[#1D1D1D] text-white py-24 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8E8E8E] mb-4">Our Service</p>
            <h2 className="text-3xl md:text-4xl font-bold">What We Do</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.no}
                className="bg-[#282828] rounded-2xl p-10 flex flex-col gap-6 border border-white/5 hover:border-white/15 transition"
              >
                <span className="text-xs font-semibold text-[#8E8E8E]">{s.no}</span>
                <h3 className="text-2xl font-bold">{s.title}</h3>
                <p className="text-[#AAAAAA] leading-relaxed">{s.desc}</p>
                <ul className="flex flex-col gap-2 mt-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[#8E8E8E]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E8E] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clients ── */}
      <section className="bg-white py-24 lg:py-32 px-6 lg:px-8 border-b border-[#DCDCDC]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8E8E8E] mb-4">Our Clients</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1D]">
              500+ brands trust us across
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 mb-16">
            {CLIENT_INDUSTRIES.map((ind) => (
              <span
                key={ind}
                className="px-6 py-2.5 rounded-[64px] border border-[#DCDCDC] text-sm font-semibold text-[#1D1D1D]"
              >
                {ind}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-px bg-[#DCDCDC] rounded-2xl overflow-hidden border border-[#DCDCDC]">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="bg-white aspect-[3/2] flex items-center justify-center"
              >
                <div className="w-12 h-6 bg-[#DCDCDC] rounded opacity-60" />
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#AAAAAA] mt-6">Fashion · Beauty · Mom &amp; Baby</p>
        </div>
      </section>

      {/* ── Programs ── */}
      <section className="bg-[#1D1D1D] text-white py-24 lg:py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8E8E8E] mb-4">Our Programs</p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                More than inform,<br />we aspire to inspire.
              </h2>
              <p className="text-[#AAAAAA] mt-6 leading-relaxed">
                From events to digital marketing masterclasses, our programs build bridges to connect people in the industry with meaningful experience.
              </p>
            </div>
            <div className="flex flex-col divide-y divide-white/10">
              {PROGRAMS.map((p) => (
                <details key={p.name} className="group py-6 cursor-pointer">
                  <summary className="flex items-center justify-between gap-4 list-none font-semibold text-lg select-none">
                    {p.name}
                    <span className="text-[#8E8E8E] group-open:rotate-45 transition-transform duration-200 shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                    </span>
                  </summary>
                  <p className="text-[#AAAAAA] mt-4 leading-relaxed text-sm">{p.desc}</p>
                  <a
                    href={p.ig}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-[64px] text-xs font-semibold border border-white/20 text-white hover:bg-white/10 transition"
                  >
                    Learn More <ExternalLink size={12} aria-hidden="true" />
                  </a>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-white py-24 lg:py-32 px-6 lg:px-8 border-b border-[#DCDCDC]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8E8E8E] mb-4">Our Team</p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6 text-[#1D1D1D]">
                70+ inspired people,<br />one purpose.
              </h2>
              <p className="text-[#828282] text-lg leading-relaxed">
                We are a team of 70+ inspired people, interconnected with one purpose — to prove that when passion meets purpose, digital magic happens.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                "https://mgdverse.com/wp-content/uploads/2025/11/audience-194-300x200.jpg",
                "https://mgdverse.com/wp-content/uploads/2025/10/DSC02887-1-300x200.jpg",
                "https://mgdverse.com/wp-content/uploads/2025/10/DSC02887-1-300x200.jpg",
              ].map((src, i) => (
                <div key={i} className={`bg-[#DCDCDC] rounded-xl overflow-hidden ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
                  <img src={src} alt="MGDverse team" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Branding Portfolio (keep as current) ── */}
      <section className="py-16 px-6 lg:px-8 border-b border-[#DCDCDC] bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-3 text-[#1D1D1D]">Branding Portfolio</h2>
            <p className="text-[#828282] max-w-xl">
              Brand identity work crafted from 2013 to the present—every mark, system, and visual built with intent.
            </p>
          </div>
          <TeamPortfolioGrid portfolios={portfolios} emptyMessage="No branding projects available." />
        </div>
      </section>

      {/* ── Contact / CTA ── */}
      <section className="bg-[#1D1D1D] text-white py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8E8E8E] mb-5">Contact Us</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
                Ready to grow<br />your brand?
              </h2>
              <div className="text-[#AAAAAA] text-sm leading-relaxed space-y-2">
                <p className="font-semibold text-white">Physical Office</p>
                <p>Paskal Hyper Square, Blok A40 Lt.2<br />Jl. HOS. Cokroaminoto No.25-27, Andir, Bandung</p>
              </div>
              <div className="flex gap-4 mt-10">
                <a
                  href="https://www.youtube.com/@mgdverse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[#8E8E8E] hover:text-white hover:border-white/40 transition"
                  aria-label="YouTube"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
                </a>
                <a
                  href="https://www.instagram.com/mgdverse/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[#8E8E8E] hover:text-white hover:border-white/40 transition"
                  aria-label="Instagram"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.9a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/></svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/mgdverse/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[#8E8E8E] hover:text-white hover:border-white/40 transition"
                  aria-label="LinkedIn"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3-1.9 0-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.2 2.4 4.2 5.4v6.3zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7 20.4H3.5V9H7v11.4zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.5C0 23.2.8 24 1.8 24h20.4c1 0 1.8-.8 1.8-1.8V1.7C24 .8 23.2 0 22.2 0z"/></svg>
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <OpenEnquiryButton className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[64px] text-base font-semibold bg-white text-[#1D1D1D] hover:bg-[#DCDCDC] transition cursor-pointer w-full">
                Start a Project <ArrowUpRight size={18} aria-hidden="true" />
              </OpenEnquiryButton>
              <a
                href="https://mgdverse.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[64px] text-base font-semibold border border-white/20 text-white hover:bg-white/10 transition w-full"
              >
                Visit mgdverse.com <ExternalLink size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <HomeFloatingCTA ctaBtnId="" alwaysVisible />
    </div>
  )
}
