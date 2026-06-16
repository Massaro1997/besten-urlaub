import { NextRequest, NextResponse } from 'next/server'

const PIN = process.env.DASHBOARD_PIN || '0940'

export async function POST(req: NextRequest) {
  let body: { pin?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  if (body.pin !== PIN) {
    return NextResponse.json({ error: 'invalid_pin' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('bu_auth', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}
