import { LayoutDashboard } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import ExploreBrowser from './_components/ExploreBrowser'
import ExploreShareButton from './_components/ExploreShareButton'
import { buttonVariants } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { getSharedPosts } from '@/lib/explore'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: '둘러보기',
  description: '다른 사람들이 만든 페이지를 구경하고 템플릿으로 시작하세요',
}

const ExplorePage = async () => {
  const session = await auth()
  const isLoggedIn = !!session?.user
  const posts = await getSharedPosts()

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
        <Suspense>
          <ExploreBrowser posts={posts} />
        </Suspense>
      </div>
    </div>
  )
}

export default ExplorePage
