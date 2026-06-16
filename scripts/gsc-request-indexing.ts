import { JWT } from 'google-auth-library'
import { readFileSync } from 'fs'
import path from 'path'

/**
 * Google Indexing API — request (re)indexing for a list of top URLs.
 * Uses the GA4 service account (must be added as Owner of the GSC property
 * AND the Indexing API must be enabled on the Google Cloud project).
 *
 * Quota: 200 requests/day per project (shared). We submit ~165 top URLs.
 */

function loadServiceAccount() {
  if (process.env.GA4_SERVICE_ACCOUNT_JSON) return JSON.parse(process.env.GA4_SERVICE_ACCOUNT_JSON)
  const env = readFileSync(path.join(__dirname, '..', '.env.production'), 'utf8')
  const m = env.match(/GA4_SERVICE_ACCOUNT_JSON=(.+)/)
  if (!m) throw new Error('GA4_SERVICE_ACCOUNT_JSON not found')
  let raw = m[1].trim()
  if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) raw = raw.slice(1, -1)
  return JSON.parse(raw)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const urls: string[] = JSON.parse(readFileSync('/tmp/index_urls.json', 'utf8'))
  const sa = loadServiceAccount()
  const client = new JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })
  const { token } = await client.getAccessToken()
  if (!token) throw new Error('no access token')

  const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish'
  let ok = 0, fail = 0, quota = 0
  const fails: { url: string; status: number; msg: string }[] = []

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, type: 'URL_UPDATED' }),
    })
    if (res.ok) {
      ok++
      process.stdout.write(`\r[${i + 1}/${urls.length}] OK:${ok} FAIL:${fail}  ${url.slice(0, 60)}        `)
    } else {
      const body = await res.text()
      if (res.status === 429) { quota++; }
      fail++
      fails.push({ url, status: res.status, msg: body.slice(0, 200) })
      if (res.status === 403 && fail <= 1) {
        console.error('\n403 — Indexing API nicht aktiviert oder SA kein Owner.')
        console.error(body.slice(0, 400))
      }
      if (res.status === 429) {
        console.error('\n429 — Tageskontingent (200/Tag) erreicht. Stoppe.')
        break
      }
    }
    await sleep(350) // rate-limit, stay well under per-minute caps
  }

  console.log(`\n\n=== Indexing-Anfragen ===`)
  console.log(`OK: ${ok}  FAIL: ${fail}  (quota-429: ${quota})`)
  if (fails.length) {
    const byStatus: Record<number, number> = {}
    for (const f of fails) byStatus[f.status] = (byStatus[f.status] || 0) + 1
    console.log('Fehler nach Status:', JSON.stringify(byStatus))
    console.log('Beispiel:', fails[0].url, fails[0].status, fails[0].msg)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
