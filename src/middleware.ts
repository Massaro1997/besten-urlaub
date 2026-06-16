import { NextRequest, NextResponse } from 'next/server'

const DASHBOARD_PATHS = [
  '/dashboard',
  '/analytics',
  '/contenuti',
  '/creativi',
  '/destinazioni',
  '/impostazioni',
  '/leads',
  '/offerte',
  '/sales',
  '/tiktok-intel',
  '/tiktok-organic',
  '/tracking',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isDashboard = DASHBOARD_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )
  if (!isDashboard) return NextResponse.next()

  const ok = req.cookies.get('bu_auth')?.value === '1'
  if (ok) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('next', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/analytics/:path*',
    '/contenuti/:path*',
    '/creativi/:path*',
    '/destinazioni/:path*',
    '/impostazioni/:path*',
    '/leads/:path*',
    '/offerte/:path*',
    '/sales/:path*',
    '/tiktok-intel/:path*',
    '/tiktok-organic/:path*',
    '/tracking/:path*',
  ],
}
