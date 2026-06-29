'use client'

import { useEffect, useRef } from 'react'

import SectionTextView, {
  textInlineStyle,
  textTypoClass,
} from '@/components/sections/SectionTextView'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { TextStyle } from '@/types/section'
import { isGradient } from '@/utils/colorFill'

// 미러, textarea, 표시를 같은 그리드 셀에 겹쳐 선택을 바꿀 때 레이아웃 시프트를 없앰
const CELL = 'col-start-1 row-start-1'

interface SectionTextProps {
  sectionId: string
  text: string
  isSelected: boolean
  style: TextStyle
  sizeClass: string
  leadingClass: string
  tag: 'h1' | 'h2' | 'h3' | 'p'
  placeholder: string
}

const SectionText = ({
  sectionId,
  text,
  isSelected,
  style,
  sizeClass,
  leadingClass,
  tag,
  placeholder,
}: SectionTextProps) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const typoClass = cn(textTypoClass(style, sizeClass, leadingClass), CELL)
  const textStyle = textInlineStyle(style)
  const editStyle = isGradient(style.color)
    ? { ...textStyle, caretColor: 'var(--foreground)' }
    : textStyle
  const mirrorText = `${text || placeholder} `

  // 선택되면 편집 textarea로 포커스 이동
  useEffect(() => {
    const el = textareaRef.current
    if (isSelected && el) {
      el.focus({ preventScroll: true })
      el.setSelectionRange(el.value.length, el.value.length)
    }
  }, [isSelected])

  return (
    <div className="grid grid-cols-1">
      <div aria-hidden style={textStyle} className={cn(typoClass, 'invisible')}>
        {mirrorText}
      </div>
      {isSelected ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => updateSectionContent(sectionId, { text: e.target.value })}
          rows={1}
          placeholder={placeholder}
          style={editStyle}
          className={cn(
            typoClass,
            'text-foreground placeholder:text-muted-foreground/40 resize-none border-0 bg-transparent p-0 outline-none',
            '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
          )}
        />
      ) : (
        <SectionTextView
          text={text}
          style={style}
          sizeClass={sizeClass}
          leadingClass={leadingClass}
          tag={tag}
          placeholder={placeholder}
          className={CELL}
        />
      )}
    </div>
  )
}

export default SectionText
