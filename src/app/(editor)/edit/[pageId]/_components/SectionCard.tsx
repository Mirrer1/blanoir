'use client'

import { ImagePlus, Loader2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useEffect, useRef, useState } from 'react'

import useImageUpload from '@/hooks/useImageUpload'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
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

const SectionCard = ({ section }: { section: CardSection }) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const { isUploading, uploadMany } = useImageUpload()
  const inputRef = useRef<HTMLInputElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const { cards } = section.content
  const { layout, columns, align } = section.style
  const alignClass = ALIGN_CLASS[align]
  const isGrid = layout === 'grid'
  const isHorizontal = layout === 'horizontal'
  const effectiveColumns = Math.max(1, Math.min(columns, cards.length + previews.length))
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

  // 첫 업로드 캔버스에서 처리, 이후 추가/편집은 패널에서
  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!picked.length) {
      return
    }
    setPreviews(picked.map((file) => URL.createObjectURL(file)))
    const uploaded = await uploadMany(picked)
    if (uploaded.length) {
      const created = uploaded.map((image) => ({
        id: nanoid(8),
        image: image.url,
        alt: image.alt,
        title: '',
        description: '',
      }))
      updateSectionContent(section.id, { cards: [...cards, ...created] })
    }
    setPreviews([])
  }

  const openPicker = () => inputRef.current?.click()

  // 첨부 미리보기 ObjectURL 메모리 해제
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url))
  }, [previews])

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
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelect}
        className="hidden"
      />
      {cards.length || previews.length ? (
        <div ref={gridRef} style={containerStyle}>
          {cards.map((card) => (
            <div
              key={card.id}
              className={cn(
                'border-border overflow-hidden rounded-xl border',
                isHorizontal && 'flex',
              )}
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
                    !card.title && 'text-muted-foreground/40',
                  )}
                >
                  {card.title || '제목을 입력하세요'}
                </p>
                <p
                  data-card-desc
                  className={cn(
                    'text-muted-foreground break-words whitespace-pre-wrap',
                    descClass,
                    !card.description && 'text-muted-foreground/40',
                  )}
                >
                  {card.description || '설명을 입력하세요'}
                </p>
              </div>
            </div>
          ))}
          {previews.map((url) => (
            <div
              key={url}
              className={cn(
                'border-border overflow-hidden rounded-xl border',
                isHorizontal && 'flex',
              )}
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
      ) : (
        <button
          onClick={openPicker}
          disabled={isUploading}
          className="group/add border-border hover:border-foreground/40 w-full cursor-pointer rounded-xl border border-dashed p-5 transition-colors"
        >
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="border-border bg-muted/30 flex flex-col gap-2 rounded-lg border p-2"
              >
                <div className="bg-muted aspect-video w-full rounded" />
                <div className="bg-muted h-2.5 w-2/3 rounded" />
                <div className="bg-muted h-2 w-full rounded" />
              </div>
            ))}
          </div>
          <div className="text-muted-foreground group-hover/add:text-foreground mt-4 flex items-center justify-center gap-1.5 text-sm transition-colors">
            <ImagePlus className="size-4" />
            <span>클릭해서 카드 만들기</span>
          </div>
          <p className="text-muted-foreground/70 mt-1 text-center text-xs">
            사진을 여러 장 선택하면 사진마다 카드가 생겨요 (각 5MB 이하)
          </p>
        </button>
      )}
    </div>
  )
}

export default SectionCard
