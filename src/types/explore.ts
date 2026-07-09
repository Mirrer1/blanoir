import { z } from 'zod'

// 둘러보기 카테고리 키
export const CATEGORY_KEYS = [
  'profile',
  'portfolio',
  'store',
  'wedding',
  'resume',
  'event',
] as const

export type ExploreCategory = (typeof CATEGORY_KEYS)[number]
export type ExploreCategoryKey = ExploreCategory | 'all'

export const CATEGORIES: { key: ExploreCategory; label: string }[] = [
  { key: 'profile', label: '프로필' },
  { key: 'portfolio', label: '포트폴리오' },
  { key: 'store', label: '매장' },
  { key: 'wedding', label: '청첩장' },
  { key: 'resume', label: '이력서' },
  { key: 'event', label: '이벤트' },
]

export interface ExplorePost {
  pageId: string
  title: string
  category?: ExploreCategory
  authorName: string
  authorHandle: string
  authorImage: string
  thumbnail: string
  viewCount: number
  useCount: number
  commentCount?: number
  allowRemix: boolean
}

export const shareSchema = z.object({
  pageId: z.string().min(1),
  // 빈 문자열은 미선택으로 간주
  category: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.enum(CATEGORY_KEYS).optional(),
  ),
  allowRemix: z.boolean(),
  communityImage: z.string(),
  communityPost: z.string(), // HTML
})

export type ShareInput = z.input<typeof shareSchema>

export interface ExploreCommentView {
  id: string
  authorName: string
  authorImage: string
  text: string
  createdAt: string
  isAuthor: boolean
  isMine: boolean
  deleted: boolean
}

export interface ExploreCommentThread extends ExploreCommentView {
  replies: ExploreCommentView[]
}

export interface CommentView extends ExploreCommentView {
  createdLabel: string
}

export interface CommentThreadView extends CommentView {
  replies: CommentView[]
}

export interface CommentViewer {
  name: string
  image: string
  isPageAuthor: boolean
}

export type CommentOptimisticAction =
  | { type: 'add'; thread: CommentThreadView }
  | { type: 'addReply'; parentId: string; reply: CommentView }
  | { type: 'edit'; id: string; text: string }
  | { type: 'delete'; id: string }
  | { type: 'tombstone'; id: string }
  | { type: 'deleteReply'; parentId: string; replyId: string }

export type AddOptimisticComment = (action: CommentOptimisticAction) => void

export const commentSchema = z.object({
  pageId: z.string().min(1),
  text: z.string().trim().min(1).max(1000),
  parentId: z.string().optional(), // 대댓글이면 최상위 댓글 id
})

export type CommentInput = z.input<typeof commentSchema>

export const commentEditSchema = z.object({
  commentId: z.string().min(1),
  text: z.string().trim().min(1).max(1000),
})

export type CommentEditInput = z.input<typeof commentEditSchema>
