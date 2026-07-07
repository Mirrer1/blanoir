import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import ExploreShareForm, { type ShareEdit } from '../_components/ExploreShareForm'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
import type { ExploreCategory } from '@/types/explore'
import type { Section } from '@/types/section'
import { firstImageUrl, firstTextContent } from '@/utils/pageMeta'

export const metadata: Metadata = { title: '템플릿 추가' }

interface ExploreSharePageProps {
  searchParams: Promise<{ pageId?: string; from?: string }>
}

const ExploreSharePage = async ({ searchParams }: ExploreSharePageProps) => {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  await connectDB()
  const pages = await Page.find({ userId: session.user.id }).sort({ updatedAt: -1 }).lean<
    {
      pageId: string
      title: string
      isPublic: boolean
      sharedToCommunity: boolean
      remixedFrom?: string
      category?: ExploreCategory
      allowRemix: boolean
      communityImage: string
      communityPost: string
      sections: Section[]
    }[]
  >()

  // 빈 페이지를 제외하고 공개 페이지를 위로 정렬
  const items = pages
    .filter((page) => page.sections.length > 0 && !page.remixedFrom)
    .sort(
      (a, b) =>
        Number(!!a.sharedToCommunity) - Number(!!b.sharedToCommunity) ||
        Number(b.isPublic) - Number(a.isPublic),
    )
    .map((page) => ({
      pageId: page.pageId,
      title: page.title,
      isPublic: page.isPublic,
      sharedToCommunity: !!page.sharedToCommunity,
      thumbnail: firstImageUrl(page.sections),
      textPreview: firstTextContent(page.sections),
    }))

  // 넘어온 페이지면 고정하고 기존 값 프리필
  const { pageId: editPageId, from } = await searchParams
  const target = editPageId
    ? pages.find(
        (page) => page.pageId === editPageId && page.sections.length > 0 && !page.remixedFrom,
      )
    : undefined
  const targetItem = target && items.find((item) => item.pageId === target.pageId)
  const edit: ShareEdit | undefined =
    target && targetItem
      ? {
          page: targetItem,
          from: from === 'detail' ? 'detail' : 'editor',
          alreadyShared: !!target.sharedToCommunity,
          category: target.category ?? '',
          allowRemix: target.sharedToCommunity ? !!target.allowRemix : true,
          communityImage: target.sharedToCommunity
            ? target.communityImage || firstImageUrl(target.sections)
            : firstImageUrl(target.sections),
          communityPost: target.sharedToCommunity ? (target.communityPost ?? '') : '',
        }
      : undefined

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-heading text-2xl font-extrabold tracking-tight">
        {edit?.alreadyShared ? '템플릿 관리' : '템플릿 추가'}
      </h1>
      <div className="mt-8">
        <ExploreShareForm pages={items} edit={edit} />
      </div>
    </div>
  )
}

export default ExploreSharePage
