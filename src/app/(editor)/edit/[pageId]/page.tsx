import type { Types } from 'mongoose'
import { notFound, redirect } from 'next/navigation'

import EditorShell from './_components/shell/EditorShell'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
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

  return <EditorShell page={initialPage} />
}

export default EditPage
