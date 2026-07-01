import { LayoutGrid } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import DashboardEmpty from './_components/DashboardEmpty'
import DashboardPageGrid from './_components/DashboardPageGrid'
import NewPageButton from '@/components/common/NewPageButton'
import { buttonVariants } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoDB'
import { cn } from '@/lib/utils'
import Page from '@/models/Page'
import type { Section } from '@/types/section'
import { firstImageUrl, firstTextContent } from '@/utils/pageMeta'

export const metadata: Metadata = { title: '내 페이지' }

const DashboardPage = async () => {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  await connectDB()
  const pages = await Page.find({ userId: session.user.id })
    .sort({ updatedAt: -1 })
    .lean<
      { pageId: string; title: string; isPublic: boolean; updatedAt: Date; sections: Section[] }[]
    >()

  const items = pages.map((page) => ({
    pageId: page.pageId,
    title: page.title,
    isPublic: page.isPublic,
    updatedAt: page.updatedAt.toISOString(),
    thumbnail: firstImageUrl(page.sections),
    textPreview: firstTextContent(page.sections),
  }))

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">내 페이지</h1>
        <div className="flex items-center gap-2">
          {/* TODO: 둘러보기 구현 후 롤백 */}
          <Link href="/explore" className={cn(buttonVariants({ variant: 'outline' }), 'hidden')}>
            <LayoutGrid className="size-4" />
            템플릿 사용
          </Link>
          {items.length > 0 && (
            <div className="hidden lg:block">
              <NewPageButton />
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        {items.length === 0 ? <DashboardEmpty /> : <DashboardPageGrid items={items} />}
      </div>
    </div>
  )
}

export default DashboardPage
