import type { CSSProperties } from 'react'

import { fontFamilyOf } from '@/lib/fontOptions'
import { cn } from '@/lib/utils'
import type { TextStyle } from '@/types/section'
import { fillText } from '@/utils/colorFill'

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
  ...(style.color ? fillText(style.color) : {}),
})

interface SectionTextViewProps {
  text: string
  style: TextStyle
  sizeClass: string
  leadingClass: string
  tag: 'h1' | 'h2' | 'h3' | 'p'
  placeholder?: string // 에디터에서만 빈 값일 때 안내 문구로 사용
  className?: string
  link?: string // 텍스트 전체를 감싸는 링크 URL
  live?: boolean // 공개와 미리보기에서만 링크 동작
}

const SectionTextView = ({
  text,
  style,
  sizeClass,
  leadingClass,
  tag: Tag,
  placeholder,
  className,
  link,
  live,
}: SectionTextViewProps) => {
  const showPlaceholder = !text && placeholder
  // 링크는 공개와 미리보기이고 텍스트가 있을 때만 동작
  const linked = !!live && !!link && !!text

  return (
    <Tag
      style={textInlineStyle(style)}
      className={cn(
        textTypoClass(style, sizeClass, leadingClass),
        showPlaceholder && 'text-muted-foreground/40',
        className,
      )}
    >
      {linked ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ) : (
        text || placeholder
      )}
    </Tag>
  )
}

export default SectionTextView
