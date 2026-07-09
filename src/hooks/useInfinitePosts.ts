import { useEffect, useRef, useState } from 'react'

import type { SharedPage } from '@/lib/explore'
import type { ExplorePost } from '@/types/explore'

const PREFETCH_MARGIN = '800px'

interface Options {
  initial: SharedPage
  loadPage: (skip: number) => Promise<SharedPage>
}

// 서버 페이지네이션을 센티넬로 이어 붙이는 무한 스크롤
const useInfinitePosts = ({ initial, loadPage }: Options) => {
  const [posts, setPosts] = useState<ExplorePost[]>(initial.posts)
  const [hasMore, setHasMore] = useState(initial.hasMore)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)
  const firstRun = useRef(true)
  const requestId = useRef(0)

  // 필터가 바뀌면 첫 페이지부터 다시 로드하되 최초 SSR 렌더는 건너뛰기
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    requestId.current += 1
    const id = requestId.current
    loadingRef.current = true
    setLoading(true)
    loadPage(0).then((page) => {
      if (id !== requestId.current) {
        return
      }
      setPosts(page.posts)
      setHasMore(page.hasMore)
      setLoading(false)
      loadingRef.current = false
    })
  }, [loadPage])

  // 센티넬이 보이면 다음 페이지 로드
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) {
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || loadingRef.current) {
          return
        }
        loadingRef.current = true
        setLoading(true)
        const id = requestId.current
        loadPage(posts.length).then((page) => {
          if (id !== requestId.current) {
            return
          }
          setPosts((prev) => [...prev, ...page.posts])
          setHasMore(page.hasMore)
          setLoading(false)
          loadingRef.current = false
        })
      },
      { rootMargin: PREFETCH_MARGIN },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadPage, hasMore, posts.length])

  return { posts, hasMore, loading, sentinelRef }
}

export default useInfinitePosts
