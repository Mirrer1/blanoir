import { redirect } from 'next/navigation'

import DashboardEmpty from './_components/DashboardEmpty'
import DashboardPageCard from './_components/DashboardPageCard'
import NewPageButton from './_components/NewPageButton'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
import type { Section } from '@/types/section'
import { firstImageUrl, firstTextContent } from '@/utils/pageMeta'

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
        {items.length > 0 && (
          <div className="hidden lg:block">
            <NewPageButton />
          </div>
        )}
      </div>
      <div className="mt-8">
        {items.length === 0 ? (
          <DashboardEmpty />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((page) => (
              <DashboardPageCard key={page.pageId} page={page} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
