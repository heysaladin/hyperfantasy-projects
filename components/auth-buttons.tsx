'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export function AuthButtons() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (user) {
    return (
      <Button 
        onClick={handleLogout}
        variant="ghost"
        className="text-black hover:text-black/60"
      >
        Logout
      </Button>
    )
  }

  return (
    <Link href="/login">
      <Button 
        variant="ghost"
        className="text-black hover:text-black/60"
      >
        Login
      </Button>
    </Link>
  )
}