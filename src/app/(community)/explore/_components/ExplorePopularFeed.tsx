'use client'

import { useEffect, useRef, useState } from 'react'

import ExploreCard from './ExploreCard'
import type { ExplorePost } from '@/types/explore'

const PAGE_SIZE = 6

const ExplorePopularFeed = ({ posts }: { posts: ExplorePost[] }) => {
  const [count, setCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // 센티넬이 보이면 다음 묶음을 이어 붙임
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) {
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setCount((prev) => Math.min(prev + PAGE_SIZE, posts.length))
      }
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [posts.length])

  const visible = posts.slice(0, count)
  const hasMore = count < posts.length

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post, index) => (
          <ExploreCard key={`${post.pageId}-${index}`} post={post} />
        ))}
      </div>
      {hasMore && <div ref={sentinelRef} className="h-4" />}
    </div>
  )
}

export default ExplorePopularFeed
