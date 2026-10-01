import type { Metadata } from 'next'
import { StudioPage } from '@/app/works/_studio-page'

export const metadata: Metadata = {
  title: 'Hikari — Brand Identity Studio · Hyperfantasy',
  description: 'Hikari is the brand identity arm of Hyperfantasy. We craft logos, visual systems, and brand guidelines for startups and established brands.',
}

export default function HikariPage() {
  return (
    <StudioPage config={{
      slug:        'hikari',
      name:        'Hikari',
      tagline:     'Brand Identity',
      desc:        'Hikari is the brand identity arm of Hyperfantasy. From brand strategy and naming to logos, type systems, and full guidelines — we build the visual language your brand lives in.',
      services:    ['Logo Design', 'Visual Identity', 'Brand Guidelines', 'Naming', 'Packaging', 'Brand Strategy'],
      tags:        ['Logo', 'Brand', 'Visual Identity', 'Brand Identity', 'Branding', 'Packaging', 'Brand Guidelines'],
      accentColor: '#7c3aed',
      metadata,
    }} />
  )
}
