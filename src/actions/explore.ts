'use server'

import { revalidatePath } from 'next/cache'
import sanitizeHtml from 'sanitize-html'

import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
import { type ShareInput, shareSchema } from '@/types/explore'

// 서버 에러 공통 메시지
const UNEXPECTED_ERROR = '잠시 후 다시 시도해 주세요'

// 소개 게시글에 허용할 태그와 속성
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p',
    'div',
    'br',
    'span',
    'b',
    'strong',
    'i',
    'em',
    'u',
    's',
    'strike',
    'h2',
    'blockquote',
    'ul',
    'ol',
    'li',
    'img',
  ],
  allowedAttributes: { '*': ['style'], img: ['src', 'alt'] },
  allowedStyles: { '*': { 'text-align': [/^(left|right|center|justify)$/] } },
  allowedSchemesByTag: { img: ['https'] },
}

type ShareResult = { ok: true } | { ok: false; message: string }

export async function shareToCommunity(input: ShareInput): Promise<ShareResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    const parsed = shareSchema.safeParse(input)
    if (!parsed.success) {
      return { ok: false, message: '잘못된 데이터예요' }
    }
    const { pageId, category, allowRemix, communityImage, communityPost } = parsed.data

    await connectDB()

    // 소유권을 필터에 넣어 본인 페이지만 조회
    const page = await Page.findOne({ pageId, userId: session.user.id })
    if (!page) {
      return { ok: false, message: '권한이 없어요' }
    }
    if (page.sections.length === 0) {
      return { ok: false, message: '빈 페이지는 공유할 수 없어요' }
    }

    page.sharedToCommunity = true
    page.allowRemix = allowRemix
    page.category = category
    page.communityImage = communityImage
    page.communityPost = sanitizeHtml(communityPost, SANITIZE_OPTIONS)
    page.sharedAt = new Date()
    await page.save()

    revalidatePath('/explore')

    return { ok: true }
  } catch (error) {
    console.error('shareToCommunity failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}
