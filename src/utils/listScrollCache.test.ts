import { afterEach, describe, expect, it } from 'vitest'

import {
  type ListSnapshot,
  clearListSnapshot,
  filterKeyOf,
  peekListSnapshot,
  saveListSnapshot,
} from './listScrollCache'
import type { ExplorePost } from '@/types/explore'

const post = (pageId: string): ExplorePost => ({
  pageId,
  title: '',
  authorName: '',
  authorHandle: '',
  authorImage: '',
  thumbnail: '',
  viewCount: 0,
  useCount: 0,
  allowRemix: false,
})

const snapshot = (filterKey: string): ListSnapshot => ({
  filterKey,
  posts: [post('a')],
  hasMore: true,
  anchor: { pageId: 'a', delta: 10 },
})

afterEach(() => clearListSnapshot())

describe('filterKeyOf', () => {
  it('카테고리와 정렬과 검색어를 하나의 키로 묶음', () => {
    expect(filterKeyOf('store', 'popular', '카페')).toBe('store|popular|카페')
    expect(filterKeyOf('all', 'recent', '')).toBe('all|recent|')
  })
})

describe('listScrollCache', () => {
  it('필터가 같으면 저장한 스냅샷을 돌려줌', () => {
    saveListSnapshot(snapshot('all|popular|'))
    expect(peekListSnapshot('all|popular|')?.posts).toHaveLength(1)
  })

  it('필터가 다르면 돌려주지 않음', () => {
    saveListSnapshot(snapshot('all|popular|'))
    expect(peekListSnapshot('store|popular|')).toBeNull()
  })

  it('peek은 캐시를 비우지 않아 여러 번 읽어도 유지', () => {
    saveListSnapshot(snapshot('all|popular|'))
    expect(peekListSnapshot('all|popular|')).not.toBeNull()
    expect(peekListSnapshot('all|popular|')).not.toBeNull()
  })

  it('clear 후에는 돌려주지 않음', () => {
    saveListSnapshot(snapshot('all|popular|'))
    clearListSnapshot()
    expect(peekListSnapshot('all|popular|')).toBeNull()
  })

  it('저장한 적 없으면 null', () => {
    expect(peekListSnapshot('all|popular|')).toBeNull()
  })
})
