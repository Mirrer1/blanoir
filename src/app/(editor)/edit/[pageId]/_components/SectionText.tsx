'use client'

import { useEffect, useRef } from 'react'

import { fontFamilyOf } from '@/lib/fontOptions'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { TextStyle } from '@/types/section'

const ALIGN_CLASS = { left: 'text-left', center: 'text-center', right: 'text-right' } as const

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
  tag: Tag,
  placeholder,
}: SectionTextProps) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { align, bold, italic, color, font } = style

  const typoClass = cn(
    sizeClass,
    ALIGN_CLASS[align],
    bold ? 'font-bold' : 'font-normal',
    italic && 'italic',
    leadingClass,
    'col-start-1 row-start-1 min-w-0 break-words whitespace-pre-wrap',
  )
  const textStyle = { fontFamily: fontFamilyOf(font), ...(color ? { color } : {}) }
  const mirrorText = `${text || placeholder} `

  // 선택되면 편집 textarea로 포커스 이동
  useEffect(() => {
    const el = textareaRef.current
    if (isSelected && el) {
      el.focus()
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
          style={textStyle}
          className={cn(
            typoClass,
            'placeholder:text-muted-foreground/40 resize-none border-0 bg-transparent p-0 outline-none',
          )}
        />
      ) : (
        <Tag style={textStyle} className={cn(typoClass, !text && 'text-muted-foreground/40')}>
          {text || placeholder}
        </Tag>
      )}
    </div>
  )
}

export default SectionText
