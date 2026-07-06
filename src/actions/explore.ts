'use server'

import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import sanitizeHtml from 'sanitize-html'

import { auth } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'
import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
import { type ShareInput, shareSchema } from '@/types/explore'
import type { Section } from '@/types/section'
import { makeCopyTitle } from '@/utils/copyTitle'
import { sectionImageUrls } from '@/utils/imageUrls'
import { cloneSections, remapImageUrls } from '@/utils/sectionClone'

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

// 공유 페이지 이미지를 리믹스하는 사용자 폴더로 복사
async function copyImagesInto(urls: string[], userId: string): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  await Promise.all(
    urls.map(async (url) => {
      try {
        const result = await cloudinary.uploader.upload(url, {
          folder: `blanoir/${userId}`,
          resource_type: 'image',
        })
        map.set(url, result.secure_url)
      } catch (error) {
        console.error('remix image copy failed', error)
      }
    }),
  )
  return map
}

type RemixResult = { ok: true; pageId: string } | { ok: false; message: string }

export async function remixPage(pageId: string): Promise<RemixResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    await connectDB()

    // 템플릿 사용을 허용한 공유 페이지만 조회
    const source = await Page.findOne({ pageId, sharedToCommunity: true }).lean<{
      title: string
      sections: Section[]
      allowRemix: boolean
    } | null>()
    if (!source || !source.allowRemix) {
      return { ok: false, message: '템플릿으로 사용할 수 없는 페이지예요' }
    }

    const sections = cloneSections(source.sections)

    // 원작자 이미지를 내 폴더로 복사해 원본과 독립
    const urls = [...new Set(sections.flatMap(sectionImageUrls))]
    if (urls.length > 0) {
      remapImageUrls(sections, await copyImagesInto(urls, session.user.id))
    }

    // 내 페이지 제목과 겹치지 않게 복사본 표기를 붙임
    const titles = await Page.find({ userId: session.user.id })
      .select('title')
      .lean<{ title: string }[]>()
    const title = makeCopyTitle(source.title, new Set(titles.map((page) => page.title)))

    const newPageId = nanoid(10)
    await Page.create({
      pageId: newPageId,
      userId: session.user.id,
      title,
      sections,
      isPublic: false,
    })
    await Page.updateOne({ pageId, sharedToCommunity: true }, { $inc: { useCount: 1 } })

    revalidatePath('/dashboard')
    revalidatePath('/explore')

    return { ok: true, pageId: newPageId }
  } catch (error) {
    console.error('remixPage failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}
