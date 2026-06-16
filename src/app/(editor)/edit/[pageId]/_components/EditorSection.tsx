'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'

import SectionDivider from './SectionDivider'
import SectionParagraph from './SectionParagraph'
import SectionTitle from './SectionTitle'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { Section } from '@/types/section'

const EditorSection = ({ section }: { section: Section }) => {
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId)
  const selectSection = useEditorStore((s) => s.selectSection)
  const removeSection = useEditorStore((s) => s.removeSection)
  const isSelected = selectedSectionId === section.id

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  })

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectSection(section.id)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeSection(section.id)
  }

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group relative cursor-pointer rounded-md px-3 py-2 transition-colors',
        isSelected ? 'ring-foreground/20 ring-2' : 'hover:bg-muted/40',
        isDragging && 'opacity-50',
      )}
    >
      <div
        className={cn(
          'absolute top-1.5 right-0 z-10 flex translate-x-[calc(100%+0.375rem)] gap-0.5 opacity-0 transition-opacity group-hover:opacity-100',
          isSelected && 'opacity-100',
        )}
      >
        <button
          aria-label="순서 변경"
          className="text-muted-foreground hover:bg-muted flex size-7 cursor-grab items-center justify-center rounded-md active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <button
          aria-label="삭제"
          onClick={handleRemove}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex size-7 cursor-pointer items-center justify-center rounded-md"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      {section.type === 'title' && <SectionTitle section={section} isSelected={isSelected} />}
      {section.type === 'paragraph' && (
        <SectionParagraph section={section} isSelected={isSelected} />
      )}
      {section.type === 'divider' && <SectionDivider section={section} />}
    </div>
  )
}

export default EditorSection
