import crypto from 'crypto'

/**
 * TikTok Events API server-side integration.
 *
 * Credentials are loaded from environment variables — never commit tokens
 * to the repo. Expected env vars (set in .env.local and Vercel):
 *
 *   TIKTOK_PIXEL_ID     — e.g. D74KVVJC77U2583OHT0G
 *   TIKTOK_ACCESS_TOKEN — server-side access token from Events Manager
 */

const TIKTOK_PIXEL_ID = process.env.TIKTOK_PIXEL_ID || ''
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN || ''
const TIKTOK_EVENTS_API = 'https://business-api.tiktok.com/open_api/v1.3/event/track/'

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

interface TikTokEventParams {
  event: string
  eventId: string
  url: string
  contentId?: string
  contentName?: string
  value?: number
  currency?: string
  ip?: string
  userAgent?: string
  externalId?: string
  ttclid?: string
}

export async function sendTikTokEvent(params: TikTokEventParams) {
  if (!TIKTOK_PIXEL_ID || !TIKTOK_ACCESS_TOKEN) {
    console.warn('TikTok Events API: missing TIKTOK_PIXEL_ID or TIKTOK_ACCESS_TOKEN')
    return
  }

  try {
    const properties: Record<string, unknown> = {}
    if (params.contentId) {
      properties.contents = [
        {
          content_id: params.contentId,
          content_type: 'product',
          content_name: params.contentName || '',
        },
      ]
    }
    if (params.value) properties.value = params.value
    if (params.currency) properties.currency = params.currency

    const user: Record<string, string> = {}
    if (params.externalId) user.external_id = sha256(params.externalId)
    if (params.ttclid) user.ttclid = params.ttclid

    const context: Record<string, unknown> = {
      page: { url: params.url },
      user,
    }
    if (params.ip) context.ip = params.ip
    if (params.userAgent) context.user_agent = params.userAgent

    const eventData = {
      event: params.event,
      event_id: params.eventId,
      event_time: Math.floor(Date.now() / 1000),
      context,
      properties,
    }

    const body = {
      event_source: 'web',
      event_source_id: TIKTOK_PIXEL_ID,
      data: [eventData],
    }

    const res = await fetch(TIKTOK_EVENTS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': TIKTOK_ACCESS_TOKEN,
      },
      body: JSON.stringify(body),
    })
    const result = await res.json()
    if (result.code !== 0) {
      console.error(`TikTok Events API error (${TIKTOK_PIXEL_ID}):`, result)
    }
  } catch (error) {
    console.error('TikTok Events API failed:', error)
  }
}
