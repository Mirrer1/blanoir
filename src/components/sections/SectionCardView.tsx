'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import type { CardSection } from '@/types/section'
import { optimizedImageUrl } from '@/utils/cloudinaryOptimize'

const ALIGN_CLASS = { left: 'text-left', center: 'text-center', right: 'text-right' } as const
// 카드 수가 정하는 한 줄 최대 칸 수로 넘으면 다음 줄로 줄바꿈
const MAX_COLUMNS = 3
// 좁은 화면에선 한 줄 2개
const NARROW_COLUMNS = 2
const NARROW_WIDTH = 480
// 표시 열 수에 비례해서 텍스트 크기 수정
const GRID_TITLE: Record<number, string> = { 1: 'text-lg', 2: 'text-lg', 3: 'text-base' }
const GRID_DESC: Record<number, string> = { 1: 'text-sm', 2: 'text-sm', 3: 'text-sm' }

interface SectionCardViewProps {
  section: CardSection
  pendingUrls?: string[] // 업로드 진행 중인 미리보기 카드
  placeholders?: { title: string; description: string } // 에디터에서 빈 값 안내 문구
  live?: boolean // 공개와 미리보기에서만 카드 링크 동작
}

const SectionCardView = ({
  section,
  pendingUrls = [],
  placeholders,
  live,
}: SectionCardViewProps) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const [maxColumns, setMaxColumns] = useState(MAX_COLUMNS)
  const { cards } = section.content
  const { layout, align } = section.style
  const alignClass = ALIGN_CLASS[align]
  const isGrid = layout === 'grid'
  const isHorizontal = layout === 'horizontal'
  const effectiveColumns = Math.max(1, Math.min(maxColumns, cards.length + pendingUrls.length))
  const titleClass = isGrid ? GRID_TITLE[effectiveColumns] : 'text-lg'
  const descClass = isGrid ? GRID_DESC[effectiveColumns] : 'text-sm'
  const containerClass = isGrid ? 'grid gap-4' : 'flex flex-col gap-4'
  const containerStyle = isGrid
    ? { gridTemplateColumns: `repeat(${effectiveColumns}, minmax(0, 1fr))` }
    : undefined

  // 컨테이너 실제 폭으로 한 줄 칸 수 결정
  // 모바일 미리보기 박스 함께 반영
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) {
      return
    }
    const observer = new ResizeObserver(() => {
      setMaxColumns(grid.clientWidth < NARROW_WIDTH ? NARROW_COLUMNS : MAX_COLUMNS)
    })
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  // 그리드에서 카드별 컨텐츠 영역은 가장 긴곳에 맞춰 높이 통일
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) {
      return
    }
    const titles = grid.querySelectorAll<HTMLElement>('[data-card-title]')
    const descs = grid.querySelectorAll<HTMLElement>('[data-card-desc]')
    if (!isGrid) {
      titles.forEach((el) => (el.style.minHeight = ''))
      descs.forEach((el) => (el.style.minHeight = ''))
      return
    }
    const fit = (els: NodeListOf<HTMLElement>) => {
      els.forEach((el) => (el.style.minHeight = ''))
      let max = 0
      els.forEach((el) => (max = Math.max(max, el.offsetHeight)))
      els.forEach((el) => (el.style.minHeight = `${max}px`))
    }
    const equalize = () => {
      fit(grid.querySelectorAll<HTMLElement>('[data-card-title]'))
      fit(grid.querySelectorAll<HTMLElement>('[data-card-desc]'))
    }
    equalize()
    window.addEventListener('resize', equalize)
    return () => window.removeEventListener('resize', equalize)
  }, [cards, isGrid, effectiveColumns, align])

  // 링크 있으면 공개와 미리보기에서 카드 전체를 감쌈
  const cardNodes = cards.map((card) => {
    const linked = !!live && !!card.link
    const cardClass = cn(
      'border-border overflow-hidden rounded-xl border',
      isHorizontal && 'flex',
      linked && 'block',
    )
    const cardInner = (
      <>
        {card.image && (
          <img
            src={optimizedImageUrl(card.image, 800)}
            alt={card.alt}
            className={cn(
              'object-cover',
              isHorizontal ? 'aspect-square w-2/5 shrink-0' : 'aspect-video w-full',
            )}
          />
        )}
        <div
          className={cn(
            'flex flex-col gap-2 p-4',
            isHorizontal && 'flex-1 justify-center',
            alignClass,
          )}
        >
          <p
            data-card-title
            className={cn(
              titleClass,
              'font-semibold break-words',
              !card.title && placeholders && 'text-muted-foreground/40',
            )}
          >
            {card.title || placeholders?.title}
          </p>
          <p
            data-card-desc
            className={cn(
              'text-muted-foreground break-words whitespace-pre-wrap',
              descClass,
              !card.description && placeholders && 'text-muted-foreground/40',
            )}
          >
            {card.description || placeholders?.description}
          </p>
        </div>
      </>
    )

    return linked ? (
      <a
        key={card.id}
        href={card.link}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
      >
        {cardInner}
      </a>
    ) : (
      <div key={card.id} className={cardClass}>
        {cardInner}
      </div>
    )
  })

  return (
    <div ref={gridRef} className={containerClass} style={containerStyle}>
      {cardNodes}
      {pendingUrls.map((url) => (
        <div
          key={url}
          className={cn('border-border overflow-hidden rounded-xl border', isHorizontal && 'flex')}
        >
          <div
            className={cn(
              'bg-muted relative',
              isHorizontal ? 'aspect-square w-2/5 shrink-0' : 'aspect-video w-full',
            )}
          >
            <img src={optimizedImageUrl(url, 800)} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SectionCardView
