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
