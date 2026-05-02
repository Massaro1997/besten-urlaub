import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { exchangeCreatorCode, fetchUserInfo } from '@/lib/tiktok-creator'

/**
 * TikTok Creator OAuth callback.
 *
 * Flow:
 *   1. Validate state cookie (CSRF guard)
 *   2. Exchange code -> access_token + refresh_token
 *   3. Fetch user info (open_id, follower_count, video_count, ...)
 *   4. Upsert TikTokToken row with flow=creator
 *   5. Redirect to admin dashboard
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const code = params.get('code')
  const state = params.get('state')
  const error = params.get('error')
  const cookieState = request.cookies.get('tt_oauth_state')?.value

  // Orchestra bridge: forward to orchestra-api if state has Orchestra prefix
  if (state && state.startsWith('tt_') && state.includes('__')) {
    const orchestraUrl = `https://orchestra-api.slywebsite.de/tiktok/oauth/exchange?${error ? `error=${encodeURIComponent(error)}` : `code=${encodeURIComponent(code || '')}&state=${encodeURIComponent(state)}`}`
    return NextResponse.redirect(orchestraUrl)
  }

  if (error) {
    return NextResponse.redirect(
      new URL(`/tiktok-organic?error=${encodeURIComponent(error)}`, request.url),
    )
  }
  if (!code || !state || state !== cookieState) {
    return NextResponse.redirect(
      new URL('/tiktok-organic?error=invalid_state', request.url),
    )
  }

  try {
    const tok = await exchangeCreatorCode(code)
    const user = await fetchUserInfo(tok.access_token)

    // open_id comes from token response (always present) — fallback to user info
    const openId = tok.open_id || user.open_id
    if (!openId) throw new Error(`Missing open_id. Token: ${JSON.stringify(tok)}, User: ${JSON.stringify(user)}`)

    await prisma.tikTokToken.upsert({
      where: { flow_accountKey: { flow: 'creator', accountKey: openId } },
      create: {
        flow: 'creator',
        accountKey: openId,
        accessToken: tok.access_token,
        refreshToken: tok.refresh_token ?? null,
        expiresAt: new Date(Date.now() + tok.expires_in * 1000),
        scope: tok.scope ?? null,
        rawGrant: tok as unknown as object,
      },
      update: {
        accessToken: tok.access_token,
        refreshToken: tok.refresh_token ?? undefined,
        expiresAt: new Date(Date.now() + tok.expires_in * 1000),
        scope: tok.scope ?? null,
        rawGrant: tok as unknown as object,
      },
    })

    // Snapshot profile stats for today
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    await prisma.tikTokCreatorInsight.upsert({
      where: { openId_date: { openId, date: today } },
      create: {
        openId,
        date: today,
        followerCount: user.follower_count ?? 0,
        followingCount: user.following_count ?? 0,
        likesCount: BigInt(user.likes_count ?? 0),
        videoCount: user.video_count ?? 0,
      },
      update: {
        followerCount: user.follower_count ?? 0,
        followingCount: user.following_count ?? 0,
        likesCount: BigInt(user.likes_count ?? 0),
        videoCount: user.video_count ?? 0,
      },
    })

    const res = NextResponse.redirect(
      new URL(`/tiktok-organic?connected=${openId}`, request.url),
    )
    res.cookies.delete('tt_oauth_state')
    return res
  } catch (e) {
    console.error('[tiktok/creator/callback] error:', e)
    const msg = e instanceof Error ? e.message : String(e)
    const detail = encodeURIComponent(msg.slice(0, 500))
    return NextResponse.redirect(
      new URL(`/tiktok-organic?error=exchange_failed&detail=${detail}`, request.url),
    )
  }
}
