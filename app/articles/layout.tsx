import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Articles — Hyperfantasy',
  description: 'Thoughts on design, development, and everything in between.',
}

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
