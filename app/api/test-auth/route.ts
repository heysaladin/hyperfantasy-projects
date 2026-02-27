// app/api/test-auth/route.ts
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return Response.json({
    loggedIn: !!user,
    email: user?.email,
    isAdmin: user?.email === 'hello.hyperfantasy@gmail.com'
  })
}