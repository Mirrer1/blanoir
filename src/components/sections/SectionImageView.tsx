import type { PointerEventHandler, ReactNode } from 'react'

import { cn } from '@/lib/utils'
import type { ImageSection, ImageStyle } from '@/types/section'
import { optimizedImageUrl } from '@/utils/cloudinaryOptimize'

// 콘텐츠 가로폭 대비 비율이며 크게는 전체폭
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

// 원본은 자연 비율로 두고 그 외는 프레임에 cover로 채움
export const isImageCropped = (style: ImageStyle) =>
  style.ratio !== 'original' || style.shape === 'circle'

interface SectionImageViewProps {
  section: ImageSection
  src?: string // 미리보기 등 표시 src 교체
  draggable?: boolean // 초점 드래그 커서 표시
  overlay?: ReactNode // 업로드 스피너 등 프레임 위 오버레이
  live?: boolean // 공개와 미리보기에서만 링크 동작
  onPointerDown?: PointerEventHandler
  onPointerMove?: PointerEventHandler
  onPointerUp?: PointerEventHandler
}

const SectionImageView = ({
  section,
  src,
  draggable,
  overlay,
  live,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: SectionImageViewProps) => {
  const { alt, link } = section.content
  const { size, shape, align, ratio, zoom, focusX, focusY } = section.style
  const displaySrc = src ?? section.content.src
  const cropped = isImageCropped(section.style)
  const frameAspect =
    ratio === 'original' ? (shape === 'circle' ? '1 / 1' : undefined) : RATIO_ASPECT[ratio]
  // 링크는 공개와 미리보기일 때만 동작
  const linked = !!live && !!link

  const frameClass = cn(
    'relative overflow-hidden',
    SIZE_CLASS[size],
    SHAPE_RADIUS[shape],
    draggable && 'cursor-grab touch-none active:cursor-grabbing',
  )
  const frameInner = (
    <>
      {cropped ? (
        <img
          src={optimizedImageUrl(displaySrc, 1600)}
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
          src={optimizedImageUrl(displaySrc, 1600)}
          alt={alt}
          draggable={false}
          style={{ transform: `scale(${zoom})`, transformOrigin: `${focusX}% ${focusY}%` }}
          className="w-full"
        />
      )}
      {overlay}
    </>
  )

  return displaySrc ? (
    <div className={cn('flex', JUSTIFY_CLASS[align])}>
      {linked ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ aspectRatio: frameAspect }}
          className={cn(frameClass, 'block')}
        >
          {frameInner}
        </a>
      ) : (
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{ aspectRatio: frameAspect }}
          className={frameClass}
        >
          {frameInner}
        </div>
      )}
    </div>
  ) : null
}

export default SectionImageView
