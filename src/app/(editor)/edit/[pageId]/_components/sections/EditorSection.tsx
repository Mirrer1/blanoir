'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, RotateCcw, Trash2 } from 'lucide-react'
import { useCallback, useRef } from 'react'
import { toast } from 'sonner'

import { COLOR_TRANSITION, SORTABLE_TRANSITION } from '../../controlStyles'
import EditorSectionContent from './EditorSectionContent'
import { deleteImage } from '@/actions/upload'
import SectionReveal from '@/components/sections/SectionReveal'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { Section } from '@/types/section'
import { containerBackground } from '@/utils/colorFill'
import { sectionImageUrls } from '@/utils/imageUrls'

const EditorSection = ({ section, index }: { section: Section; index: number }) => {
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId)
  const selectSection = useEditorStore((s) => s.selectSection)
  const removeSection = useEditorStore((s) => s.removeSection)
  const restoreSection = useEditorStore((s) => s.restoreSection)
  const updateSectionContainer = useEditorStore((s) => s.updateSectionContainer)
  const isSelected = selectedSectionId === section.id

  const outerRef = useRef<HTMLDivElement>(null)
  const columnRef = useRef<HTMLDivElement>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isSorting } =
    useSortable({
      id: section.id,
      transition: SORTABLE_TRANSITION,
    })

  // dnd-kit ref와 높이 측정용 ref를 같은 노드에 연결
  const setSectionRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node)
      outerRef.current = node
    },
    [setNodeRef],
  )

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectSection(section.id)
  }

  // 콘텐츠 칸은 그대로 두고 바깥 컨테이너만 증가
  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const outer = outerRef.current
    const column = columnRef.current
    if (!outer || !column) {
      return
    }
    const startY = e.clientY
    const startHeight = outer.offsetHeight
    const minHeight = column.offsetHeight
    const onMove = (ev: PointerEvent) => {
      const next = Math.max(minHeight, Math.round(startHeight + ev.clientY - startY))
      updateSectionContainer(section.id, { height: next })
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  // 삭제는 즉시 실행한 뒤 실행취소 토스트
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    const removed = section
    const at = index
    let undone = false
    let cleaned = false
    const cleanup = () => {
      if (undone || cleaned) {
        return
      }
      cleaned = true
      sectionImageUrls(removed).forEach((url) => void deleteImage(url))
    }
    removeSection(removed.id)
    toast('섹션을 삭제했어요', {
      icon: <Trash2 className="size-4" />,
      duration: 5000,
      action: {
        label: (
          <span className="flex items-center gap-1.5">
            <RotateCcw className="size-3.5" />
            실행취소
          </span>
        ),
        onClick: () => {
          undone = true
          restoreSection(removed, at)
        },
      },
      onAutoClose: cleanup,
      onDismiss: cleanup,
    })
  }

  return (
    <SectionReveal animation={section.container?.animation}>
      <div
        ref={setSectionRef}
        onClick={handleClick}
        style={{
          ...containerBackground(section),
          minHeight: section.container?.height,
          transform: CSS.Transform.toString(transform),
          transition: transition ? `${transition}, ${COLOR_TRANSITION}` : COLOR_TRANSITION,
        }}
        className={cn(
          'group relative flex cursor-pointer flex-col justify-center py-2',
          isDragging && 'opacity-0',
        )}
      >
        <div
          ref={columnRef}
          className={cn(
            'relative mx-auto w-full max-w-5xl rounded-md px-3 py-2 transition-colors',
            isSelected ? 'ring-foreground/20 ring-2 ring-inset' : !isSorting && 'hover:bg-muted/40',
          )}
        >
          <div
            className={cn(
              'absolute top-1/2 right-0 z-10 flex translate-x-[calc(100%+0.375rem)] -translate-y-1/2 gap-0.5 opacity-0 transition-opacity',
              isSelected
                ? 'opacity-100'
                : 'pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100',
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
          <EditorSectionContent section={section} isSelected={isSelected} />
        </div>
        <button
          type="button"
          onPointerDown={handleResizeStart}
          aria-label="높이 조절"
          className={cn(
            'text-foreground/40 hover:text-foreground/70 absolute right-1 bottom-1 z-10 flex size-3.5 cursor-ns-resize items-center justify-center opacity-0 transition-opacity',
            isSelected ? 'opacity-100' : 'pointer-events-none',
          )}
        >
          <svg
            viewBox="0 0 10 10"
            className="size-full"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          >
            <path d="M9 3 3 9M9 7 7 9" />
          </svg>
        </button>
      </div>
    </SectionReveal>
  )
}

export default EditorSection
