import type { ExploreCategoryKey, ExplorePost } from '@/types/explore'

// 맨 위 카드를 기준점으로 삼는 좌표
export interface Anchor {
  pageId: string
  delta: number
}

export interface ListSnapshot {
  filterKey: string
  posts: ExplorePost[]
  hasMore: boolean
  anchor: Anchor | null
}

// 같은 검색 조건인지 가려낼 식별자
export const filterKeyOf = (category: ExploreCategoryKey, sort: string, q: string) =>
  `${category}|${sort}|${q}`

// 페이지 이동 동안만 살아있는 임시 캐시
let cache: ListSnapshot | null = null

export const saveListSnapshot = (snapshot: ListSnapshot) => {
  cache = snapshot
}

// 같은 필터의 스냅샷만 원본 유지로 조회
export const peekListSnapshot = (filterKey: string): ListSnapshot | null =>
  cache && cache.filterKey === filterKey ? cache : null

export const clearListSnapshot = () => {
  cache = null
}

// 저장된 필터로 목록 복귀 주소를 구성
export const listHref = (): string => {
  if (!cache) {
    return '/explore'
  }
  const [category, sort, ...rest] = cache.filterKey.split('|')
  const q = rest.join('|')
  const params = new URLSearchParams()
  if (q) {
    params.set('q', q)
  }
  if (category && category !== 'all') {
    params.set('category', category)
  }
  if (sort && sort !== 'popular') {
    params.set('sort', sort)
  }
  const search = params.toString()
  return search ? `/explore?${search}` : '/explore'
}
