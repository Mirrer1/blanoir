'use client'

import { SEG_BASE, SEG_OFF, SEG_ON } from '../controlStyles'
import EditorAlignField from './EditorAlignField'
import EditorStyleField from './EditorStyleField'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { ImageSection, ImageShape, ImageSize } from '@/types/section'

const SIZE_OPTIONS: { value: ImageSize; label: string }[] = [
  { value: 'small', label: '작게' },
  { value: 'medium', label: '보통' },
  { value: 'large', label: '크게' },
]
const SHAPE_OPTIONS: { value: ImageShape; label: string }[] = [
  { value: 'square', label: '사각' },
  { value: 'rounded', label: '둥근' },
  { value: 'circle', label: '원형' },
]

const EditorImageStylePanel = ({ section }: { section: ImageSection }) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const updateSectionStyle = useEditorStore((s) => s.updateSectionStyle)
  const { alt } = section.content
  const { size, shape, align } = section.style

  return (
    <>
      <EditorStyleField label="대체 텍스트">
        <Input
          value={alt}
          onChange={(e) => updateSectionContent(section.id, { alt: e.target.value })}
          placeholder="이미지 설명"
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

      <EditorAlignField
        align={align}
        onChange={(value) => updateSectionStyle(section.id, { align: value })}
      />
    </>
  )
}

export default EditorImageStylePanel
