'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import type { CardSection } from '@/types/section'

const ALIGN_CLASS = { left: 'text-left', center: 'text-center', right: 'text-right' } as const
// 표시 열 수에 비례해서 텍스트 크기 수정
const GRID_TITLE: Record<number, string> = {
  1: 'text-lg',
  2: 'text-lg',
  3: 'text-base',
  4: 'text-sm',
}
const GRID_DESC: Record<number, string> = { 1: 'text-sm', 2: 'text-sm', 3: 'text-sm', 4: 'text-xs' }

interface SectionCardViewProps {
  section: CardSection
  pendingUrls?: string[] // 업로드 진행 중인 미리보기 카드
  placeholders?: { title: string; description: string } // 에디터에서 빈 값 안내 문구
}

const SectionCardView = ({ section, pendingUrls = [], placeholders }: SectionCardViewProps) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const { cards } = section.content
  const { layout, columns, align } = section.style
  const alignClass = ALIGN_CLASS[align]
  const isGrid = layout === 'grid'
  const isHorizontal = layout === 'horizontal'
  const effectiveColumns = Math.max(1, Math.min(columns, cards.length + pendingUrls.length))
  const titleClass = isGrid ? GRID_TITLE[effectiveColumns] : 'text-lg'
  const descClass = isGrid ? GRID_DESC[effectiveColumns] : 'text-sm'
  const padClass = isGrid && effectiveColumns === 4 ? 'p-3' : 'p-4'
  const containerStyle = isGrid
    ? {
        display: 'grid',
        gap: 16,
        gridTemplateColumns: `repeat(${effectiveColumns}, minmax(0, 1fr))`,
      }
    : { display: 'flex', flexDirection: 'column' as const, gap: 16 }

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

  return (
    <div ref={gridRef} style={containerStyle}>
      {cards.map((card) => (
        <div
          key={card.id}
          className={cn('border-border overflow-hidden rounded-xl border', isHorizontal && 'flex')}
        >
          {card.image && (
            <img
              src={card.image}
              alt={card.alt}
              className={cn(
                'object-cover',
                isHorizontal ? 'aspect-square w-2/5 shrink-0' : 'aspect-video w-full',
              )}
            />
          )}
          <div
            className={cn(
              'flex flex-col gap-2',
              padClass,
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
        </div>
      ))}
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
            <img src={url} alt="" className="h-full w-full object-cover" />
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
