import type { Types } from 'mongoose'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import PublicPageBody from '@/components/sections/PublicPageBody'
import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
import User from '@/models/User'
import type { Section } from '@/types/section'
import { firstImageUrl, firstParagraphText } from '@/utils/pageMeta'

interface PublicPageProps {
  params: Promise<{ handle: string; pageId: string }>
}

interface LoadedPage {
  title: string
  sections: Section[]
  isPublic: boolean
}

// 핸들/pageId로 페이지 로드
const loadPage = async (handle: string, pageId: string): Promise<LoadedPage | null> => {
  await connectDB()
  const user = await User.findOne({ handle }).select('_id').lean<{ _id: Types.ObjectId } | null>()
  if (!user) {
    return null
  }
  const page = await Page.findOne({ pageId, userId: user._id }).lean<{
    title: string
    sections: unknown[]
    isPublic: boolean
  } | null>()
  return page
    ? {
        title: page.title,
        sections: page.sections as Section[],
        isPublic: page.isPublic,
      }
    : null
}

export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  const { handle, pageId } = await params
  const page = await loadPage(handle, pageId)
  if (!page || !page.isPublic) {
    return { title: 'Blanoir' }
  }

  const title = page.title || '제목 없는 페이지'
  const description = firstParagraphText(page.sections) || undefined
  const image = firstImageUrl(page.sections)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

const PublicPage = async ({ params }: PublicPageProps) => {
  const { handle, pageId } = await params
  const page = await loadPage(handle, pageId)
  if (!page) {
    notFound()
  }

  // 비공개 페이지는 본인 포함 누구에게도 열지 않음
  if (!page.isPublic) {
    notFound()
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <PublicPageBody sections={page.sections} />
    </main>
  )
}

export default PublicPage
