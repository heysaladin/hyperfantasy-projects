import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Mail, Github, Linkedin, Instagram, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Muhammad Sholahuddin (Saladin) — Hyperfantasy",
  description: "Digital Product Designer specialising in UX Research, UI Design, and Frontend Development. Based in Bali, Indonesia.",
}

const SPECIALIZATIONS = [
  {
    no: "01",
    title: "UX Research & Ideation",
    desc: "Conducting research to understand problems, define possibilities, and design problem-solving solutions using a Human Centered Design approach.",
  },
  {
    no: "02",
    title: "UI Design & Interaction",
    desc: "Creating user interfaces and interactions through prototypes to solve problems while maintaining usability and aesthetic balance.",
  },
  {
    no: "03",
    title: "Frontend Development",
    desc: "Building digital product appearances using programming technology to maintain design consistency while keeping performance good.",
  },
]

const PROJECTS = [
  {
    title: "Karma Experience Booking",
    tag: "UI Design",
    desc: "UI design exploration for an online booking system with full process documentation for Karma Royal Resort.",
  },
  {
    title: "BUMEJA",
    tag: "UX / UI Design",
    desc: "Mother & Child Health Book application for Indonesian Health Service — tracking fetal and child development.",
  },
  {
    title: "Petado",
    tag: "UX / UI Design",
    desc: "Application for saving and adopting abandoned animals, with educational components for responsible pet ownership.",
  },
  {
    title: "Tresnan",
    tag: "UI Design",
    desc: "A cultural dating app that matches people based on shared cultural values — meaningful connections over superficial ones.",
  },
]

const TESTIMONIALS = [
  {
    name: "Anna Jihad F.",
    role: "Project Manager, FXmedia · Founder, Oartscience Studio",
    quote: "Adin is a motivated, forward thinking and intelligent UI Designer with lots of knowledge in his field. Proactive, energetic and totally organised. Brilliant UI Designer — Didien is extremely enthusiastic about his work which is infectious.",
  },
  {
    name: "Cokorda Gde Dwipa Susila",
    role: "Experienced SCM Professional · Founder, Micepedia",
    quote: "Mas Sholahuddin Muhammad is a rare and outstanding talent I have ever worked with. The typography, colour choosing, precision are top of the line. He was always able to complete the task in a timely manner or even faster than the expected target.",
  },
  {
    name: "Anas AlSuhaim",
    role: "Founder & CTO, Tammwel",
    quote: "I'm writing to recommend Salah Aldin for the position of UI/UX designer. Aldin constantly seeks to learn more about illustration, UI/UX trends and latest tools in the industry. I believe Aldin would be an excellent addition to any design project.",
  },
]

const SOCIALS = [
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/heysaladin/",         icon: Linkedin },
  { label: "GitHub",    href: "https://github.com/heysaladin/",                  icon: Github },
  { label: "Instagram", href: "https://www.instagram.com/heyheysaladin/",        icon: Instagram },
  { label: "Dribbble",  href: "https://dribbble.com/heysaladin/",                icon: ExternalLink },
]

export default function HeySaladinPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors pt-16">

      {/* ── Back nav ── */}
      <div className="border-b border-slate-200 dark:border-white/5 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6">
          <Link
            href="/about/team"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Team
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="py-20 px-6 lg:px-8 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-6">
                Digital Product Designer
              </p>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Hey, I&apos;m<br />
                <span className="text-slate-500 dark:text-white/40">Saladin</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-white/60 leading-relaxed mb-8 max-w-lg">
                I design digital products by understanding the problem and finding the right solution —
                combining research, visual design, interaction design, and a little coding &amp; business knowledge.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/about/team/heysaladin/resume"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-white/90 transition"
                >
                  View Résumé <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <a
                  href="mailto:heysaladin@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium text-slate-700 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                >
                  <Mail size={14} aria-hidden="true" /> heysaladin@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-4 mt-6">
                {SOCIALS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-slate-400 dark:text-white/30 hover:text-slate-900 dark:hover:text-white transition"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-slate-200 dark:border-white/5">
                <Image
                  src="https://heyheysaladin.web.app/assets/images/profile.jpg"
                  alt="Muhammad Sholahuddin (Saladin)"
                  fill
                  sizes="(max-width: 768px) 288px, 384px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Specializations ── */}
      <section className="py-24 px-6 lg:px-8 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-16">What I Do</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {SPECIALIZATIONS.map(({ no, title, desc }) => (
              <div key={no} className="space-y-4 border-t border-slate-200 dark:border-white/10 pt-8">
                <div className="text-4xl font-bold text-slate-100 dark:text-white/10">{no}</div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-slate-600 dark:text-white/60 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-24 px-6 lg:px-8 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-6">About</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Listening + Design Thinking + Creative Solution
              </h2>
            </div>
            <div className="space-y-5 text-slate-600 dark:text-white/60 leading-relaxed">
              <p>
                My name is Muhammad Sholahuddin — Saladin — based in Bali, Indonesia.
                I research, design, and develop digital products with a focus on meaningful user experiences.
              </p>
              <p>
                I like to draw from a young age. In high school I discovered art, music, and theater —
                all of which gave me a sense of aesthetics that directly shapes how I balance
                usability with beauty in every project.
              </p>
              <p>
                I work using a Human Centred Design approach: understand what happened, find the real problem,
                solve it with creative ideas, prototype, and test with real users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="py-24 px-6 lg:px-8 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-16">Featured Work</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECTS.map(({ title, tag, desc }) => (
              <div
                key={title}
                className="p-8 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/20 transition"
              >
                <span className="text-xs uppercase tracking-widest text-slate-400 dark:text-white/30 mb-3 block">{tag}</span>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 lg:px-8 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-16">What They Say</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TESTIMONIALS.map(({ name, role, quote }) => (
              <div key={name} className="space-y-5">
                <p className="text-slate-700 dark:text-white/80 leading-relaxed text-sm">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="border-t border-slate-200 dark:border-white/10 pt-4">
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Resume CTA ── */}
      <section className="py-24 px-6 lg:px-8 bg-slate-900 dark:bg-white text-white dark:text-black">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">See the full résumé</h2>
            <p className="text-white/60 dark:text-black/60">Experience, education, skills &amp; more.</p>
          </div>
          <Link
            href="/about/team/heysaladin/resume"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-black text-black dark:text-white rounded-lg font-medium hover:bg-white/90 dark:hover:bg-black/90 transition shrink-0"
          >
            View Résumé <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

    </div>
  )
}
