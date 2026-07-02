// 공유와 목록이 함께 쓰는 둘러보기 카테고리 상수
export type ExploreCategory = 'profile' | 'portfolio' | 'store' | 'wedding' | 'resume' | 'event'
export type ExploreCategoryKey = ExploreCategory | 'all'

export const CATEGORIES: { key: ExploreCategory; label: string }[] = [
  { key: 'profile', label: '프로필' },
  { key: 'portfolio', label: '포트폴리오' },
  { key: 'store', label: '매장' },
  { key: 'wedding', label: '청첩장' },
  { key: 'resume', label: '이력서' },
  { key: 'event', label: '이벤트' },
]
