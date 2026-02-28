'use client'

import AdminNav from '@/components/admin-nav'

export default function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <AdminNav />
      <main>{children}</main>
    </div>
  )
}