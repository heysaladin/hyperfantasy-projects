import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, MapPin, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Résumé — Muhammad Sholahuddin (Saladin)",
  description: "Full résumé of Muhammad Sholahuddin (Saladin), Digital Product Designer based in Bali, Indonesia.",
}

const EXPERIENCE = [
  {
    company: "PT. Karma Royal Resort (Karma Group)",
    location: "Bali",
    role: "Software Developer",
    period: "Nov 2017 — Present",
    items: [
      "Maintenance and improvements to Karma Group Android application",
      "Website management and performance optimisation",
      "Landing page and EDM creation for resort events",
      "Internal innovation research and prototyping",
    ],
  },
  {
    company: "PT. Gadai Pinjam Indonesia",
    location: "Surabaya",
    role: "Frontend Engineer",
    period: "Jan 2017 — Nov 2017",
    items: [
      "Website appearance development using modern web technologies",
      "Performance improvement and code organisation",
      "Collaborated with design and backend teams on product delivery",
    ],
  },
  {
    company: "CV. Melon Studio (Trio Digital Agency)",
    location: "Surabaya",
    role: "Graphic & Web Designer",
    period: "Apr 2013 — Jun 2015",
    items: [
      "Social media management and content creation",
      "Visual design for print and digital media",
      "Logo design, branding, and responsive website design",
    ],
  },
  {
    company: "CV. Jade Indopratama",
    location: "Malang",
    role: "Graphic Designer",
    period: "Jan 2013 — Mar 2013",
    items: [
      "Offset and digital printing design",
      "Technical print settings and production oversight",
    ],
  },
  {
    company: "CV. Garuda Media",
    location: "Malang",
    role: "Illustrator & 2D Animator",
    period: "Sep 2012 — Dec 2012",
    items: [
      "Flash-based interactive learning media creation",
      "2D illustration and animation for educational content",
    ],
  },
]

const EDUCATION = [
  {
    institution: "Universitas Dr. Soetomo",
    location: "Surabaya",
    degree: "Bachelor — Informatics Engineering",
    period: "2013 — 2017",
    note: "Algorithm, data structure, OOP, Java programming, mathematical foundations",
  },
  {
    institution: "Wearnes Education Center",
    location: "Malang",
    degree: "One-year Professional Program — Graphic Design & Computer",
    period: "2011 — 2012",
    note: "Best graduate across all departments. Focus: vector & bitmap design, print, interactive media, 3D, photography, videography.",
  },
  {
    institution: "Madrasah Aliyah Negeri Babat (MAN 2 Lamongan)",
    location: "Lamongan",
    degree: "Senior High School — Natural Sciences",
    period: "2008 — 2011",
    note: "Pradana — Scouting Organisation Chairperson",
  },
]

const SKILLS = [
  "Figma", "Adobe XD", "Adobe Illustrator", "Adobe Photoshop",
  "MarvelApp", "React / React Native", "HTML & CSS", "JavaScript",
  "UI Design", "UX Research", "Interaction Design", "Prototyping",
]

const SPEAKING = [
  { event: "\"Why UX?\" — UXiD Bali Talk Show",                   date: "Jan 18, 2020",  location: "Denpasar, Bali" },
  { event: "\"Make Your First UI Design\" Workshop",              date: "Sep 28, 2019", location: "STIKI Indonesia, Bali" },
  { event: "React Hands-On Workshop",                             date: "Nov 24, 2018", location: "STMIK Primakara, Bali" },
  { event: "\"Introducing React JS & React Native\"",             date: "Dec 9–10, 2017", location: "STMIK Primakara, Bali" },
  { event: "\"React for Beginners\" Workshop",                    date: "Dec 3, 2017",  location: "Graha Sewaka Dharma, Bali" },
  { event: "\"Get Started React Native\" Workshop",               date: "Nov 2, 2017",  location: "Universitas Negeri Surabaya" },
  { event: "\"Introducing GraphQL\"",                             date: "Jun 12, 2017", location: "Universitas Dr. Soetomo" },
  { event: "\"API Documentation with Swagger\"",                  date: "Jul 28, 2017", location: "DILO Surabaya" },
]

const LINKS: { label: string; href: string }[] = [
  { label: "linkedin.com/in/heysaladin",         href: "https://www.linkedin.com/in/heysaladin/" },
  { label: "dribbble.com/heysaladin",            href: "https://dribbble.com/heysaladin/" },
  { label: "behance.net/heysaladin",             href: "https://www.behance.net/heysaladin/" },
  { label: "github.com/heysaladin",              href: "https://github.com/heysaladin/" },
  { label: "medium.com/@heysaladin",             href: "https://medium.com/@heysaladin/" },
]

