'use client'

import type { ReactNode } from 'react'

const GRADIENT = 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)'

export function OpenEnquiryButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button
      className={className}
      style={{ background: GRADIENT }}
      onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry-modal'))}
    >
      {children}
    </button>
  )
}
