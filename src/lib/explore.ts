import { Types } from 'mongoose'
import { cache } from 'react'

import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
import type { ExploreCategory, ExplorePost } from '@/types/explore'
import type { Section } from '@/types/section'
import { firstImageUrl } from '@/utils/pageMeta'

// 작성자를 채운 공유 페이지 조회 결과
type SharedLean = {
  pageId: string
  title: string
  category?: ExploreCategory
  communityImage: string
  communityPost: string
  sections: Section[]
  viewCount?: number
  useCount: number
  allowRemix: boolean
  userId: { _id: Types.ObjectId; name: string; handle: string; profileImage: string } | null
}

const AUTHOR_FIELDS = 'name handle profileImage'
const POPULAR_LIMIT = 30

// 작성자가 있는 페이지만 카드 뷰 모델로 변환
const toPost = (page: SharedLean): ExplorePost | null => {
  if (!page.userId) {
    return null
  }
  return {
    pageId: page.pageId,
    title: page.title,
    category: page.category,
    authorName: page.userId.name,
    authorHandle: page.userId.handle,
    authorImage: page.userId.profileImage,
    thumbnail: page.communityImage || firstImageUrl(page.sections),
    viewCount: page.viewCount ?? 0,
    useCount: page.useCount,
    allowRemix: page.allowRemix,
  }
}

// 목록에 쓰는 공유 페이지 전체
export async function getSharedPosts(): Promise<ExplorePost[]> {
  await connectDB()
  const pages = await Page.find({ sharedToCommunity: true })
    .sort({ sharedAt: -1 })
    .populate('userId', AUTHOR_FIELDS)
    .lean<SharedLean[]>()
  return pages.map(toPost).filter((post): post is ExplorePost => post !== null)
}

export interface SharedDetail {
  post: ExplorePost
  authorId: string
  communityPost: string
  sections: Section[]
  others: ExplorePost[]
  popular: ExplorePost[]
}

// 상세에 사용되는 컨텐츠 전체
export const getSharedDetail = cache(async (pageId: string): Promise<SharedDetail | null> => {
  await connectDB()
  const page = await Page.findOne({ pageId, sharedToCommunity: true })
    .populate('userId', AUTHOR_FIELDS)
    .lean<SharedLean | null>()
  const post = page && toPost(page)
  if (!page || !post) {
    return null
  }

  const [otherDocs, popularDocs] = await Promise.all([
    Page.find({ sharedToCommunity: true, userId: page.userId!._id, pageId: { $ne: pageId } })
      .sort({ sharedAt: -1 })
      .populate('userId', AUTHOR_FIELDS)
      .lean<SharedLean[]>(),
    Page.find({ sharedToCommunity: true, pageId: { $ne: pageId } })
      .sort({ viewCount: -1 })
      .limit(POPULAR_LIMIT)
      .populate('userId', AUTHOR_FIELDS)
      .lean<SharedLean[]>(),
  ])

  const filterPosts = (docs: SharedLean[]) =>
    docs.map(toPost).filter((item): item is ExplorePost => item !== null)

  return {
    post,
    authorId: String(page.userId!._id),
    communityPost: page.communityPost,
    sections: page.sections,
    others: filterPosts(otherDocs),
    popular: filterPosts(popularDocs),
  }
})
