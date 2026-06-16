'use client'

import { SEG_BASE, SEG_OFF, SEG_ON } from '../controlStyles'
import EditorColorField from './EditorColorField'
import EditorStyleField from './EditorStyleField'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { DividerSection, DividerThickness, DividerVariant } from '@/types/section'

const VARIANT_OPTIONS: { value: DividerVariant; label: string }[] = [
  { value: 'solid', label: '실선' },
  { value: 'dashed', label: '파선' },
  { value: 'dotted', label: '점선' },
]
const THICKNESS_OPTIONS: { value: DividerThickness; label: string }[] = [
  { value: 'thin', label: '얇게' },
  { value: 'medium', label: '보통' },
  { value: 'thick', label: '굵게' },
]

const EditorDividerStylePanel = ({ section }: { section: DividerSection }) => {
  const updateSectionStyle = useEditorStore((s) => s.updateSectionStyle)
  const { variant, thickness, color } = section.style

  return (
    <>
      <EditorStyleField label="모양">
        <div className="flex gap-1">
          {VARIANT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { variant: option.value })}
              className={cn(SEG_BASE, 'flex-1', variant === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorStyleField label="두께">
        <div className="flex gap-1">
          {THICKNESS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { thickness: option.value })}
              className={cn(SEG_BASE, 'flex-1', thickness === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
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

export default EditorDividerStylePanel
