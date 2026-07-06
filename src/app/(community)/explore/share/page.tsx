import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import ExploreShareForm from '../_components/ExploreShareForm'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
import type { Section } from '@/types/section'
import { firstImageUrl, firstTextContent } from '@/utils/pageMeta'

export const metadata: Metadata = { title: '공유하기' }

const ExploreSharePage = async () => {
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

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-heading text-2xl font-extrabold tracking-tight">템플릿으로 공유하기</h1>
      <div className="mt-8">
        <ExploreShareForm pages={items} />
      </div>
    </div>
  )
}

export default ExploreSharePage
