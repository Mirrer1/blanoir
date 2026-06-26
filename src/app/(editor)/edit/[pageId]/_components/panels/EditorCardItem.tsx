'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ImagePlus, Upload, X } from 'lucide-react'

import { SORTABLE_TRANSITION } from '../../controlStyles'
import EditorTooltip from '../shell/EditorTooltip'
import EditorLinkField from './EditorLinkField'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { CardItem } from '@/types/section'

interface EditorCardItemProps {
  card: CardItem
  onPickImage: (id: string) => void
  onRemoveImage: (id: string) => void
  onTitleChange: (id: string, value: string) => void
  onDescriptionChange: (id: string, value: string) => void
  onLinkChange: (id: string, value: string) => void
  onRemoveCard: (id: string) => void
}

const EditorCardItem = ({
  card,
  onPickImage,
  onRemoveImage,
  onTitleChange,
  onDescriptionChange,
  onLinkChange,
  onRemoveCard,
}: EditorCardItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    transition: SORTABLE_TRANSITION,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'border-border bg-background flex flex-col gap-2 rounded-md border p-2',
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between">
        <EditorTooltip label="순서 변경">
          <button
            aria-label="순서 변경"
            className="text-muted-foreground hover:text-foreground flex size-6 cursor-grab items-center justify-center active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
        </EditorTooltip>
        <EditorTooltip label="카드 삭제">
          <button
            aria-label="카드 삭제"
            onClick={() => onRemoveCard(card.id)}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex size-6 cursor-pointer items-center justify-center rounded-md"
          >
            <X className="size-4" />
          </button>
        </EditorTooltip>
      </div>

      {card.image ? (
        <div className="bg-muted relative overflow-hidden rounded-md border">
          <img src={card.image} alt={card.alt} className="aspect-video w-full object-cover" />
          <div className="absolute top-1 right-1 flex gap-1">
            <EditorTooltip label="이미지 교체">
              <button
                aria-label="이미지 교체"
                onClick={() => onPickImage(card.id)}
                className="bg-background/80 text-foreground hover:bg-background flex size-6 cursor-pointer items-center justify-center rounded-md backdrop-blur"
              >
                <Upload className="size-3.5" />
              </button>
            </EditorTooltip>
            <EditorTooltip label="이미지 제거">
              <button
                aria-label="이미지 제거"
                onClick={() => onRemoveImage(card.id)}
                className="bg-background/80 text-foreground hover:bg-destructive/10 hover:text-destructive flex size-6 cursor-pointer items-center justify-center rounded-md backdrop-blur"
              >
                <X className="size-3.5" />
              </button>
            </EditorTooltip>
          </div>
        </div>
      ) : (
        <button
          onClick={() => onPickImage(card.id)}
          className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs transition-colors"
        >
          <ImagePlus className="size-4" />
          이미지 추가
        </button>
      )}

      <Input
        value={card.title}
        onChange={(e) => onTitleChange(card.id, e.target.value)}
        placeholder="카드 제목"
      />
      <Textarea
        value={card.description}
        onChange={(e) => onDescriptionChange(card.id, e.target.value)}
        placeholder="카드 설명"
        rows={2}
      />
      <EditorLinkField
        value={card.link ?? ''}
        resetKey={card.id}
        onChange={(value) => onLinkChange(card.id, value)}
      />
    </div>
  )
}

export default EditorCardItem
