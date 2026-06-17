'use client'

import { SEG_BASE, SEG_OFF, SEG_ON } from '../../controlStyles'
import EditorStyleField from './EditorStyleField'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { SpacerSection, SpacerSize } from '@/types/section'

const SIZE_OPTIONS: { value: SpacerSize; label: string }[] = [
  { value: 'small', label: '작게' },
  { value: 'medium', label: '보통' },
  { value: 'large', label: '크게' },
]

const EditorSpacerStylePanel = ({ section }: { section: SpacerSection }) => {
  const updateSectionStyle = useEditorStore((s) => s.updateSectionStyle)
  const { size } = section.style

  return (
    <EditorStyleField label="높이">
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
  )
}

export default EditorSpacerStylePanel
