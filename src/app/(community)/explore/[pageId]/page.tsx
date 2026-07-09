import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ExploreDetail from '../_components/ExploreDetail'
import ScrollToTopButton from '@/components/common/ScrollToTopButton'
import { auth } from '@/lib/auth'
import { getCommentViewer, getComments, getSharedDetail } from '@/lib/explore'
import { SITE_NAME } from '@/lib/site'
import type { CommentViewer } from '@/types/explore'
import { firstParagraphText, textFromHtml } from '@/utils/pageMeta'

interface ExploreDetailPageProps {
  params: Promise<{ pageId: string }>
}

export async function generateMetadata({ params }: ExploreDetailPageProps): Promise<Metadata> {
  const { pageId } = await params
  const detail = await getSharedDetail(pageId)
  if (!detail) {
    return { title: '템플릿', robots: { index: false } }
  }

  const title = detail.post.title || '템플릿'
  const description =
    textFromHtml(detail.communityPost) || firstParagraphText(detail.sections) || undefined
  const image = detail.post.thumbnail
  const url = `/explore/${pageId}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      url,
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

const ExploreDetailPage = async ({ params }: ExploreDetailPageProps) => {
  const { pageId } = await params
  const detail = await getSharedDetail(pageId)
  if (!detail) {
    notFound()
  }

  const session = await auth()
  const isLoggedIn = !!session?.user
  const isOwner = session?.user?.id === detail.authorId
  const comments = await getComments(pageId, detail.authorId, session?.user?.id)

  const viewerUser = session?.user?.id ? await getCommentViewer(session.user.id) : null
  const viewer: CommentViewer | null = viewerUser ? { ...viewerUser, isPageAuthor: isOwner } : null

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <ExploreDetail
        detail={detail}
        comments={comments}
        viewer={viewer}
        isLoggedIn={isLoggedIn}
        isOwner={isOwner}
      />
      <ScrollToTopButton />
    </div>
  )
}

export default ExploreDetailPage
