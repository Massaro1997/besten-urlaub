import { NextResponse } from 'next/server'
import { buildCreatorAuthUrl, signState } from '@/lib/tiktok-creator'

/**
 * Start TikTok Creator OAuth flow.
 * Generates a signed state, stores it in an HTTP-only cookie, redirects to authorize.
 * Callback validates state to prevent CSRF.
 */
export async function GET() {
  const state = signState()
  const url = buildCreatorAuthUrl(state)
  const res = NextResponse.redirect(url)
  res.cookies.set('tt_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 min
  })
  return res
}
