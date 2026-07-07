import type { Types } from 'mongoose'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import EditorViewportGate from './_components/shell/EditorViewportGate'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
import EditorProvider from '@/providers/EditorProvider'
import type { EditorInitialPage } from '@/store/editor'
import type { Section } from '@/types/section'

// 에디터는 비공개 작업으로 검색에 미노출
export const metadata: Metadata = {
  title: '편집기',
  robots: { index: false, follow: false },
}

interface EditPageProps {
  params: Promise<{ pageId: string }>
}

const EditPage = async ({ params }: EditPageProps) => {
  const { pageId } = await params

  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  await connectDB()
  const page = await Page.findOne({ pageId }).lean<{
    pageId: string
    userId: Types.ObjectId
    title: string
    sections: unknown[]
    isPublic: boolean
    sharedToCommunity: boolean
    remixedFrom?: string
  } | null>()

  // 없는 페이지거나 내 페이지가 아니면 노출하지 않음
  if (!page || page.userId.toString() !== session.user.id) {
    notFound()
  }

  // 버튼 링크에서 고를 수 있는 내 다른 페이지 목록
  const myPages = await Page.find({ userId: session.user.id, pageId: { $ne: page.pageId } })
    .select('pageId title isPublic')
    .sort({ updatedAt: -1 })
    .lean<{ pageId: string; title: string; isPublic: boolean }[]>()

  const initialPage: EditorInitialPage = {
    pageId: page.pageId,
    handle: session.user.handle,
    title: page.title,
    isPublic: page.isPublic,
    sharedToCommunity: !!page.sharedToCommunity,
    remixedFrom: page.remixedFrom,
    sections: page.sections as Section[],
    myPages: myPages.map((p) => ({ pageId: p.pageId, title: p.title, isPublic: p.isPublic })),
  }

  // pageId로 키를 주어 페이지 이동 시 스토어를 새로 생성
  return (
    <EditorProvider key={initialPage.pageId} page={initialPage}>
      <EditorViewportGate />
    </EditorProvider>
  )
}

export default EditPage
