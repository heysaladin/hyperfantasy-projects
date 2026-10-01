import type { Metadata } from 'next'
import { StudioPage } from '@/app/works/_studio-page'

export const metadata: Metadata = {
  title: 'Mitayani — Graphic Design Studio · Hyperfantasy',
  description: 'Mitayani is the graphic design arm of Hyperfantasy. Print, social media, marketing collateral, and visual communication for brands.',
}

export default function MitayaniPage() {
  return (
    <StudioPage config={{
      slug:        'mitayani',
      name:        'Mitayani',
      tagline:     'Graphic Design',
      desc:        'Mitayani is the graphic design arm of Hyperfantasy. We handle print, digital, and marketing collateral — posters, social media assets, pitch decks, and everything a brand needs to communicate clearly at every touchpoint.',
      services:    ['Print Design', 'Social Media', 'Pitch Deck', 'Poster', 'Marketing Collateral', 'Layout Design'],
      tags:        ['Graphic Design', 'Poster', 'Social Media', 'Print', 'Pitch Deck', 'Layout', 'Marketing'],
      accentColor: '#0f766e',
      metadata,
    }} />
  )
}
