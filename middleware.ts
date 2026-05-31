import { NextRequest, NextResponse } from 'next/server'

const SUBDOMAIN_ROUTES: Record<string, string> = {
  dravenclaw: '/about/team/dravenclaw',
  thinksoft: '/about/team/thinksoft',
  mitayani: '/about/team/mitayani',
  hikari: '/about/team/hikari',
  demo: '/demo',
  lab: '/lab',
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const subdomain = hostname.split('.')[0]

  const destination = SUBDOMAIN_ROUTES[subdomain]
  if (destination && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(destination, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
}
