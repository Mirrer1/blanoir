import type { Metadata } from 'next'

import ExploreBrowser from './_components/ExploreBrowser'
import ExploreShareButton from './_components/ExploreShareButton'
import { auth } from '@/lib/auth'
import { EXPLORE_PAGE_SIZE, type ExploreSort, getSharedPage } from '@/lib/explore'
import { CATEGORY_KEYS, type ExploreCategoryKey } from '@/types/explore'

export const metadata: Metadata = {
  title: '템플릿',
  description: '다른 사람들이 만든 페이지를 구경하고 템플릿으로 시작하세요',
}

const KEY_SET = new Set<string>(CATEGORY_KEYS)
const parseCategory = (value?: string): ExploreCategoryKey =>
  value && KEY_SET.has(value) ? (value as ExploreCategoryKey) : 'all'
const parseSort = (value?: string): ExploreSort => (value === 'recent' ? 'recent' : 'popular')

type SearchParams = { q?: string; category?: string; sort?: string }

const ExplorePage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const [session, params] = await Promise.all([auth(), searchParams])
  const isLoggedIn = !!session?.user

  const category = parseCategory(params.category)
  const sort = parseSort(params.sort)
  const q = (params.q ?? '').slice(0, 100)
  const initial = await getSharedPage({ skip: 0, limit: EXPLORE_PAGE_SIZE, category, sort, q })

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">템플릿</h1>
        <ExploreShareButton isLoggedIn={isLoggedIn} />
      </div>
      <div className="mt-8">
        <ExploreBrowser
          initial={initial}
          initialQuery={q}
          initialCategory={category}
          initialSort={sort}
        />
      </div>
    </div>
  )
}

export default ExplorePage
