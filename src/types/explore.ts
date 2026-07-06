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

// 둘러보기 목록 카드에 쓰는 뷰 모델
export interface ExplorePost {
  pageId: string
  title: string
  category?: ExploreCategory
  authorName: string
  authorHandle: string
  authorImage: string
  thumbnail: string
  likeCount: number
  useCount: number
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
  communityImage: z.string(), // 대표 이미지 URL
  communityPost: z.string(), // 소개 게시글 HTML
})

export type ShareInput = z.input<typeof shareSchema>
