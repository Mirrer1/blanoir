import type { Types } from 'mongoose'
import { notFound, redirect } from 'next/navigation'

import EditorViewportGate from './_components/shell/EditorViewportGate'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
import EditorProvider from '@/providers/EditorProvider'
import type { EditorInitialPage } from '@/store/editor'
import type { Section } from '@/types/section'

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
  } | null>()

  // 없는 페이지거나 내 페이지가 아니면 노출하지 않음
  if (!page || page.userId.toString() !== session.user.id) {
    notFound()
  }

  const initialPage: EditorInitialPage = {
    pageId: page.pageId,
    handle: session.user.handle,
    title: page.title,
    isPublic: page.isPublic,
    sections: page.sections as Section[],
  }

  // pageId로 키를 주어 페이지 이동 시 스토어를 새로 만든다
  return (
    <EditorProvider key={initialPage.pageId} page={initialPage}>
      <EditorViewportGate />
    </EditorProvider>
  )
}

export default EditPage
