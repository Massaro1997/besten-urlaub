import { JWT } from 'google-auth-library'
import { readFileSync } from 'fs'
import path from 'path'

/**
 * Submit the sitemap to Google Search Console for sc-domain:besterurlaub.com
 * using the GA4 service account (must be added as a user of the GSC property).
 *
 * Reads GA4_SERVICE_ACCOUNT_JSON from .env.production.
 */

function loadServiceAccount() {
  if (process.env.GA4_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GA4_SERVICE_ACCOUNT_JSON)
  }
  // fallback: parse .env.production
  const envPath = path.join(__dirname, '..', '.env.production')
  const env = readFileSync(envPath, 'utf8')
  const m = env.match(/GA4_SERVICE_ACCOUNT_JSON=(.+)/)
  if (!m) throw new Error('GA4_SERVICE_ACCOUNT_JSON not found')
  let raw = m[1].trim()
  if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) {
    raw = raw.slice(1, -1)
  }
  return JSON.parse(raw)
}

const SITE = 'sc-domain:besterurlaub.com'
const SITEMAP = 'https://www.besterurlaub.com/sitemap.xml'

async function main() {
  const sa = loadServiceAccount()
  const client = new JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters'],
  })
  const { token } = await client.getAccessToken()
  if (!token) throw new Error('no access token')

  const base = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}`

  // 1) confirm we can see the property
  const siteRes = await fetch(base, { headers: { Authorization: `Bearer ${token}` } })
  console.log(`GET site → ${siteRes.status} ${siteRes.statusText}`)
  if (siteRes.status === 403) {
    console.error('\n403: il service account NON ha accesso alla property GSC.')
    console.error(`Aggiungi questo utente in Search Console > Einstellungen > Nutzer und Berechtigungen:`)
    console.error(`  ${sa.client_email}  (Rolle: Inhaber oder Vollständig)`)
    process.exit(2)
  }
  if (!siteRes.ok) {
    console.error('Body:', await siteRes.text())
    process.exit(1)
  }
  console.log('Property sichtbar:', await siteRes.text())

  // 2) submit sitemap (PUT)
  const smUrl = `${base}/sitemaps/${encodeURIComponent(SITEMAP)}`
  const putRes = await fetch(smUrl, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  console.log(`PUT sitemap → ${putRes.status} ${putRes.statusText}`)
  if (!putRes.ok && putRes.status !== 204) {
    console.error('Body:', await putRes.text())
    process.exit(1)
  }
  console.log('✓ Sitemap submitted:', SITEMAP)

  // 3) read back status
  const getRes = await fetch(smUrl, { headers: { Authorization: `Bearer ${token}` } })
  if (getRes.ok) {
    console.log('Sitemap status:', await getRes.text())
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
