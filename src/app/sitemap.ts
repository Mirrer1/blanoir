import type { Types } from 'mongoose'
import type { MetadataRoute } from 'next'

import { connectDB } from '@/lib/mongoDB'
import { SITE_URL } from '@/lib/site'
import Page from '@/models/Page'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  await connectDB()

  const pages = await Page.find({ isPublic: true })
    .select('pageId userId updatedAt')
    .lean<{ pageId: string; userId: Types.ObjectId; updatedAt: Date }[]>()

  const userIds = [...new Set(pages.map((p) => p.userId.toString()))]
  const users = await User.find({ _id: { $in: userIds } })
    .select('_id handle')
    .lean<{ _id: Types.ObjectId; handle: string }[]>()
  const handleById = new Map(users.map((u) => [u._id.toString(), u.handle]))

  const pageRoutes = pages.flatMap((p) => {
    const handle = handleById.get(p.userId.toString())
    return handle
      ? [
          {
            url: `${SITE_URL}/user/${handle}/${p.pageId}`,
            lastModified: p.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          },
        ]
      : []
  })

  return [{ url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 }, ...pageRoutes]
}

export default sitemap
