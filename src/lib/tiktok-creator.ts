import crypto from 'crypto'

/**
 * TikTok for Developers Creator API client.
 *
 * OAuth flow: v2 (client_key / client_secret / code + redirect_uri).
 * Endpoints used: token exchange, user info, video list, video query (insights).
 * Docs: https://developers.tiktok.com/doc/login-kit-web
 */

const TIKTOK_APP_ID = process.env.TIKTOK_APP_ID || ''
const TIKTOK_APP_SECRET = process.env.TIKTOK_APP_SECRET || ''
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bestenurlaub.com'

export const CREATOR_REDIRECT_URI = `${BASE_URL}/api/tiktok/creator/callback`
export const ADVERTISER_REDIRECT_URI = `${BASE_URL}/api/tiktok/auth/callback`

export const CREATOR_SCOPES = [
  'user.info.basic',
  'user.info.username',
  'user.info.stats',
  'user.info.profile',
  'user.account.type',
  'user.insights',
  'video.list',
  'video.insights',
  'comment.list',
  'comment.list.manage',
  'video.publish',
  'video.upload',
  'biz.brand.insights',
  'biz.creator.info',
  'biz.creator.insights',
  'biz.spark.auth',
  'biz.ads.recommend',
  'discovery.search.words',
  'tto.campaign.link',
].join(',')

export function buildCreatorAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_key: TIKTOK_APP_ID,
    scope: CREATOR_SCOPES,
    response_type: 'code',
    redirect_uri: CREATOR_REDIRECT_URI,
    state,
  })
  return `https://www.tiktok.com/v2/auth/authorize?${params.toString()}`
}

export function buildAdvertiserAuthUrl(state: string): string {
  const params = new URLSearchParams({
    app_id: TIKTOK_APP_ID,
    state,
    redirect_uri: ADVERTISER_REDIRECT_URI,
  })
  return `https://business-api.tiktok.com/portal/auth?${params.toString()}`
}

export function signState(): string {
  const nonce = crypto.randomBytes(16).toString('hex')
  return `${Date.now()}.${nonce}`
}

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number             // seconds
  refresh_expires_in?: number
  open_id?: string
  scope?: string
  token_type?: string
}

export async function exchangeCreatorCode(code: string): Promise<TokenResponse> {
  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    body: new URLSearchParams({
      client_key: TIKTOK_APP_ID,
      client_secret: TIKTOK_APP_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: CREATOR_REDIRECT_URI,
    }),
  })
  const text = await res.text()
  let json: Record<string, unknown> = {}
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(`TikTok token exchange non-JSON (${res.status}): ${text}`)
  }
  // v2 returns access_token at top level, OR nested under data, depending on region
  const accessToken = (json.access_token ?? (json.data as Record<string, unknown>)?.access_token) as string | undefined
  if (!res.ok || json.error || !accessToken) {
    throw new Error(`TikTok token exchange failed (${res.status}): ${text}`)
  }
  // Normalize to flat shape
  const flat = (json.access_token ? json : json.data) as unknown as TokenResponse
  return flat
}

export async function refreshCreatorToken(refreshToken: string): Promise<TokenResponse> {
  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: TIKTOK_APP_ID,
      client_secret: TIKTOK_APP_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  const json = await res.json()
  if (!res.ok || json.error) {
    throw new Error(`TikTok refresh failed: ${JSON.stringify(json)}`)
  }
  return json
}

interface UserInfo {
  open_id: string
  union_id?: string
  avatar_url?: string
  display_name?: string
  username?: string
  bio_description?: string
  follower_count?: number
  following_count?: number
  likes_count?: number
  video_count?: number
}

export async function fetchUserInfo(accessToken: string): Promise<UserInfo> {
  const fields = [
    'open_id',
    'union_id',
    'avatar_url',
    'display_name',
    'username',
    'bio_description',
    'follower_count',
    'following_count',
    'likes_count',
    'video_count',
  ].join(',')
  const res = await fetch(`https://open.tiktokapis.com/v2/user/info/?fields=${fields}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const json = await res.json()
  // v2 returns error: { code: "ok", ... } even on success — check for real error codes
  const errCode = json.error?.code
  const isError = errCode && errCode !== 'ok' && errCode !== 0 && errCode !== '0'
  if (!res.ok || isError || !json.data?.user) {
    throw new Error(`TikTok user info failed: ${JSON.stringify(json)}`)
  }
  return json.data.user
}

interface VideoRow {
  id: string
  title?: string
  video_description?: string
  duration?: number
  cover_image_url?: string
  embed_link?: string
  share_url?: string
  create_time?: number          // unix seconds
  view_count?: number
  like_count?: number
  comment_count?: number
  share_count?: number
  reach?: number
  avg_watch_time?: number
  completion_rate?: number
}

export async function fetchVideoList(accessToken: string, cursor = 0): Promise<{
  videos: VideoRow[]
  cursor: number
  has_more: boolean
}> {
  const fields = [
    'id',
    'title',
    'video_description',
    'duration',
    'cover_image_url',
    'embed_link',
    'share_url',
    'create_time',
    'view_count',
    'like_count',
    'comment_count',
    'share_count',
    'reach',
    'avg_watch_time',
    'completion_rate',
  ].join(',')
  const res = await fetch(
    `https://open.tiktokapis.com/v2/video/list/?fields=${fields}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cursor, max_count: 20 }),
    },
  )
  const json = await res.json()
  const errCode = json.error?.code
  const isError = errCode && errCode !== 'ok' && errCode !== 0 && errCode !== '0'
  if (!res.ok || isError) {
    throw new Error(`TikTok video list failed: ${JSON.stringify(json)}`)
  }
  return {
    videos: json.data?.videos ?? [],
    cursor: json.data?.cursor ?? 0,
    has_more: json.data?.has_more ?? false,
  }
}

export function computeEngagementRate(v: VideoRow): number | null {
  const views = v.view_count ?? 0
  if (views === 0) return null
  const engagements =
    (v.like_count ?? 0) + (v.comment_count ?? 0) + (v.share_count ?? 0)
  return engagements / views
}
