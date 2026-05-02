import { NextRequest, NextResponse } from 'next/server'

/**
 * TikTok OAuth Bridge → Orchestra.
 *
 * Acts as a transparent forwarder: TikTok redirects here with `code` + `state`,
 * and we forward those params to Orchestra at /tiktok/oauth/exchange so it can
 * exchange the code for an access token without requiring its own redirect URI
 * registered on the TikTok app.
 *
 * Usage: configure TikTok OAuth redirect_uri = https://www.besterurlaub.com/api/tiktok/bridge
 *        and pass `state` containing target workspace_slug encoded by Orchestra.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const code = params.get('code')
  const state = params.get('state')
  const error = params.get('error')

  const orchestraBase = 'https://orchestra-api.slywebsite.de'

  if (error) {
    return NextResponse.redirect(
      `${orchestraBase}/tiktok/oauth/exchange?error=${encodeURIComponent(error)}`,
    )
  }
  if (!code || !state) {
    return NextResponse.redirect(
      `${orchestraBase}/tiktok/oauth/exchange?error=missing_code_or_state`,
    )
  }

  const url = `${orchestraBase}/tiktok/oauth/exchange?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
  return NextResponse.redirect(url)
}
