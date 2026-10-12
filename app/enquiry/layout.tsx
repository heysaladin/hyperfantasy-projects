import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enquiry — Hyperfantasy',
}

export default function EnquiryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
