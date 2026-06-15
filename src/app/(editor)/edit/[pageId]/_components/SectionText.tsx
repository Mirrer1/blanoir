'use client'

import { useEffect, useRef } from 'react'

import { fontFamilyOf } from '@/lib/fontOptions'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { TextStyle } from '@/types/section'

const ALIGN_CLASS = { left: 'text-left', center: 'text-center', right: 'text-right' } as const

const resize = (el: HTMLTextAreaElement) => {
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

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
  )
  const textStyle = { fontFamily: fontFamilyOf(font), ...(color ? { color } : {}) }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSectionContent(sectionId, { text: e.target.value })
    resize(e.target)
  }

  // 선택되면 편집 textarea로 포커스 이동
  useEffect(() => {
    const el = textareaRef.current
    if (isSelected && el) {
      el.focus()
      el.setSelectionRange(el.value.length, el.value.length)
    }
  }, [isSelected])

  // 선택 직후·크기 변경 시 높이 재계산
  useEffect(() => {
    const el = textareaRef.current
    if (isSelected && el) {
      resize(el)
    }
  }, [isSelected, sizeClass])

  return (
    <>
      {isSelected ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          rows={1}
          placeholder={placeholder}
          style={textStyle}
          className={cn(
            typoClass,
            'placeholder:text-muted-foreground/40 w-full resize-none overflow-hidden bg-transparent outline-none',
          )}
        />
      ) : (
        <Tag
          style={textStyle}
          className={cn(typoClass, 'whitespace-pre-wrap', !text && 'text-muted-foreground/40')}
        >
          {text || placeholder}
        </Tag>
      )}
    </>
  )
}

export default SectionText
