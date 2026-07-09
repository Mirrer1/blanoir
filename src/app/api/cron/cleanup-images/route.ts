import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { cleanupOrphanImages } from '@/lib/imageCleanup'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// CRON_SECRET으로 Authorization 헤더 검증
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const dryRun = process.env.IMAGE_CLEANUP_DRY_RUN === 'true'
  const summary = await cleanupOrphanImages(dryRun)

  return NextResponse.json({ ok: true, ...summary })
}
