'use client'

import SectionTitle from './SectionTitle'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { Section } from '@/types/section'

const EditorSection = ({ section }: { section: Section }) => {
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId)
  const selectSection = useEditorStore((s) => s.selectSection)
  const isSelected = selectedSectionId === section.id

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectSection(section.id)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'cursor-pointer rounded-md px-3 py-2 transition-colors',
        isSelected ? 'ring-foreground/20 ring-2' : 'hover:bg-muted/40',
      )}
    >
      {section.type === 'title' && <SectionTitle section={section} isSelected={isSelected} />}
    </div>
  )
}

export default EditorSection
