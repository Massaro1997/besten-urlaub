import { BetaAnalyticsDataClient } from '@google-analytics/data'

/**
 * GA4 Data API client. Credentials loaded from environment:
 *   GA4_SERVICE_ACCOUNT_JSON — full JSON string of service account key
 *   GA4_PROPERTY_ID          — numeric property ID (e.g. "458123456")
 */

let cached: BetaAnalyticsDataClient | null = null

function getClient(): BetaAnalyticsDataClient {
  if (cached) return cached
  const raw = process.env.GA4_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error('GA4_SERVICE_ACCOUNT_JSON not set')
  const creds = JSON.parse(raw)
  cached = new BetaAnalyticsDataClient({
    credentials: {
      client_email: creds.client_email,
      private_key: creds.private_key,
    },
  })
  return cached
}

function getPropertyId(): string {
  const id = process.env.GA4_PROPERTY_ID
  if (!id) throw new Error('GA4_PROPERTY_ID not set')
  return id
}

export interface GeoRow {
  country: string
  city: string
  users: number
  sessions: number
}

export async function fetchGeoBreakdown(days = 30): Promise<GeoRow[]> {
  const client = getClient()
  const [resp] = await client.runReport({
    property: `properties/${getPropertyId()}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'country' }, { name: 'city' }],
    metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 100,
  })
  return (resp.rows || []).map((r) => ({
    country: r.dimensionValues?.[0]?.value || 'Unknown',
    city: r.dimensionValues?.[1]?.value || 'Unknown',
    users: parseInt(r.metricValues?.[0]?.value || '0', 10),
    sessions: parseInt(r.metricValues?.[1]?.value || '0', 10),
  }))
}

export interface SourceRow {
  source: string
  medium: string
  users: number
  sessions: number
}

export async function fetchSourceBreakdown(days = 30): Promise<SourceRow[]> {
  const client = getClient()
  const [resp] = await client.runReport({
    property: `properties/${getPropertyId()}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
    metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 50,
  })
  return (resp.rows || []).map((r) => ({
    source: r.dimensionValues?.[0]?.value || '(direct)',
    medium: r.dimensionValues?.[1]?.value || '(none)',
    users: parseInt(r.metricValues?.[0]?.value || '0', 10),
    sessions: parseInt(r.metricValues?.[1]?.value || '0', 10),
  }))
}

export interface CountryTotal {
  country: string
  users: number
  sessions: number
}

export async function fetchCountryTotals(days = 30): Promise<CountryTotal[]> {
  const client = getClient()
  const [resp] = await client.runReport({
    property: `properties/${getPropertyId()}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 50,
  })
  return (resp.rows || []).map((r) => ({
    country: r.dimensionValues?.[0]?.value || 'Unknown',
    users: parseInt(r.metricValues?.[0]?.value || '0', 10),
    sessions: parseInt(r.metricValues?.[1]?.value || '0', 10),
  }))
}

export interface LanguageRow {
  language: string
  users: number
}

export async function fetchLanguageBreakdown(days = 30): Promise<LanguageRow[]> {
  const client = getClient()
  const [resp] = await client.runReport({
    property: `properties/${getPropertyId()}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'language' }],
    metrics: [{ name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 20,
  })
  return (resp.rows || []).map((r) => ({
    language: r.dimensionValues?.[0]?.value || 'unknown',
    users: parseInt(r.metricValues?.[0]?.value || '0', 10),
  }))
}
