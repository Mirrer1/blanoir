import type { CSSProperties } from 'react'

import { fontFamilyOf } from '@/lib/fontOptions'
import { cn } from '@/lib/utils'
import type { TextStyle } from '@/types/section'

export const ALIGN_CLASS = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const

// 표시, 편집, 미러가 같은 타이포로 보이도록 공유하는 순수 타이포 클래스
export const textTypoClass = (style: TextStyle, sizeClass: string, leadingClass: string) =>
  cn(
    sizeClass,
    ALIGN_CLASS[style.align],
    style.bold ? 'font-bold' : 'font-normal',
    style.italic && 'italic',
    leadingClass,
    'min-w-0 break-words whitespace-pre-wrap',
  )

export const textInlineStyle = (style: TextStyle): CSSProperties => ({
  fontFamily: fontFamilyOf(style.font),
  ...(style.color ? { color: style.color } : {}),
})

interface SectionTextViewProps {
  text: string
  style: TextStyle
  sizeClass: string
  leadingClass: string
  tag: 'h1' | 'h2' | 'h3' | 'p'
  placeholder?: string // 에디터에서만 빈 값일 때 안내 문구로 사용
  className?: string
}

const SectionTextView = ({
  text,
  style,
  sizeClass,
  leadingClass,
  tag: Tag,
  placeholder,
  className,
}: SectionTextViewProps) => {
  const showPlaceholder = !text && placeholder

  return (
    <Tag
      style={textInlineStyle(style)}
      className={cn(
        textTypoClass(style, sizeClass, leadingClass),
        showPlaceholder && 'text-muted-foreground/40',
        className,
      )}
    >
      {text || placeholder}
    </Tag>
  )
}

export default SectionTextView
