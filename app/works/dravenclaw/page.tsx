import type { Metadata } from 'next'
import { StudioPage } from '@/app/works/_studio-page'

export const metadata: Metadata = {
  title: 'Dravenclaw — Illustration Studio · Hyperfantasy',
  description: 'Dravenclaw is the illustration arm of Hyperfantasy. Custom illustrations, character design, and art direction for brands and digital products.',
}

export default function DravenclawPage() {
  return (
    <StudioPage config={{
      slug:        'dravenclaw',
      name:        'Dravenclaw',
      tagline:     'Illustration',
      desc:        'Dravenclaw is the illustration arm of Hyperfantasy. We create custom illustrations, characters, and editorial art that give brands a visual voice unlike anything stock art can offer.',
      services:    ['Custom Illustration', 'Character Design', 'Art Direction', 'Editorial Art', 'Icon Sets', 'Motion Graphics'],
      tags:        ['Illustration', 'Character Design', 'Art Direction', 'Editorial', 'Icon'],
      accentColor: '#be185d',
      metadata,
    }} />
  )
}
