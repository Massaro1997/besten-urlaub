import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * TikTok Advertiser (Marketing API) OAuth callback.
 *
 * Flow:
 *   1. Validate state cookie
 *   2. Exchange auth_code -> access_token + list of advertiser_ids
 *      POST https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/
 *      body: { app_id, secret, auth_code }
 *   3. Upsert one TikTokToken row per advertiser_id with flow=advertiser
 *   4. Redirect to admin dashboard
 *
 * Note: advertiser tokens returned here are long-lived (per docs, no explicit
 * expiration). We store a far-future expiresAt (+5 years) and rely on the
 * API itself to return 401 if revoked, prompting re-auth.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const code = params.get('auth_code') || params.get('code')
  const state = params.get('state')
  const cookieState = request.cookies.get('tt_adv_state')?.value

  if (!code || !state || state !== cookieState) {
    return NextResponse.redirect(
      new URL('/tiktok-organic?error=invalid_adv_state', request.url),
    )
  }

  try {
    const tokenRes = await fetch(
      'https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: process.env.TIKTOK_APP_ID,
          secret: process.env.TIKTOK_APP_SECRET,
          auth_code: code,
        }),
      },
    )
    const json = await tokenRes.json()
    if (json.code !== 0 || !json.data?.access_token) {
      throw new Error(`Advertiser token exchange failed: ${JSON.stringify(json)}`)
    }

    const accessToken: string = json.data.access_token
    const advertiserIds: string[] = json.data.advertiser_ids || []
    const scope = Array.isArray(json.data.scope)
      ? json.data.scope.join(',')
      : json.data.scope ?? null

    // One token row per advertiser (same access_token, different accountKey)
    const farFuture = new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000)
    for (const advertiserId of advertiserIds) {
      await prisma.tikTokToken.upsert({
        where: {
          flow_accountKey: { flow: 'advertiser', accountKey: advertiserId },
        },
        create: {
          flow: 'advertiser',
          accountKey: advertiserId,
          accessToken,
          expiresAt: farFuture,
          scope,
          rawGrant: json.data as unknown as object,
        },
        update: {
          accessToken,
          expiresAt: farFuture,
          scope,
          rawGrant: json.data as unknown as object,
        },
      })
    }

    const res = NextResponse.redirect(
      new URL(
        `/tiktok-organic?advertisers=${advertiserIds.join(',')}`,
        request.url,
      ),
    )
    res.cookies.delete('tt_adv_state')
    return res
  } catch (e) {
    console.error('[tiktok/auth/callback] error:', e)
    return NextResponse.redirect(
      new URL('/tiktok-organic?error=adv_exchange_failed', request.url),
    )
  }
}
