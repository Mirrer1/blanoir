'use client'

import { Loader2, Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import ExploreCategoryBar from './ExploreCategoryBar'
import ExploreCategoryDropdown from './ExploreCategoryDropdown'
import ExploreMasonry from './ExploreMasonry'
import { fetchSharedPosts } from '@/actions/explore'
import { Input } from '@/components/ui/input'
import useInfinitePosts from '@/hooks/useInfinitePosts'
import type { ExploreSort, SharedPage } from '@/lib/explore'
import { cn } from '@/lib/utils'
import { CATEGORIES, type ExploreCategoryKey } from '@/types/explore'

const SEARCH_DEBOUNCE_MS = 300

const SORTS: { key: ExploreSort; label: string }[] = [
  { key: 'popular', label: '인기' },
  { key: 'recent', label: '최신' },
]

const CATEGORY_TABS: { key: ExploreCategoryKey; label: string }[] = [
  { key: 'all', label: '전체' },
  ...CATEGORIES,
]

interface Props {
  initial: SharedPage
  initialQuery: string
  initialCategory: ExploreCategoryKey
  initialSort: ExploreSort
}

const ExploreBrowser = ({ initial, initialQuery, initialCategory, initialSort }: Props) => {
  const [query, setQuery] = useState(initialQuery) // 입력값
  const [search, setSearch] = useState(initialQuery) // 디바운스된 검색어
  const [category, setCategory] = useState<ExploreCategoryKey>(initialCategory)
  const [sort, setSort] = useState<ExploreSort>(initialSort)

  // 입력이 멈추면 검색어를 반영해 조회
  useEffect(() => {
    const id = setTimeout(() => setSearch(query), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [query])

  // 필터가 바뀌면 새 loadPage로 첫 페이지부터 재조회
  const loadPage = useCallback(
    (skip: number) => fetchSharedPosts({ skip, category, sort, q: search }),
    [category, sort, search],
  )
  const { posts, hasMore, loading, sentinelRef } = useInfinitePosts({ initial, loadPage })

  // 필터를 URL 히스토리에 반영해 복원
  const syncUrl = (next: { q: string; category: ExploreCategoryKey; sort: ExploreSort }) => {
    const params = new URLSearchParams()
    if (next.q) {
      params.set('q', next.q)
    }
    if (next.category !== 'all') {
      params.set('category', next.category)
    }
    if (next.sort !== 'popular') {
      params.set('sort', next.sort)
    }
    const value = params.toString()
    window.history.replaceState(null, '', value ? `?${value}` : window.location.pathname)
  }

  const applyQuery = (value: string) => {
    setQuery(value)
    syncUrl({ q: value, category, sort })
  }
  const applyCategory = (value: ExploreCategoryKey) => {
    setCategory(value)
    syncUrl({ q: query, category: value, sort })
  }
  const applySort = (value: ExploreSort) => {
    setSort(value)
    syncUrl({ q: query, category, sort: value })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative sm:w-52 sm:shrink-0">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => applyQuery(e.target.value)}
            placeholder="제목 검색"
            className="pl-8"
          />
        </div>
        <div className="flex min-w-0 items-center gap-3 sm:flex-1">
          <ExploreCategoryBar
            tabs={CATEGORY_TABS}
            active={category}
            onSelect={applyCategory}
            className="hidden flex-1 lg:block"
          />
          <ExploreCategoryDropdown
            tabs={CATEGORY_TABS}
            active={category}
            onSelect={applyCategory}
            className="flex-1 lg:hidden"
          />
          <div className="bg-muted flex shrink-0 gap-0.5 rounded-lg p-0.5">
            {SORTS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => applySort(option.key)}
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

      {posts.length === 0 && !loading ? (
        <p className="text-muted-foreground py-20 text-center text-sm">검색 결과가 없어요</p>
      ) : (
        <>
          <ExploreMasonry posts={posts} />
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-6">
              {loading && <Loader2 className="text-muted-foreground size-5 animate-spin" />}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ExploreBrowser
