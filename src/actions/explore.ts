'use server'

import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import sanitizeHtml from 'sanitize-html'

import { deleteImage } from '@/actions/upload'
import { auth } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'
import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
import { type ShareInput, shareSchema } from '@/types/explore'
import type { Section } from '@/types/section'
import { makeCopyTitle } from '@/utils/copyTitle'
import { communityImageUrls, sectionImageUrls } from '@/utils/imageUrls'
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
    if (page.remixedFrom) {
      return { ok: false, message: '가져온 템플릿은 공유할 수 없어요' }
    }

    // 재공유 교체 이미지 판별
    const previousUrls = communityImageUrls(page)

    page.sharedToCommunity = true
    page.allowRemix = allowRemix
    page.category = category
    page.communityImage = communityImage
    page.communityPost = sanitizeHtml(communityPost, SANITIZE_OPTIONS)
    page.sharedAt = new Date()
    await page.save()

    // 페이지 본문 사용 이미지는 보존
    const sectionUrls = new Set((page.sections as Section[]).flatMap(sectionImageUrls))
    const nextUrls = new Set(communityImageUrls(page))
    const staleUrls = previousUrls.filter((url) => !nextUrls.has(url) && !sectionUrls.has(url))
    await Promise.all(staleUrls.map((url) => deleteImage(url)))

    revalidatePath('/explore')

    return { ok: true }
  } catch (error) {
    console.error('shareToCommunity failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}

type UnshareResult = { ok: true } | { ok: false; message: string }

export async function unshareFromCommunity(pageId: string): Promise<UnshareResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    await connectDB()

    // 소유권을 필터에 추가해 본인 페이지만 조회
    const page = await Page.findOne({ pageId, userId: session.user.id })
      .select('communityImage communityPost sections')
      .lean<{ communityImage?: string; communityPost?: string; sections: Section[] } | null>()
    if (!page) {
      return { ok: false, message: '권한이 없어요' }
    }

    // 페이지 본문에서 여전히 쓰는 이미지는 보존
    const sectionUrls = new Set(page.sections.flatMap(sectionImageUrls))
    const deletableUrls = communityImageUrls(page).filter((url) => !sectionUrls.has(url))
    await Promise.all(deletableUrls.map((url) => deleteImage(url)))

    await Page.updateOne(
      { pageId, userId: session.user.id },
      {
        $set: {
          sharedToCommunity: false,
          communityImage: '',
          communityPost: '',
          allowRemix: false,
        },
        $unset: { category: '', sharedAt: '' },
      },
    )

    revalidatePath('/explore')
    revalidatePath('/dashboard')

    return { ok: true }
  } catch (error) {
    console.error('unshareFromCommunity failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}

// 6시간 간격으로 같은 방문자 중복 조회 방지
const VIEW_TTL_MS = 6 * 60 * 60 * 1000
const VIEW_COOKIE = 'bl_views'

// 브라우저가 최근 본 페이지와 시간
type ViewMap = Record<string, number>

function parseViewCookie(raw: string | undefined): ViewMap {
  if (!raw) {
    return {}
  }
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as ViewMap) : {}
  } catch {
    return {}
  }
}

type RecordViewResult = { counted: boolean; viewCount: number }

// 상세 진입 시 클라이언트가 호출해 조회수 증가
export async function recordView(pageId: string): Promise<RecordViewResult> {
  try {
    const store = await cookies()
    const now = Date.now()
    const views = parseViewCookie(store.get(VIEW_COOKIE)?.value)

    // TTL 안의 재방문은 카운트에서 제외
    const last = views[pageId]
    if (last && now - last < VIEW_TTL_MS) {
      return { counted: false, viewCount: 0 }
    }

    await connectDB()
    const updated = await Page.findOneAndUpdate(
      { pageId, sharedToCommunity: true },
      { $inc: { viewCount: 1 } },
      { new: true },
    ).lean<{ viewCount: number } | null>()
    if (!updated) {
      return { counted: false, viewCount: 0 }
    }

    const next: ViewMap = { [pageId]: now }
    for (const [id, at] of Object.entries(views)) {
      if (id !== pageId && now - at < VIEW_TTL_MS) {
        next[id] = at
      }
    }
    store.set(VIEW_COOKIE, JSON.stringify(next), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: VIEW_TTL_MS / 1000,
      path: '/',
    })

    // 목록 카드 조회수도 다음 진입 때 최신값 반영
    revalidatePath('/explore')

    return { counted: true, viewCount: updated.viewCount }
  } catch (error) {
    console.error('recordView failed', error)
    return { counted: false, viewCount: 0 }
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

    // 페이지 제목 중복 방지
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
      remixedFrom: pageId,
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
