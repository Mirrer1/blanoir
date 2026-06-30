'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

import { CATEGORIES, type ExploreCategoryKey, type ExplorePost } from '../_data/dummyPosts'
import ExploreCard from './ExploreCard'
import ExploreCategoryBar from './ExploreCategoryBar'
import ExploreCategoryDropdown from './ExploreCategoryDropdown'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type SortKey = 'recent' | 'popular'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: '인기' },
  { key: 'recent', label: '최신' },
]

const CATEGORY_TABS: { key: ExploreCategoryKey; label: string }[] = [
  { key: 'all', label: '전체' },
  ...CATEGORIES,
]

const ExploreBrowser = ({ posts }: { posts: ExplorePost[] }) => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ExploreCategoryKey>('all')
  const [sort, setSort] = useState<SortKey>('popular')

  const keyword = query.trim().toLowerCase()
  const filtered = posts.filter(
    (post) =>
      (category === 'all' || post.category === category) &&
      post.title.toLowerCase().includes(keyword),
  )
  const visible =
    sort === 'popular' ? [...filtered].sort((a, b) => b.likeCount - a.likeCount) : filtered

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative sm:w-52 sm:shrink-0">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목 검색"
            className="pl-8"
          />
        </div>
        <div className="flex min-w-0 items-center gap-3 sm:flex-1">
          <ExploreCategoryBar
            tabs={CATEGORY_TABS}
            active={category}
            onSelect={setCategory}
            className="hidden flex-1 lg:block"
          />
          <ExploreCategoryDropdown
            tabs={CATEGORY_TABS}
            active={category}
            onSelect={setCategory}
            className="flex-1 lg:hidden"
          />
          <div className="bg-muted flex shrink-0 gap-0.5 rounded-lg p-0.5">
            {SORTS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSort(option.key)}
                className={cn(
                  'h-7 cursor-pointer rounded-md px-3 text-sm font-medium transition-colors',
                  sort === option.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-muted-foreground py-20 text-center text-sm">검색 결과가 없어요</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <ExploreCard key={post.pageId} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ExploreBrowser
