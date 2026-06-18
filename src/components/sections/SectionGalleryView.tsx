'use client'

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import type { GallerySection } from '@/types/section'

const COLUMNS = { small: 4, medium: 3, large: 2 } as const
const GAP_PX = { none: 0, small: 4, medium: 8, large: 16 } as const
const SHAPE_CLASS = {
  square: 'rounded-none',
  rounded: 'rounded-lg',
  circle: 'rounded-full',
} as const

const CELL_CLASS = 'relative aspect-square shrink-0 grow-0 snap-start overflow-hidden'

const SectionGalleryView = ({
  section,
  pendingUrls = [], // 업로드 진행 중인 미리보기 셀
}: {
  section: GallerySection
  pendingUrls?: string[]
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)
  const { images } = section.content
  const { size, shape, gap } = section.style
  const gapPx = GAP_PX[gap]
  const columns = COLUMNS[size]
  const itemStyle = { flexBasis: `calc((100% - ${(columns - 1) * gapPx}px) / ${columns})` }

  // 스크롤 위치에 따라 화살표 노출 여부 갱신
  const updateArrows = useCallback(() => {
    const track = trackRef.current
    if (!track) {
      return
    }
    setCanLeft(track.scrollLeft > 1)
    setCanRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 1)
  }, [])

  // 화살표 클릭이 섹션 선택으로 번지지 않게 막고 한 화면씩 가로 스크롤
  const slide = (e: React.MouseEvent, dir: 1 | -1) => {
    e.stopPropagation()
    const track = trackRef.current
    if (track) {
      track.scrollBy({ left: dir * track.clientWidth, behavior: 'smooth' })
    }
  }

  // 칸 수, 이미지 수 변경 시 화살표 가능 여부 재측정
  useEffect(() => {
    updateArrows()
    window.addEventListener('resize', updateArrows)
    return () => window.removeEventListener('resize', updateArrows)
  }, [updateArrows, images.length, pendingUrls.length, columns, gapPx])

  return (
    <div className="group/carousel relative">
      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ gap: gapPx }}
      >
        {images.map((image) => (
          <div key={image.url} style={itemStyle} className={cn(CELL_CLASS, SHAPE_CLASS[shape])}>
            <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
          </div>
        ))}
        {pendingUrls.map((url) => (
          <div key={url} style={itemStyle} className={cn(CELL_CLASS, SHAPE_CLASS[shape])}>
            <img src={url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          </div>
        ))}
      </div>
      {canLeft && (
        <button
          aria-label="이전"
          onClick={(e) => slide(e, -1)}
          className="bg-background/80 text-foreground hover:bg-background absolute top-1/2 left-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border opacity-0 shadow-md backdrop-blur transition-opacity group-hover/carousel:opacity-100"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}
      {canRight && (
        <button
          aria-label="다음"
          onClick={(e) => slide(e, 1)}
          className="bg-background/80 text-foreground hover:bg-background absolute top-1/2 right-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border opacity-0 shadow-md backdrop-blur transition-opacity group-hover/carousel:opacity-100"
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  )
}

export default SectionGalleryView
