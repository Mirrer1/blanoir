'use client'

import { ImagePlus, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import useImageUpload from '@/hooks/useImageUpload'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { ImageSection } from '@/types/section'

const SIZE_CLASS = { small: 'max-w-xs', medium: 'max-w-md', large: 'max-w-full' } as const
const SHAPE_RADIUS = {
  square: 'rounded-none',
  rounded: 'rounded-xl',
  circle: 'rounded-full',
} as const
const RATIO_ASPECT = { square: '1 / 1', wide: '16 / 9' } as const
const JUSTIFY_CLASS = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
} as const

const clamp = (v: number) => Math.min(100, Math.max(0, v))

const SectionImage = ({ section, isSelected }: { section: ImageSection; isSelected: boolean }) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const updateSectionStyle = useEditorStore((s) => s.updateSectionStyle)
  const { isUploading, uploadOne } = useImageUpload()
  const inputRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef<{
    x: number
    y: number
    fx: number
    fy: number
    w: number
    h: number
  } | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { src, alt } = section.content
  const { size, shape, align, ratio, zoom, focusX, focusY } = section.style
  const displaySrc = previewUrl ?? src

  // 원본은 자연 비율 박스, 정사각/와이드/원형은 프레임에 cover
  const cropped = ratio !== 'original' || shape === 'circle'
  const frameAspect =
    ratio === 'original' ? (shape === 'circle' ? '1 / 1' : undefined) : RATIO_ASPECT[ratio]
  // 확대한 cover거나 zoom이 1보다 크면 보일 부분을 드래그로 옮김
  const canDrag = (cropped || zoom > 1) && isSelected && !isUploading

  // 첫 업로드 캔버스에서 처리, 이후 추가/편집은 패널에서
  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    e.target.value = ''
    if (!picked) {
      return
    }
    setPreviewUrl(URL.createObjectURL(picked))
    const uploaded = await uploadOne(picked)
    if (uploaded) {
      updateSectionContent(section.id, { src: uploaded.url, alt: uploaded.alt })
    }
    setPreviewUrl(null)
  }

  const openPicker = () => inputRef.current?.click()

  // 드래그로 보여줄 부분 이동
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!canDrag) {
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      fx: focusX,
      fy: focusY,
      w: rect.width,
      h: rect.height,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) {
      return
    }
    updateSectionStyle(section.id, {
      focusX: clamp(d.fx - ((e.clientX - d.x) / d.w) * 100),
      focusY: clamp(d.fy - ((e.clientY - d.y) / d.h) * 100),
    })
  }

  const handlePointerUp = () => {
    dragRef.current = null
  }

  // 첨부 미리보기 ObjectURL 메모리 해제
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <div className={cn('flex', JUSTIFY_CLASS[align])}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
      />
      {displaySrc ? (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ aspectRatio: frameAspect }}
          className={cn(
            'relative w-full overflow-hidden',
            SIZE_CLASS[size],
            SHAPE_RADIUS[shape],
            canDrag && 'cursor-grab touch-none active:cursor-grabbing',
          )}
        >
          {cropped ? (
            <img
              src={displaySrc}
              alt={alt}
              draggable={false}
              style={{
                objectPosition: `${focusX}% ${focusY}%`,
                transform: `scale(${zoom})`,
                transformOrigin: `${focusX}% ${focusY}%`,
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <img
              src={displaySrc}
              alt={alt}
              draggable={false}
              style={{ transform: `scale(${zoom})`, transformOrigin: `${focusX}% ${focusY}%` }}
              className="w-full"
            />
          )}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="size-6 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={openPicker}
          disabled={isUploading}
          className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 transition-colors"
        >
          <ImagePlus className="size-6" />
          <span className="text-sm">이미지 추가</span>
          <span className="text-muted-foreground/70 text-xs">클릭해서 선택 (5MB 이하)</span>
        </button>
      )}
    </div>
  )
}

export default SectionImage
