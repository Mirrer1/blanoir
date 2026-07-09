'use server'

import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

import { copyImages, deleteImage } from './upload'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
import type { Section } from '@/types/section'
import { makeCopyTitle } from '@/utils/copyTitle'
import { communityImageUrls, sectionImageUrls } from '@/utils/imageUrls'
import { cloneSections, remapImageUrls } from '@/utils/sectionClone'

// 서버 에러 공통 메시지
const UNEXPECTED_ERROR = '잠시 후 다시 시도해 주세요'

type DuplicateResult = { ok: true; pageId: string } | { ok: false; message: string }

export async function duplicatePage(pageId: string): Promise<DuplicateResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    await connectDB()

    // 소유권을 필터에 넣어 본인 페이지만 복제
    const source = await Page.findOne({ pageId, userId: session.user.id }).lean<{
      title: string
      sections: Section[]
    } | null>()
    if (!source) {
      return { ok: false, message: '권한이 없어요' }
    }

    const sections = cloneSections(source.sections)

    // 페이지 이미지를 병렬 복사해 원본과 독립
    const urls = [...new Set(sections.flatMap(sectionImageUrls))]
    if (urls.length > 0) {
      const copied = await copyImages(urls)
      remapImageUrls(sections, new Map(copied.map((item) => [item.from, item.to])))
    }

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

    revalidatePath('/dashboard')

    return { ok: true, pageId: newPageId }
  } catch (error) {
    console.error('duplicatePage failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}

type CreatePageResult = { ok: true; pageId: string } | { ok: false; message: string }

export async function createPage(): Promise<CreatePageResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    await connectDB()

    const pageId = nanoid(10)
    await Page.create({ pageId, userId: session.user.id, title: '', sections: [], isPublic: false })

    revalidatePath('/dashboard')

    return { ok: true, pageId }
  } catch (error) {
    console.error('createPage failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}

type SaveResult = { ok: true } | { ok: false; message: string }

export async function savePage(
  pageId: string,
  data: { title: string; sections: unknown[] },
): Promise<SaveResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    if (typeof data.title !== 'string' || !Array.isArray(data.sections)) {
      return { ok: false, message: '잘못된 데이터예요' }
    }

    await connectDB()

    // 소유권을 필터에 넣어 본인 페이지만 갱신
    const result = await Page.updateOne(
      { pageId, userId: session.user.id },
      { $set: { title: data.title, sections: data.sections } },
    )
    if (result.matchedCount === 0) {
      return { ok: false, message: '권한이 없어요' }
    }

    return { ok: true }
  } catch (error) {
    console.error('savePage failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}

type DeleteResult = { ok: true } | { ok: false; message: string }

export async function deletePage(pageId: string): Promise<DeleteResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    await connectDB()

    // 소유권을 필터에 넣어 본인 페이지만 삭제
    const page = await Page.findOneAndDelete({ pageId, userId: session.user.id }).lean<{
      sections: Section[]
      communityImage?: string
      communityPost?: string
    } | null>()
    if (!page) {
      return { ok: false, message: '권한이 없어요' }
    }

    // 페이지에 쓰인 섹션과 둘러보기 이미지 정리
    const urls = new Set([...page.sections.flatMap(sectionImageUrls), ...communityImageUrls(page)])
    await Promise.all([...urls].map((url) => deleteImage(url)))

    revalidatePath('/dashboard')

    return { ok: true }
  } catch (error) {
    console.error('deletePage failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}

type TogglePublicResult = { ok: true; isPublic: boolean } | { ok: false; message: string }

export async function togglePagePublic(
  pageId: string,
  isPublic: boolean,
): Promise<TogglePublicResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    await connectDB()

    // 소유권을 필터에 넣어 본인 페이지만 공개 상태 변경
    const result = await Page.updateOne({ pageId, userId: session.user.id }, { $set: { isPublic } })
    if (result.matchedCount === 0) {
      return { ok: false, message: '권한이 없어요' }
    }

    revalidatePath('/dashboard')

    return { ok: true, isPublic }
  } catch (error) {
    console.error('togglePagePublic failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}
