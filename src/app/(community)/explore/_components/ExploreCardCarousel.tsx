'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import ExploreCard from './ExploreCard'
import type { ExplorePost } from '@/types/explore'

const ExploreCardCarousel = ({ posts }: { posts: ExplorePost[] }) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  // 스크롤 위치에 따라 화살표 노출 여부 갱신
  const updateArrows = useCallback(() => {
    const track = trackRef.current
    if (!track) {
      return
    }
    setCanLeft(track.scrollLeft > 1)
    setCanRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 1)
  }, [])

  useEffect(() => {
    updateArrows()
    const track = trackRef.current
    if (!track) {
      return
    }
    const observer = new ResizeObserver(updateArrows)
    observer.observe(track)
    window.addEventListener('resize', updateArrows)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateArrows)
    }
  }, [updateArrows])

  const slide = (dir: 1 | -1) => {
    const track = trackRef.current
    if (track) {
      track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' })
    }
  }

  return (
    <div className="group/carousel relative">
      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="flex [scrollbar-width:none] gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post) => (
          <div key={post.pageId} className="w-64 shrink-0 sm:w-72">
            <ExploreCard post={post} />
          </div>
        ))}
      </div>
      {canLeft && (
        <button
          type="button"
          aria-label="이전"
          onClick={() => slide(-1)}
          className="bg-background/80 text-foreground hover:bg-background absolute top-1/2 left-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border opacity-0 shadow-md backdrop-blur transition-[opacity,background-color] group-hover/carousel:opacity-100"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}
      {canRight && (
        <button
          type="button"
          aria-label="다음"
          onClick={() => slide(1)}
          className="bg-background/80 text-foreground hover:bg-background absolute top-1/2 right-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border opacity-0 shadow-md backdrop-blur transition-[opacity,background-color] group-hover/carousel:opacity-100"
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  )
}

export default ExploreCardCarousel
