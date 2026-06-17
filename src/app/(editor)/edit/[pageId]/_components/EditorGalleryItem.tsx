'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Upload, X } from 'lucide-react'

import EditorTooltip from './EditorTooltip'
import { cn } from '@/lib/utils'

interface EditorGalleryItemProps {
  url: string
  onReplace: (url: string) => void
  onRemove: (url: string) => void
}

const EditorGalleryItem = ({ url, onReplace, onRemove }: EditorGalleryItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: url,
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
      <img src={url} alt="" className="size-9 shrink-0 rounded object-cover" />
      <EditorTooltip label="이미지 교체">
        <button
          aria-label="이미지 교체"
          onClick={() => onReplace(url)}
          className="text-muted-foreground hover:bg-muted hover:text-foreground ml-auto flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md"
        >
          <Upload className="size-4" />
        </button>
      </EditorTooltip>
      <EditorTooltip label="이미지 제거">
        <button
          aria-label="이미지 제거"
          onClick={() => onRemove(url)}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md"
        >
          <X className="size-4" />
        </button>
      </EditorTooltip>
    </div>
  )
}

export default EditorGalleryItem
