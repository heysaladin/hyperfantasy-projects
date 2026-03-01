// app/login/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      return
    }

    // Login success
    router.push('/admin')
    router.refresh()
  }

  const handleLogout = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  router.push('/')
  router.refresh()
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        
        {error && (
          <div className="bg-red-500/10 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded">
            {error}
          </div>
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  )
}