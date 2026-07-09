'use client'

import { useEffect, useState } from 'react'

import ExploreGalleryCard from './ExploreGalleryCard'
import useMasonryColumns from '@/hooks/useMasonryColumns'
import { cn } from '@/lib/utils'
import type { ExplorePost } from '@/types/explore'

const DEFAULT_RATIO = 0.75
const REVEAL_TIMEOUT_MS = 700

const ExploreMasonry = ({ posts }: { posts: ExplorePost[] }) => {
  const columnCount = useMasonryColumns()
  const [ratios, setRatios] = useState<Record<string, number>>({})
  const [initialCount] = useState(() => posts.length)
  const [timedOut, setTimedOut] = useState(false)

  const setRatio = (pageId: string, ratio: number) =>
    setRatios((prev) => (prev[pageId] === ratio ? prev : { ...prev, [pageId]: ratio }))

  // 첫 배치 비율이 다 들어오기 전 재배치를 감췄다가 정렬 끝난 뒤 표시
  useEffect(() => {
    const id = setTimeout(() => setTimedOut(true), REVEAL_TIMEOUT_MS)
    return () => clearTimeout(id)
  }, [])

  const readyCount = Object.keys(ratios).length + posts.filter((post) => !post.thumbnail).length
  const revealed = columnCount === 1 || timedOut || readyCount >= initialCount

  // 가장 짧은 컬럼에 순서대로 배치하고 append 시 기존 배치 유지
  const columns: ExplorePost[][] = Array.from({ length: columnCount }, () => [])
  const heights = new Array(columnCount).fill(0)
  for (const post of posts) {
    let shortest = 0
    for (let i = 1; i < columnCount; i++) {
      if (heights[i] < heights[shortest]) {
        shortest = i
      }
    }
    columns[shortest].push(post)
    heights[shortest] += ratios[post.pageId] ?? DEFAULT_RATIO
  }

  return (
    <div className={cn('transition-opacity duration-300', revealed ? 'opacity-100' : 'opacity-0')}>
      <div className="flex items-start gap-5">
        {columns.map((column, index) => (
          <div key={index} className="flex min-w-0 flex-1 flex-col gap-5">
            {column.map((post) => (
              <ExploreGalleryCard
                key={post.pageId}
                post={post}
                onRatio={setRatio}
                uniform={columnCount === 1}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExploreMasonry
