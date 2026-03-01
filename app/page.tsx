'use client';

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight, Mail, Instagram, Linkedin, Twitter, Link } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="text-2xl font-bold tracking-tight">
              HYPERFANTASY
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#work" className="text-sm hover:text-slate-600 dark:hover:text-white/60 transition" aria-label="View our works and projects">Works</a>
              <a href="#about" className="text-sm hover:text-slate-600 dark:hover:text-white/60 transition" aria-label="Learn about our studio">About</a>
              <a href="#services" className="text-sm hover:text-slate-600 dark:hover:text-white/60 transition" aria-label="View our services">Services</a>
              <Button variant="outline" className="border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Contact us for inquiries">
                Contact
              </Button>
              <Link href="/projects" className="text-sm hover:text-slate-600 dark:hover:text-white/60 transition" aria-label="View our portfolio">
                Work
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8">
              We craft digital
              <br />
              <span className="text-slate-500 dark:text-white/40">experiences</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-white/60 mb-12 max-w-2xl">
              A creative studio specializing in design, development, and digital strategy. 
              We help brands stand out in the digital landscape.
            </p>
            <Button size="lg" className="bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-white/90 group" aria-label="View our portfolio and recent projects">
              View Our Work
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section id="work" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-12">Selected Work</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project 1 */}
            <article className="group">
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-900/20 to-blue-900/20 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg mb-6 overflow-hidden border border-slate-200 dark:border-white/5">
                <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-white/10 text-6xl font-bold group-hover:scale-105 transition-transform duration-500" aria-hidden="true">
                  01
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-slate-700 dark:group-hover:text-white/60 transition text-slate-900 dark:text-white">Brand Identity Design</h3>
              <p className="text-slate-600 dark:text-white/40">Visual Design, Branding</p>
            </article>

            {/* Project 2 */}
            <article className="group">
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-900/20 to-red-900/20 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg mb-6 overflow-hidden border border-slate-200 dark:border-white/5">
                <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-white/10 text-6xl font-bold group-hover:scale-105 transition-transform duration-500" aria-hidden="true">
                  02
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-slate-700 dark:group-hover:text-white/60 transition text-slate-900 dark:text-white">E-commerce Platform</h3>
              <p className="text-slate-600 dark:text-white/40">Web Development, UI/UX</p>
            </article>

            {/* Project 3 */}
            <article className="group">
              <div className="aspect-[4/3] bg-gradient-to-br from-green-900/20 to-teal-900/20 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg mb-6 overflow-hidden border border-slate-200 dark:border-white/5">
                <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-white/10 text-6xl font-bold group-hover:scale-105 transition-transform duration-500" aria-hidden="true">
                  03
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-slate-700 dark:group-hover:text-white/60 transition text-slate-900 dark:text-white">Mobile App Design</h3>
              <p className="text-slate-600 dark:text-white/40">Product Design, Mobile</p>
            </article>

            {/* Project 4 */}
            <article className="group">
              <div className="aspect-[4/3] bg-gradient-to-br from-pink-900/20 to-purple-900/20 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg mb-6 overflow-hidden border border-slate-200 dark:border-white/5">
                <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-white/10 text-6xl font-bold group-hover:scale-105 transition-transform duration-500" aria-hidden="true">
                  04
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-slate-700 dark:group-hover:text-white/60 transition text-slate-900 dark:text-white">Digital Campaign</h3>
              <p className="text-slate-600 dark:text-white/40">Marketing, Strategy</p>
            </article>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 lg:px-8 bg-slate-50 dark:bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-slate-900 dark:text-white">
                We believe in
                <br />
                <span className="text-slate-500 dark:text-white/40">creative excellence</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-white/60 leading-relaxed">
                Hyperfantasy is a creative studio founded on the belief that great design 
                can transform businesses. We combine strategic thinking with beautiful 
                execution to create digital experiences that resonate.
              </p>
            </div>
            <div className="space-y-8">
              <div>
                <div className="text-6xl font-bold mb-2 text-slate-900 dark:text-white">50+</div>
                <div className="text-slate-600 dark:text-white/40">Projects Completed</div>
              </div>
              <div>
                <div className="text-6xl font-bold mb-2 text-slate-900 dark:text-white">30+</div>
                <div className="text-slate-600 dark:text-white/40">Happy Clients</div>
              </div>
              <div>
                <div className="text-6xl font-bold mb-2 text-slate-900 dark:text-white">5+</div>
                <div className="text-slate-600 dark:text-white/40">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/40 mb-16">What We Do</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="text-4xl" aria-label="Palette icon representing design">🎨</div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Brand Design</h3>
              <p className="text-slate-600 dark:text-white/60">
                Creating distinctive visual identities that capture the essence of your brand 
                and resonate with your audience.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-4xl" aria-label="Laptop icon representing web development">💻</div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Web Development</h3>
              <p className="text-slate-600 dark:text-white/60">
                Building fast, beautiful, and responsive websites using modern technologies 
                and best practices.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-4xl" aria-label="Mobile phone icon representing digital strategy">📱</div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Digital Strategy</h3>
              <p className="text-slate-600 dark:text-white/60">
                Crafting comprehensive digital strategies that drive growth and deliver 
                measurable results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 bg-slate-900 dark:bg-white text-white dark:text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Let's create something
            <br />
            amazing together
          </h2>
          <p className="text-xl text-white/60 dark:text-black/60 mb-12">
            Have a project in mind? We'd love to hear about it.
          </p>
          <Button size="lg" className="bg-white dark:bg-black text-black dark:text-white hover:bg-white/90 dark:hover:bg-black/90 group" aria-label="Get in touch with us via email">
            <Mail className="mr-2" size={20} aria-hidden="true" />
            Get in Touch
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} aria-hidden="true" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-8 border-t border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">HYPERFANTASY</div>
              <p className="text-slate-600 dark:text-white/40">Creative Studio © 2025</p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-slate-600 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition" aria-label="Follow us on Instagram">
                <Instagram size={24} aria-hidden="true" />
              </a>
              <a href="#" className="text-slate-600 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition" aria-label="Follow us on Twitter">
                <Twitter size={24} aria-hidden="true" />
              </a>
              <a href="#" className="text-slate-600 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition" aria-label="Follow us on LinkedIn">
                <Linkedin size={24} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
