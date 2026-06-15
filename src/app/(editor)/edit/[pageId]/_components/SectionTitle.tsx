'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { TitleSection } from '@/types/section'

const TITLE_TAG = { xlarge: 'h1', large: 'h2', medium: 'h3', small: 'p' } as const
const SIZE_CLASS = {
  xlarge: 'text-4xl sm:text-5xl',
  large: 'text-3xl sm:text-4xl',
  medium: 'text-2xl',
  small: 'text-lg',
} as const
const ALIGN_CLASS = { left: 'text-left', center: 'text-center', right: 'text-right' } as const

const PLACEHOLDER = '제목을 입력하세요'

const resize = (el: HTMLTextAreaElement) => {
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

interface SectionTitleProps {
  section: TitleSection
  isSelected: boolean
}

const SectionTitle = ({ section, isSelected }: SectionTitleProps) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { text } = section.content
  const { size, align, bold, italic, color } = section.style

  const typoClass = cn(
    SIZE_CLASS[size],
    ALIGN_CLASS[align],
    bold ? 'font-bold' : 'font-normal',
    italic && 'italic',
    'leading-tight tracking-tight',
  )
  const colorStyle = color ? { color } : undefined
  const Tag = TITLE_TAG[size]

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSectionContent(section.id, { text: e.target.value })
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
  }, [isSelected, size])

  return (
    <>
      {isSelected ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          rows={1}
          placeholder={PLACEHOLDER}
          style={colorStyle}
          className={cn(
            typoClass,
            'placeholder:text-muted-foreground/40 w-full resize-none overflow-hidden bg-transparent outline-none',
          )}
        />
      ) : (
        <Tag style={colorStyle} className={cn(typoClass, !text && 'text-muted-foreground/40')}>
          {text || PLACEHOLDER}
        </Tag>
      )}
    </>
  )
}

export default SectionTitle
