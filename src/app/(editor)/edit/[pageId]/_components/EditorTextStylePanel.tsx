'use client'

import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, type LucideIcon } from 'lucide-react'

import EditorColorField from './EditorColorField'
import EditorStyleField from './EditorStyleField'
import { ICON_BASE, SEG_BASE, SEG_OFF, SEG_ON } from './editorControlStyles'
import { FONT_OPTIONS } from '@/lib/fontOptions'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { ParagraphSection, TextAlign, TextSize, TitleSection } from '@/types/section'

const SIZE_OPTIONS: { value: TextSize; label: string }[] = [
  { value: 'small', label: '작게' },
  { value: 'medium', label: '보통' },
  { value: 'large', label: '크게' },
  { value: 'xlarge', label: '매우 크게' },
]
const ALIGN_OPTIONS: { value: TextAlign; icon: LucideIcon; label: string }[] = [
  { value: 'left', icon: AlignLeft, label: '왼쪽 정렬' },
  { value: 'center', icon: AlignCenter, label: '가운데 정렬' },
  { value: 'right', icon: AlignRight, label: '오른쪽 정렬' },
]

const EditorTextStylePanel = ({ section }: { section: TitleSection | ParagraphSection }) => {
  const updateSectionStyle = useEditorStore((s) => s.updateSectionStyle)
  const { size, align, bold, italic, color, font } = section.style

  return (
    <>
      <EditorStyleField label="폰트">
        <div className="grid grid-cols-2 gap-1">
          {FONT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { font: option.value })}
              style={{ fontFamily: option.cssVar }}
              className={cn(SEG_BASE, font === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorStyleField label="크기">
        <div className="grid grid-cols-2 gap-1">
          {SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { size: option.value })}
              className={cn(SEG_BASE, size === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorStyleField label="정렬">
        <div className="flex gap-1">
          {ALIGN_OPTIONS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              aria-label={label}
              onClick={() => updateSectionStyle(section.id, { align: value })}
              className={cn(ICON_BASE, align === value ? SEG_ON : SEG_OFF)}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorStyleField label="강조">
        <div className="flex gap-1">
          <button
            aria-label="굵게"
            onClick={() => updateSectionStyle(section.id, { bold: !bold })}
            className={cn(ICON_BASE, bold ? SEG_ON : SEG_OFF)}
          >
            <Bold className="size-4" />
          </button>
          <button
            aria-label="기울임"
            onClick={() => updateSectionStyle(section.id, { italic: !italic })}
            className={cn(ICON_BASE, italic ? SEG_ON : SEG_OFF)}
          >
            <Italic className="size-4" />
          </button>
        </div>
      </EditorStyleField>

      <EditorColorField
        label="색상"
        color={color}
        onChange={(value) => updateSectionStyle(section.id, { color: value })}
      />
    </>
  )
}

export default EditorTextStylePanel
