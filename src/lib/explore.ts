import { Types } from 'mongoose'
import { cache } from 'react'

import { connectDB } from '@/lib/mongoDB'
import Comment from '@/models/Comment'
import Page from '@/models/Page'
import User from '@/models/User'
import type {
  ExploreCategory,
  ExploreCategoryKey,
  ExploreCommentThread,
  ExploreCommentView,
  ExplorePost,
} from '@/types/explore'
import type { Section } from '@/types/section'
import { firstImageUrl } from '@/utils/pageMeta'

type SharedLean = {
  pageId: string
  title: string
  category?: ExploreCategory
  communityImage: string
  communityPost: string
  sections: Section[]
  viewCount?: number
  useCount: number
  commentCount?: number
  allowRemix: boolean
  userId: { _id: Types.ObjectId; name: string; handle: string; profileImage: string } | null
}

// 목록 카드용 타입으로 소개글 본문 communityPost는 제외
type SharedCardLean = Omit<SharedLean, 'communityPost'>

const AUTHOR_FIELDS = 'name handle profileImage'
const POPULAR_LIMIT = 30

export const EXPLORE_PAGE_SIZE = 12

export type ExploreSort = 'popular' | 'recent'

export interface SharedQuery {
  skip?: number
  limit?: number
  category?: ExploreCategoryKey
  sort?: ExploreSort
  q?: string
}

export interface SharedPage {
  posts: ExplorePost[]
  hasMore: boolean
}

// 탈퇴 등으로 작성자 없는 페이지는 제외
const toPost = (page: SharedCardLean): ExplorePost | null => {
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
    commentCount: page.commentCount ?? 0,
    allowRemix: page.allowRemix,
  }
}

// 정규식 특수문자 이스케이프
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// 필터와 정렬을 서버에서 적용해 한 페이지씩 조회
export async function getSharedPage(query: SharedQuery = {}): Promise<SharedPage> {
  await connectDB()
  const skip = Math.max(0, Math.floor(query.skip ?? 0))
  const limit = Math.max(1, Math.floor(query.limit ?? EXPLORE_PAGE_SIZE))
  const sort: ExploreSort = query.sort === 'recent' ? 'recent' : 'popular'
  const keyword = (query.q ?? '').trim()

  const match: Record<string, unknown> = { sharedToCommunity: true }
  if (query.category && query.category !== 'all') {
    match.category = query.category
  }
  if (keyword) {
    match.title = { $regex: escapeRegex(keyword), $options: 'i' }
  }

  // 인기순은 활동 합산 점수로 정렬하고 _id로 순서 고정
  const sortStage: Record<string, 1 | -1> =
    sort === 'popular' ? { score: -1, sharedAt: -1, _id: -1 } : { sharedAt: -1, _id: -1 }

  const docs = await Page.aggregate<SharedCardLean>([
    { $match: match },
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'author' } },
    { $unwind: '$author' }, // 탈퇴한 작성자 페이지 제외
    {
      $addFields: {
        score: {
          $add: [
            { $ifNull: ['$viewCount', 0] },
            { $ifNull: ['$useCount', 0] },
            { $ifNull: ['$commentCount', 0] },
          ],
        },
      },
    },
    { $sort: sortStage },
    { $skip: skip },
    { $limit: limit + 1 }, // 다음 페이지 존재 판별용 여분 하나
    {
      $project: {
        _id: 0,
        pageId: 1,
        title: 1,
        category: 1,
        communityImage: 1,
        sections: 1,
        viewCount: 1,
        useCount: 1,
        commentCount: 1,
        allowRemix: 1,
        userId: {
          _id: '$author._id',
          name: '$author.name',
          handle: '$author.handle',
          profileImage: '$author.profileImage',
        },
      },
    },
  ])

  const hasMore = docs.length > limit
  const posts = docs
    .slice(0, limit)
    .map(toPost)
    .filter((post): post is ExplorePost => post !== null)
  return { posts, hasMore }
}

export interface SharedDetail {
  post: ExplorePost
  authorId: string
  communityPost: string
  sections: Section[]
  others: ExplorePost[]
  popular: ExplorePost[]
}

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

type CommentLean = {
  _id: Types.ObjectId
  parentId: Types.ObjectId | null
  text: string
  deleted: boolean
  createdAt: Date
  userId: { _id: Types.ObjectId; name: string; profileImage: string } | null
}

export async function getComments(
  pageId: string,
  authorId: string,
  viewerId?: string,
): Promise<ExploreCommentThread[]> {
  await connectDB()
  const docs = await Comment.find({ pageId })
    .sort({ createdAt: 1 })
    .populate('userId', 'name profileImage')
    .lean<CommentLean[]>()

  // tombstone은 본문과 작성자를 감추고 삭제 표시만 표시
  const toView = (doc: CommentLean): ExploreCommentView => {
    if (doc.deleted) {
      return {
        id: String(doc._id),
        authorName: '',
        authorImage: '',
        text: '',
        createdAt: doc.createdAt.toISOString(),
        isAuthor: false,
        isMine: false,
        deleted: true,
      }
    }
    return {
      id: String(doc._id),
      authorName: doc.userId?.name ?? '',
      authorImage: doc.userId?.profileImage ?? '',
      text: doc.text,
      createdAt: doc.createdAt.toISOString(),
      isAuthor: doc.userId ? String(doc.userId._id) === authorId : false,
      isMine: doc.userId ? String(doc.userId._id) === viewerId : false,
      deleted: false,
    }
  }

  // 대댓글을 부모 댓글별로 묶기
  const replies = new Map<string, ExploreCommentView[]>()
  for (const doc of docs) {
    if (doc.parentId) {
      const key = String(doc.parentId)
      const list = replies.get(key) ?? []
      list.push(toView(doc))
      replies.set(key, list)
    }
  }
  return docs
    .filter((doc) => !doc.parentId)
    .map((doc) => ({ ...toView(doc), replies: replies.get(String(doc._id)) ?? [] }))
    .filter((thread) => !thread.deleted || thread.replies.length > 0)
}

// 낙관적 렌더용 유저 이름과 이미지 조회
export async function getCommentViewer(
  userId: string,
): Promise<{ name: string; image: string } | null> {
  await connectDB()
  const user = await User.findById(userId)
    .select('name profileImage')
    .lean<{ name: string; profileImage: string } | null>()
  return user ? { name: user.name, image: user.profileImage } : null
}
