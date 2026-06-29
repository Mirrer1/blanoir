import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'
import type { ButtonSection } from '@/types/section'
import { fillBackground, fillText } from '@/utils/colorFill'

const SHAPE_CLASS = { square: 'rounded-md', rounded: 'rounded-full' } as const
const SIZE_CLASS = {
  small: 'px-8 py-2.5 text-sm',
  medium: 'px-12 py-3 text-base',
  large: 'px-16 py-4 text-xl',
} as const
const WIDTH_CLASS = { auto: '', wide: 'w-1/2', full: 'w-full' } as const
const JUSTIFY_CLASS = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
} as const

// live면 공개 페이지라 버튼처럼 동작하고 아니면 에디터라 비클릭 표시
const SectionButton = ({ section, live }: { section: ButtonSection; live?: boolean }) => {
  const { text, url } = section.content
  const { color, textColor, shape, size, width, align } = section.style
  const label = text || '버튼'

  // 배경과 글자를 분리
  const buttonStyle: CSSProperties = color
    ? fillBackground(color)
    : { backgroundColor: 'var(--foreground)' }
  const labelStyle: CSSProperties = textColor ? fillText(textColor) : { color: 'var(--background)' }
  const buttonClass = cn(
    'inline-flex max-w-full items-center justify-center font-medium',
    SIZE_CLASS[size],
    SHAPE_CLASS[shape],
    WIDTH_CLASS[width],
  )
  const labelNode = (
    <span style={labelStyle} className="text-center break-words break-keep">
      {label}
    </span>
  )

  return (
    <div className={cn('flex', JUSTIFY_CLASS[align])}>
      {live ? (
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={buttonStyle}
            className={buttonClass}
          >
            {labelNode}
          </a>
        ) : (
          // 링크 없는 버튼도 공개에선 버튼처럼 보이게 하고 클릭은 무동작
          <button type="button" style={buttonStyle} className={cn(buttonClass, 'cursor-pointer')}>
            {labelNode}
          </button>
        )
      ) : (
        <span style={buttonStyle} className={buttonClass}>
          {labelNode}
        </span>
      )}
    </div>
  )
}

export default SectionButton
