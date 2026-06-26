'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'

import { SORTABLE_TRANSITION } from '../../controlStyles'
import EditorTooltip from '../shell/EditorTooltip'
import { cn } from '@/lib/utils'

interface EditorColumnItemProps {
  id: string
  order: number
  label: string
  onRemove?: () => void // 빈 칸엔 비울 게 없어 생략
}

const EditorColumnItem = ({ id, order, label, onRemove }: EditorColumnItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    transition: SORTABLE_TRANSITION,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'border-border bg-background flex items-center gap-2 rounded-md border p-1.5',
        isDragging && 'opacity-50',
      )}
    >
      <EditorTooltip label="순서 변경">
        <button
          aria-label="순서 변경"
          className="text-muted-foreground hover:text-foreground flex size-6 shrink-0 cursor-grab items-center justify-center active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </EditorTooltip>
      <span className="text-muted-foreground mt-0.5 text-xs">{order}</span>
      <span className="mb-px text-sm">{label}</span>
      {onRemove && (
        <EditorTooltip label="블록 비우기">
          <button
            aria-label="블록 비우기"
            onClick={onRemove}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive ml-auto flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md"
          >
            <X className="size-4" />
          </button>
        </EditorTooltip>
      )}
    </div>
  )
}

export default EditorColumnItem
