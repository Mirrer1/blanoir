import { LayoutDashboard } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import ExploreBrowser from './_components/ExploreBrowser'
import ExploreShareButton from './_components/ExploreShareButton'
import { buttonVariants } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoDB'
import { cn } from '@/lib/utils'
import Page from '@/models/Page'
import type { ExploreCategory, ExplorePost } from '@/types/explore'
import type { Section } from '@/types/section'
import { firstImageUrl } from '@/utils/pageMeta'

export const metadata: Metadata = {
  title: '둘러보기',
  description: '다른 사람들이 만든 페이지를 구경하고 템플릿으로 시작하세요',
}

// 작성자를 채운 공유 페이지 조회 결과
type SharedLean = {
  pageId: string
  title: string
  category?: ExploreCategory
  communityImage: string
  likeCount: number
  useCount: number
  allowRemix: boolean
  sections: Section[]
  userId: { name: string; handle: string; profileImage: string } | null
}

const ExplorePage = async () => {
  const session = await auth()
  const isLoggedIn = !!session?.user

  await connectDB()
  const shared = await Page.find({ sharedToCommunity: true })
    .sort({ sharedAt: -1 })
    .populate('userId', 'name handle profileImage')
    .lean<SharedLean[]>()

  // 작성자가 남은 페이지만 카드 뷰 모델로 변환
  const posts: ExplorePost[] = shared
    .filter((page) => page.userId !== null)
    .map((page) => ({
      pageId: page.pageId,
      title: page.title,
      category: page.category,
      authorName: page.userId!.name,
      authorHandle: page.userId!.handle,
      authorImage: page.userId!.profileImage,
      thumbnail: page.communityImage || firstImageUrl(page.sections),
      likeCount: page.likeCount,
      useCount: page.useCount,
      allowRemix: page.allowRemix,
    }))

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">둘러보기</h1>
        <div className="flex shrink-0 items-center gap-2">
          {isLoggedIn && (
            <Link href="/dashboard" className={cn(buttonVariants({ variant: 'outline' }))}>
              <LayoutDashboard className="size-4" />내 페이지
            </Link>
          )}
          <ExploreShareButton isLoggedIn={isLoggedIn} />
        </div>
      </div>
      <div className="mt-8">
        <ExploreBrowser posts={posts} />
      </div>
    </div>
  )
}

export default ExplorePage
