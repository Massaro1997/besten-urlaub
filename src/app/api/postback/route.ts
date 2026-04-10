import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTikTokEvent } from '@/lib/tiktok-server'

/**
 * Check24 S2S Postback endpoint.
 *
 * When a user completes a booking on Check24, their system calls this
 * endpoint with the subid (our eventId) and conversion details. We then:
 *
 *   1. Mark the AffiliateClick row as converted
 *   2. Fire CompletePayment on TikTok Events API (server-side)
 *
 * This is the ONLY place CompletePayment fires — it represents a real
 * booking, not just a click. TikTok then optimizes for actual conversions.
 *
 * Check24 postback URL (configure in Check24 partner portal):
 *   https://www.bestenurlaub.com/api/postback?subid={subid}&revenue={revenue}&currency={currency}
 *
 * Also supports GET for compatibility with Check24's postback format.
 */

async function handlePostback(request: NextRequest) {
  const params = request.nextUrl.searchParams

  // Check24 sends the subid we attached to the affiliate link
  const subid = params.get('subid') || params.get('sub_id') || params.get('deepId') || ''
  const revenue = parseFloat(params.get('revenue') || params.get('amount') || '0')
  const currency = params.get('currency') || 'EUR'

  // Optional: secret token to prevent fake postbacks
  const token = params.get('token') || ''
  const expectedToken = process.env.POSTBACK_SECRET || ''
  if (expectedToken && token !== expectedToken) {
    console.warn('Postback: invalid token', { subid, token })
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
  }

  if (!subid) {
    return NextResponse.json({ error: 'Missing subid' }, { status: 400 })
  }

  try {
    // 1. Find the original click by eventId (= subid)
    const click = await prisma.affiliateClick.findUnique({
      where: { eventId: subid },
    })

    if (!click) {
      console.warn('Postback: no matching click for subid', subid)
      // Still return 200 so Check24 doesn't retry endlessly
      return NextResponse.json({ ok: true, matched: false })
    }

    // 2. Mark as converted
    await prisma.affiliateClick.update({
      where: { eventId: subid },
      data: {
        converted: true,
        convValue: revenue || null,
        convAt: new Date(),
      },
    })

    // 3. Fire CompletePayment on TikTok Events API
    //    This is the real conversion signal — TikTok will optimize for this.
    await sendTikTokEvent({
      event: 'CompletePayment',
      eventId: `${subid}-cp`,
      url: click.landingUrl || `https://www.bestenurlaub.com/angebot/${click.offerId || 'unknown'}`,
      contentId: click.offerId || undefined,
      value: revenue || undefined,
      currency,
      externalId: click.externalId || undefined,
      ttclid: click.ttclid || undefined,
      ip: undefined, // not available in postback
      userAgent: click.userAgent || undefined,
    })

    console.log('Postback: conversion recorded', {
      subid,
      offerId: click.offerId,
      revenue,
    })

    return NextResponse.json({ ok: true, matched: true })
  } catch (error) {
    console.error('Postback error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

// Support both GET and POST — Check24 typically uses GET for postbacks
export async function GET(request: NextRequest) {
  return handlePostback(request)
}

export async function POST(request: NextRequest) {
  return handlePostback(request)
}
