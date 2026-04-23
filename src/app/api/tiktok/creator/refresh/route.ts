import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  computeEngagementRate,
  fetchUserInfo,
  fetchVideoList,
  refreshCreatorToken,
} from '@/lib/tiktok-creator'

/**
 * Sync TikTok Creator data for all connected accounts.
 *
 * Usage:
 *   - Manual: GET /api/tiktok/creator/refresh (admin only — guard before prod)
 *   - Cron: schedule daily via Vercel cron or external scheduler
 *
 * Does:
 *   1. For each TikTokToken(flow=creator), refresh access_token if <1h to expiry
 *   2. Fetch latest user info -> insert TikTokCreatorInsight row for today
 *   3. Fetch video list (paginated) -> upsert TikTokCreatorVideo rows
 */
export async function GET(_req: NextRequest) {
  const tokens = await prisma.tikTokToken.findMany({ where: { flow: 'creator' } })
  const results: Array<{ openId: string; videos: number; error?: string }> = []

  for (const token of tokens) {
    try {
      let accessToken = token.accessToken
      const msToExpiry = token.expiresAt.getTime() - Date.now()
      if (msToExpiry < 60 * 60 * 1000 && token.refreshToken) {
        const refreshed = await refreshCreatorToken(token.refreshToken)
        accessToken = refreshed.access_token
        await prisma.tikTokToken.update({
          where: { id: token.id },
          data: {
            accessToken: refreshed.access_token,
            refreshToken: refreshed.refresh_token ?? token.refreshToken,
            expiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
            rawGrant: refreshed as unknown as object,
          },
        })
      }

      // Profile snapshot
      const user = await fetchUserInfo(accessToken)
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      await prisma.tikTokCreatorInsight.upsert({
        where: { openId_date: { openId: token.accountKey, date: today } },
        create: {
          openId: token.accountKey,
          date: today,
          followerCount: user.follower_count ?? 0,
          followingCount: user.following_count ?? 0,
          likesCount: BigInt(user.likes_count ?? 0),
          videoCount: user.video_count ?? 0,
        },
        update: {
          followerCount: user.follower_count ?? 0,
          followingCount: user.following_count ?? 0,
          likesCount: BigInt(user.likes_count ?? 0),
          videoCount: user.video_count ?? 0,
        },
      })

      // Videos (paginate)
      let cursor = 0
      let total = 0
      let hasMore = true
      while (hasMore) {
        const page = await fetchVideoList(accessToken, cursor)
        for (const v of page.videos) {
          await prisma.tikTokCreatorVideo.upsert({
            where: { id: v.id },
            create: {
              id: v.id,
              openId: token.accountKey,
              title: v.title ?? null,
              description: v.video_description ?? null,
              coverUrl: v.cover_image_url ?? null,
              videoUrl: v.embed_link ?? null,
              shareUrl: v.share_url ?? null,
              duration: v.duration ?? null,
              createTime: new Date((v.create_time ?? 0) * 1000),
              viewCount: BigInt(v.view_count ?? 0),
              likeCount: BigInt(v.like_count ?? 0),
              commentCount: BigInt(v.comment_count ?? 0),
              shareCount: BigInt(v.share_count ?? 0),
              reach: v.reach != null ? BigInt(v.reach) : null,
              avgWatchTime: v.avg_watch_time ?? null,
              completionRate: v.completion_rate ?? null,
              engagementRate: computeEngagementRate(v),
            },
            update: {
              title: v.title ?? null,
              description: v.video_description ?? null,
              coverUrl: v.cover_image_url ?? null,
              videoUrl: v.embed_link ?? null,
              shareUrl: v.share_url ?? null,
              viewCount: BigInt(v.view_count ?? 0),
              likeCount: BigInt(v.like_count ?? 0),
              commentCount: BigInt(v.comment_count ?? 0),
              shareCount: BigInt(v.share_count ?? 0),
              reach: v.reach != null ? BigInt(v.reach) : null,
              avgWatchTime: v.avg_watch_time ?? null,
              completionRate: v.completion_rate ?? null,
              engagementRate: computeEngagementRate(v),
              lastRefreshedAt: new Date(),
            },
          })
          total++
        }
        cursor = page.cursor
        hasMore = page.has_more
      }

      results.push({ openId: token.accountKey, videos: total })
    } catch (e) {
      results.push({
        openId: token.accountKey,
        videos: 0,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  return NextResponse.json({ ok: true, results })
}
