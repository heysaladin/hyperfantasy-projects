import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUBDOMAIN_ROUTES: Record<string, string> = {
  heysaladin: '/about/team/heysaladin',
  dravenclaw: '/about/team/dravenclaw',
  thinksoft: '/about/team/thinksoft',
  mitayani: '/about/team/mitayani',
  hikari: '/about/team/hikari',
  demo: '/demo',
  lab: '/lab',
}

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const subdomain = hostname.split('.')[0]

  const destination = SUBDOMAIN_ROUTES[subdomain]
  if (destination && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(destination, request.url))
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({
              request: { headers: request.headers },
            })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options) {
            request.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({
              request: { headers: request.headers },
            })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user.email !== 'hello.hyperfantasy@gmail.com') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
}
