import { redirect } from 'next/navigation'

import DashboardEmpty from './_components/DashboardEmpty'
import DashboardPageCard from './_components/DashboardPageCard'
import NewPageButton from './_components/NewPageButton'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Page from '@/models/Page'

const DashboardPage = async () => {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  await connectDB()
  const pages = await Page.find({ userId: session.user.id })
    .sort({ updatedAt: -1 })
    .lean<{ pageId: string; title: string; isPublic: boolean; updatedAt: Date }[]>()

  const items = pages.map((page) => ({
    pageId: page.pageId,
    title: page.title,
    isPublic: page.isPublic,
    updatedAt: page.updatedAt.toISOString(),
  }))

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">내 페이지</h1>
        {items.length > 0 && <NewPageButton />}
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
