// const handleLogout = async () => {
//   const supabase = createClient()
//   await supabase.auth.signOut()
//   router.push('/')
//   router.refresh()
// }

/*
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header/Nav * /}
      <nav className="border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </nav>

      { Content /}
      <main>
        {children}
      </main>
    </div>
  )
}
*/


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