const TIKTOK_PIXEL_IDS = ['D74IPBRC77U2583OHQB0', 'D74KVVJC77U2583OHT0G']
const TIKTOK_ACCESS_TOKEN = '2257b1d36d6fb21b6d3d9717621342c223e84918'
const TIKTOK_EVENTS_API = 'https://business-api.tiktok.com/open_api/v1.3/event/track/'

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
}

export async function sendTikTokEvent(params: TikTokEventParams) {
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

    const context: Record<string, unknown> = {
      page: { url: params.url },
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

    // Send to all pixel IDs
    await Promise.all(
      TIKTOK_PIXEL_IDS.map(async (pixelId) => {
        const body = {
          event_source: 'web',
          event_source_id: pixelId,
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
          console.error(`TikTok Events API error (${pixelId}):`, result)
        }
      }),
    )
  } catch (error) {
    console.error('TikTok Events API failed:', error)
  }
}
