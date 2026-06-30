import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ExploreDetail from '../_components/ExploreDetail'
import { findDummyPost } from '../_data/dummyDetail'

interface ExploreDetailPageProps {
  params: Promise<{ pageId: string }>
}

export async function generateMetadata({ params }: ExploreDetailPageProps): Promise<Metadata> {
  const { pageId } = await params
  const post = findDummyPost(pageId)
  return { title: post?.title ?? '둘러보기' }
}

const ExploreDetailPage = async ({ params }: ExploreDetailPageProps) => {
  const { pageId } = await params
  const post = findDummyPost(pageId)
  if (!post) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <ExploreDetail post={post} />
    </div>
  )
}

export default ExploreDetailPage
