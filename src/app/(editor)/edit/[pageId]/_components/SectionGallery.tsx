'use client'

import { ChevronLeft, ChevronRight, ImagePlus, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import useImageUpload from '@/hooks/useImageUpload'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { GallerySection } from '@/types/section'

const COLUMNS = { small: 4, medium: 3, large: 2 } as const
const GAP_PX = { none: 0, small: 4, medium: 8, large: 16 } as const
const SHAPE_CLASS = {
  square: 'rounded-none',
  rounded: 'rounded-lg',
  circle: 'rounded-full',
} as const

const SectionGallery = ({ section }: { section: GallerySection }) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const { isUploading, uploadMany } = useImageUpload()
  const inputRef = useRef<HTMLInputElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [previews, setPreviews] = useState<string[]>([])
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
      updateSectionContent(section.id, { images: [...images, ...uploaded] })
    }
    setPreviews([])
  }

  const openPicker = () => inputRef.current?.click()

  // 첨부 미리보기 ObjectURL 메모리 해제
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url))
  }, [previews])

  // 크기 변경 시 화살표 가능 여부 재측정
  useEffect(() => {
    updateArrows()
    window.addEventListener('resize', updateArrows)
    return () => window.removeEventListener('resize', updateArrows)
  }, [updateArrows, images.length, previews.length, columns, gapPx])

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
      {images.length || previews.length ? (
        <div className="group/carousel relative">
          <div
            ref={trackRef}
            onScroll={updateArrows}
            className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ gap: gapPx }}
          >
            {images.map((image) => (
              <div
                key={image.url}
                style={itemStyle}
                className={cn(
                  'relative aspect-square shrink-0 grow-0 snap-start overflow-hidden',
                  SHAPE_CLASS[shape],
                )}
              >
                <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
              </div>
            ))}
            {previews.map((url) => (
              <div
                key={url}
                style={itemStyle}
                className={cn(
                  'relative aspect-square shrink-0 grow-0 snap-start overflow-hidden',
                  SHAPE_CLASS[shape],
                )}
              >
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
      ) : (
        <button
          onClick={openPicker}
          disabled={isUploading}
          className="group/add border-border hover:border-foreground/40 w-full cursor-pointer rounded-xl border border-dashed p-5 transition-colors"
        >
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-muted aspect-square w-full rounded-lg" />
            ))}
          </div>
          <div className="text-muted-foreground group-hover/add:text-foreground mt-4 flex items-center justify-center gap-1.5 text-sm transition-colors">
            <ImagePlus className="size-4" />
            <span>클릭해서 이미지 추가</span>
          </div>
          <p className="text-muted-foreground/70 mt-1 text-center text-xs">
            여러 장 선택 가능 (각 5MB 이하)
          </p>
        </button>
      )}
    </div>
  )
}

export default SectionGallery