export default function HeySaladinResumePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors pt-16">

      {/* ── Back nav ── */}
      <div className="border-b border-slate-200 dark:border-white/5 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-6">
          <Link
            href="/about/team/heysaladin"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Saladin
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 space-y-16">

        {/* ── Header ── */}
        <header className="border-b border-slate-200 dark:border-white/10 pb-12">
          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-3">Résumé</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-2">Muhammad<br />Sholahuddin</h1>
          <p className="text-xl text-slate-500 dark:text-white/40 mb-8">Digital Product Designer</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-white/60">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="shrink-0 text-slate-400 dark:text-white/30" aria-hidden="true" />
              Denpasar Barat, Bali, Indonesia
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="shrink-0 text-slate-400 dark:text-white/30" aria-hidden="true" />
              <a href="mailto:heysaladin@gmail.com" className="hover:text-slate-900 dark:hover:text-white transition">
                heysaladin@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="shrink-0 text-slate-400 dark:text-white/30" aria-hidden="true" />
              +62 8564 898 4911
            </div>
            {LINKS.map(({ label, href }) => (
              <div key={href} className="flex items-center gap-2">
                <ExternalLink size={14} className="shrink-0 text-slate-400 dark:text-white/30" aria-hidden="true" />
                <a href={href} target="_blank" rel="noopener noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition">
                  {label}
                </a>
              </div>
            ))}
          </div>
        </header>

        {/* ── Experience ── */}
        <section>
          <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-white/30 mb-10">Experience</h2>
          <div className="space-y-12">
            {EXPERIENCE.map(({ company, location, role, period, items }) => (
              <div key={company} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-10">
                <div className="shrink-0">
                  <p className="text-xs text-slate-400 dark:text-white/30 mb-1">{period}</p>
                  <p className="text-xs text-slate-400 dark:text-white/30">{location}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-0.5">{role}</h3>
                  <p className="text-sm text-slate-500 dark:text-white/40 mb-4">{company}</p>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="text-sm text-slate-600 dark:text-white/60 leading-relaxed flex gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Education ── */}
        <section className="border-t border-slate-200 dark:border-white/10 pt-16">
          <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-white/30 mb-10">Education</h2>
          <div className="space-y-10">
            {EDUCATION.map(({ institution, location, degree, period, note }) => (
              <div key={institution} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-10">
                <div className="shrink-0">
                  <p className="text-xs text-slate-400 dark:text-white/30 mb-1">{period}</p>
                  <p className="text-xs text-slate-400 dark:text-white/30">{location}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-0.5">{institution}</h3>
                  <p className="text-sm text-slate-500 dark:text-white/40 mb-2">{degree}</p>
                  {note && <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">{note}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Skills ── */}
        <section className="border-t border-slate-200 dark:border-white/10 pt-16">
          <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-white/30 mb-8">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-sm border border-slate-200 dark:border-white/10 rounded-full text-slate-700 dark:text-white/70"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* ── Languages ── */}
        <section className="border-t border-slate-200 dark:border-white/10 pt-16">
          <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-white/30 mb-8">Languages</h2>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <p className="font-medium">Bahasa Indonesia</p>
              <p className="text-slate-500 dark:text-white/40">Fluent</p>
            </div>
            <div>
              <p className="font-medium">English</p>
              <p className="text-slate-500 dark:text-white/40">Intermediate</p>
            </div>
          </div>
        </section>

        {/* ── Public Speaking ── */}
        <section className="border-t border-slate-200 dark:border-white/10 pt-16">
          <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-white/30 mb-10">Public Speaking</h2>
          <div className="space-y-5">
            {SPEAKING.map(({ event, date, location }) => (
              <div key={event} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-1 md:gap-10">
                <p className="text-xs text-slate-400 dark:text-white/30 pt-0.5">{date}</p>
                <div>
                  <p className="text-sm font-medium">{event}</p>
                  <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">{location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Notable Achievements ── */}
        <section className="border-t border-slate-200 dark:border-white/10 pt-16 pb-8">
          <h2 className="text-xs uppercase tracking-widest text-slate-400 dark:text-white/30 mb-8">Notable Achievements</h2>
          <div className="space-y-4 text-sm text-slate-600 dark:text-white/60 leading-relaxed">
            <p>
              <span className="font-medium text-slate-900 dark:text-white">Best Graduate</span> — Wearnes Education Center Malang (Oct 2012).
              Top graduate across all departments.
            </p>
            <p>
              <span className="font-medium text-slate-900 dark:text-white">UX Design Sprint Workshop</span> — with Borrys Hasian (May 2017).
              Design Sprint workshop led by a Google Expert.
            </p>
            <p>
              <span className="font-medium text-slate-900 dark:text-white">UXiD Bali</span> — Active member since Aug 2019.
              Content creation and community management for UX/UI design topics.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
