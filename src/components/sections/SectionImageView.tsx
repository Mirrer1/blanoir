import type { PointerEventHandler, ReactNode } from 'react'

import { cn } from '@/lib/utils'
import type { ImageSection, ImageStyle } from '@/types/section'

// 콘텐츠 가로폭 대비 비율, 크게는 전체
const SIZE_CLASS = { small: 'w-1/3', medium: 'w-2/3', large: 'w-full' } as const
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

// 원본은 자연 비율, 정사각/와이드/원형은 프레임에 cover로 꽉 채움
export const isImageCropped = (style: ImageStyle) =>
  style.ratio !== 'original' || style.shape === 'circle'

interface SectionImageViewProps {
  section: ImageSection
  src?: string // 미리보기 등 표시 src 교체
  draggable?: boolean // 초점 드래그 커서 표시
  overlay?: ReactNode // 업로드 스피너 등 프레임 위 오버레이
  onPointerDown?: PointerEventHandler
  onPointerMove?: PointerEventHandler
  onPointerUp?: PointerEventHandler
}

const SectionImageView = ({
  section,
  src,
  draggable,
  overlay,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: SectionImageViewProps) => {
  const { alt } = section.content
  const { size, shape, align, ratio, zoom, focusX, focusY } = section.style
  const displaySrc = src ?? section.content.src
  const cropped = isImageCropped(section.style)
  const frameAspect =
    ratio === 'original' ? (shape === 'circle' ? '1 / 1' : undefined) : RATIO_ASPECT[ratio]

  return displaySrc ? (
    <div className={cn('flex', JUSTIFY_CLASS[align])}>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ aspectRatio: frameAspect }}
        className={cn(
          'relative overflow-hidden',
          SIZE_CLASS[size],
          SHAPE_RADIUS[shape],
          draggable && 'cursor-grab touch-none active:cursor-grabbing',
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
        {overlay}
      </div>
    </div>
  ) : null
}

export default SectionImageView
