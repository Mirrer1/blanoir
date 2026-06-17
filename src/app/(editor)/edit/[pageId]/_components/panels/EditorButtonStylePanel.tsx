'use client'

import { SEG_BASE, SEG_OFF, SEG_ON } from '../../controlStyles'
import EditorAlignField from './EditorAlignField'
import EditorColorField from './EditorColorField'
import EditorStyleField from './EditorStyleField'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { ButtonSection, ButtonShape, ButtonSize, ButtonWidth } from '@/types/section'

const SIZE_OPTIONS: { value: ButtonSize; label: string }[] = [
  { value: 'small', label: '작게' },
  { value: 'medium', label: '보통' },
  { value: 'large', label: '크게' },
]
const WIDTH_OPTIONS: { value: ButtonWidth; label: string }[] = [
  { value: 'auto', label: '자동' },
  { value: 'wide', label: '넓게' },
  { value: 'full', label: '전체' },
]
const SHAPE_OPTIONS: { value: ButtonShape; label: string }[] = [
  { value: 'square', label: '사각' },
  { value: 'rounded', label: '둥근' },
]

const EditorButtonStylePanel = ({ section }: { section: ButtonSection }) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const updateSectionStyle = useEditorStore((s) => s.updateSectionStyle)
  const { text, url } = section.content
  const { color, textColor, shape, size, width, align } = section.style

  return (
    <>
      <EditorStyleField label="텍스트">
        <Input
          value={text}
          onChange={(e) => updateSectionContent(section.id, { text: e.target.value })}
          placeholder="버튼"
        />
      </EditorStyleField>

      <EditorStyleField label="링크 URL">
        <Input
          type="url"
          value={url}
          onChange={(e) => updateSectionContent(section.id, { url: e.target.value })}
          placeholder="https://example.com"
        />
      </EditorStyleField>

      <EditorStyleField label="크기">
        <div className="flex gap-1">
          {SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { size: option.value })}
              className={cn(SEG_BASE, 'flex-1', size === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorStyleField label="너비">
        <div className="flex gap-1">
          {WIDTH_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { width: option.value })}
              className={cn(SEG_BASE, 'flex-1', width === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorAlignField
        align={align}
        onChange={(value) => updateSectionStyle(section.id, { align: value })}
      />

      <EditorStyleField label="모양">
        <div className="flex gap-1">
          {SHAPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { shape: option.value })}
              className={cn(SEG_BASE, 'flex-1', shape === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorColorField
        label="배경 색상"
        color={color}
        onChange={(value) => updateSectionStyle(section.id, { color: value })}
      />

      <EditorColorField
        label="글자 색상"
        color={textColor}
        defaultColor="var(--background)"
        onChange={(value) => updateSectionStyle(section.id, { textColor: value })}
      />
    </>
  )
}

export default EditorButtonStylePanel
