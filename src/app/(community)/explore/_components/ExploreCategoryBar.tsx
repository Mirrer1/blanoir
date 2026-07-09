'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import type { ExploreCategoryKey } from '@/types/explore'

interface ExploreCategoryBarProps {
  tabs: { key: ExploreCategoryKey; label: string }[]
  active: ExploreCategoryKey
  onSelect: (key: ExploreCategoryKey) => void
  className?: string
}

const ExploreCategoryBar = ({ tabs, active, onSelect, className }: ExploreCategoryBarProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)
  const [overflowing, setOverflowing] = useState(false)

  // 스크롤 위치로 화살표 노출과 넘침 여부 갱신
  const updateArrows = useCallback(() => {
    const track = trackRef.current
    if (!track) {
      return
    }
    setCanLeft(track.scrollLeft > 1)
    setCanRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 1)
    setOverflowing(track.scrollWidth > track.clientWidth + 1)
  }, [])

  // 크기 변화에 맞춰 화살표 재측정
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
    trackRef.current?.scrollBy({ left: dir * 160, behavior: 'smooth' })
  }

  return (
    <div className={cn('group/cats relative min-w-0', className)}>
      <div
        ref={trackRef}
        onScroll={updateArrows}
        className={cn(
          'flex [scrollbar-width:none] gap-1 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden',
          overflowing ? 'justify-start' : 'justify-center',
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelect(tab.key)}
            className={cn(
              'shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
              active === tab.key
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {canLeft && (
        <button
          type="button"
          aria-label="이전"
          onClick={() => slide(-1)}
          className="bg-background/80 text-foreground hover:bg-background pointer-events-none absolute top-1/2 left-0 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border opacity-0 shadow-md backdrop-blur transition-[opacity,background-color] group-hover/cats:pointer-events-auto group-hover/cats:opacity-100"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}
      {canRight && (
        <button
          type="button"
          aria-label="다음"
          onClick={() => slide(1)}
          className="bg-background/80 text-foreground hover:bg-background pointer-events-none absolute top-1/2 right-0 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border opacity-0 shadow-md backdrop-blur transition-[opacity,background-color] group-hover/cats:pointer-events-auto group-hover/cats:opacity-100"
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  )
}

export default ExploreCategoryBar
