import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login — Hyperfantasy',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
