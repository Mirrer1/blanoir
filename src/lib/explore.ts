import { Types } from 'mongoose'
import { cache } from 'react'

import { connectDB } from '@/lib/mongoDB'
import Comment from '@/models/Comment'
import Page from '@/models/Page'
import User from '@/models/User'
import type {
  ExploreCategory,
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

const AUTHOR_FIELDS = 'name handle profileImage'
const POPULAR_LIMIT = 30

// 탈퇴 등으로 작성자 없는 페이지는 제외
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
    commentCount: page.commentCount ?? 0,
    allowRemix: page.allowRemix,
  }
}

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

  // 대댓글을 부모별로 묶음
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
