import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects — Hyperfantasy',
  description: 'Selected projects showcasing our expertise in design and development.',
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
