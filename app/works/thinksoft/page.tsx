import type { Metadata } from 'next'
import { StudioPage } from '@/app/works/_studio-page'

export const metadata: Metadata = {
  title: 'Thinksoft — Development Studio · Hyperfantasy',
  description: 'Thinksoft is the development arm of Hyperfantasy. Responsive websites, web apps, and dashboards built with React and Next.js.',
}

export default function ThinksoftPage() {
  return (
    <StudioPage config={{
      slug:        'thinksoft',
      name:        'Thinksoft',
      tagline:     'Development',
      desc:        'Thinksoft is the development arm of Hyperfantasy. We build responsive, scalable websites and web apps with React and Next.js — from landing pages to complex dashboards and CMS integrations.',
      services:    ['Website', 'Web App', 'Dashboard', 'CMS Integration', 'API Integration', 'Micro-interactions'],
      tags:        ['Dashboard', 'Web App', 'Website', 'CMS', 'Development', 'Frontend', 'Next.js', 'React'],
      accentColor: '#1e40af',
      metadata,
    }} />
  )
}
