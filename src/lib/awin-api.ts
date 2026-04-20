/**
 * Awin Publisher API client.
 *
 * Docs: https://wiki.awin.com/index.php/API
 * Auth: Bearer OAuth2 token (permanent per account).
 *
 * Env vars (set on Vercel + .env.local):
 *   AWIN_PUBLISHER_ID   — numeric publisher id (e.g. 2837966)
 *   AWIN_OAUTH_TOKEN    — OAuth2 long-lived token from Awin account settings
 */

const BASE = 'https://api.awin.com'

export interface AwinTransaction {
  id: number
  url?: string
  advertiserId: number
  commissionStatus: 'pending' | 'approved' | 'declined' | 'deleted'
  saleAmount: { amount: number; currency: string }
  commissionAmount: { amount: number; currency: string }
  clickRefs?: { clickRef?: string; clickRef2?: string; clickRef3?: string }
  clickDate?: string
  transactionDate?: string
  validationDate?: string | null
  type?: string
  declineReason?: string
  voucherCodeUsed?: boolean
  lapseTime?: number
  amended?: boolean
  amendReason?: string
  orderRef?: string
  customParameters?: { key: string; value: string }[]
  transactionParts?: { commissionGroupId: number; amount: number }[]
  paidToPublisher?: boolean
  paymentId?: number
  transactionQueryId?: number
  raw?: Record<string, unknown>
}

export interface AwinReportRow {
  advertiserId: number
  advertiserName: string
  publisherId: number
  region: string
  currency: string
  impressions: number
  clicks: number
  pendingNo: number
  pendingValue: number
  pendingComm: number
  confirmedNo: number
  confirmedValue: number
  confirmedComm: number
  bonusNo: number
  bonusValue: number
  bonusComm: number
  totalNo: number
  totalValue: number
  totalComm: number
  declinedNo: number
  declinedValue: number
  declinedComm: number
}

function auth() {
  const token = process.env.AWIN_OAUTH_TOKEN
  const pid = process.env.AWIN_PUBLISHER_ID
  if (!token || !pid) throw new Error('AWIN_OAUTH_TOKEN / AWIN_PUBLISHER_ID not set')
  return { token, pid }
}

async function call<T>(path: string): Promise<T> {
  const { token } = auth()
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Awin API ${res.status} ${path}: ${body.slice(0, 300)}`)
  }
  return (await res.json()) as T
}

/**
 * Transactions in a date range (max 31 days). Use ISO-8601 local time.
 * Dates are treated in the provided timezone by Awin.
 */
export async function fetchAwinTransactions(
  startISO: string,
  endISO: string,
  timezone = 'Europe/Berlin',
): Promise<AwinTransaction[]> {
  const { pid } = auth()
  const qs = new URLSearchParams()
  qs.set('startDate', startISO)
  qs.set('endDate', endISO)
  qs.set('timezone', timezone)
  return call<AwinTransaction[]>(`/publishers/${pid}/transactions/?${qs.toString()}`)
}

/**
 * Aggregated report by advertiser (clicks, impressions, commissions). Region
 * default DE (Germany).
 */
export async function fetchAwinAdvertiserReport(
  startDateYYYYMMDD: string,
  endDateYYYYMMDD: string,
  region = 'DE',
): Promise<AwinReportRow[]> {
  const { pid } = auth()
  const qs = new URLSearchParams()
  qs.set('startDate', startDateYYYYMMDD)
  qs.set('endDate', endDateYYYYMMDD)
  qs.set('region', region)
  return call<AwinReportRow[]>(`/publishers/${pid}/reports/advertiser?${qs.toString()}`)
}
