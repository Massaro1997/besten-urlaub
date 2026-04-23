import { NextResponse } from 'next/server'
import { buildAdvertiserAuthUrl, signState } from '@/lib/tiktok-creator'

/**
 * Start TikTok Advertiser (Marketing API) OAuth flow.
 * Callback exchanges auth_code -> advertiser access_token via Business API.
 */
export async function GET() {
  const state = signState()
  const url = buildAdvertiserAuthUrl(state)
  const res = NextResponse.redirect(url)
  res.cookies.set('tt_adv_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  })
  return res
}
