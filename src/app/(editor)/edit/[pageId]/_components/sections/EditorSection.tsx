'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, GripVertical, Loader, RotateCcw, Trash2 } from 'lucide-react'
import { useCallback, useRef } from 'react'
import { toast } from 'sonner'

import { COLOR_TRANSITION, SORTABLE_TRANSITION } from '../../controlStyles'
import EditorSectionContent from './EditorSectionContent'
import { copyImages, deleteImage } from '@/actions/upload'
import SectionReveal from '@/components/sections/SectionReveal'
import useDualPanel from '@/hooks/useDualPanel'
import { cn } from '@/lib/utils'
import useEditorStore, { cloneSection, getEditorStore } from '@/store/editor'
import type { Section } from '@/types/section'
import { containerBackground } from '@/utils/colorFill'
import { sectionImageUrls } from '@/utils/imageUrls'

const EditorSection = ({ section, index }: { section: Section; index: number }) => {
  const panelTab = useEditorStore((s) => s.panelTab)
  const selectSection = useEditorStore((s) => s.selectSection)
  const removeSection = useEditorStore((s) => s.removeSection)
  const restoreSection = useEditorStore((s) => s.restoreSection)
  const insertSection = useEditorStore((s) => s.insertSection)
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId)
  const updateSectionContainer = useEditorStore((s) => s.updateSectionContainer)
  const remapSectionImages = useEditorStore((s) => s.remapSectionImages)
  const setCopying = useEditorStore((s) => s.setCopying)
  const isCopying = useEditorStore((s) => s.copyingSectionIds.includes(section.id))

  const outerRef = useRef<HTMLDivElement>(null)
  const columnRef = useRef<HTMLDivElement>(null)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isSorting } =
    useSortable({
      id: section.id,
      transition: SORTABLE_TRANSITION,
    })

  const wide = useDualPanel()
  const isSelected = selectedSectionId === section.id
  const ownsSelection =
    section.type === 'columns' &&
    section.content.columns.some((col) => col.some((child) => child.id === selectedSectionId))
  const backgroundSelected = (isSelected || ownsSelection) && panelTab === 'background'
  const isEmptyMedia =
    (section.type === 'image' && !section.content.src) ||
    (section.type === 'gallery' && section.content.images.length === 0) ||
    (section.type === 'card' && section.content.cards.length === 0)

  // dnd-kit ref와 높이 측정용 ref를 같은 노드에 연결
  const setSectionRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node)
      outerRef.current = node
    },
    [setNodeRef],
  )

  // 클릭한 영역에 맞는 탭으로 패널 열기
  const handleBackgroundClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectSection(section.id, 'background')
  }

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectSection(section.id, 'content')
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
      // 공유 중인 URL은 삭제 제외
      const stillUsed = new Set(getEditorStore().getState().sections.flatMap(sectionImageUrls))
      sectionImageUrls(removed).forEach((url) => {
        if (!stillUsed.has(url)) {
          void deleteImage(url)
        }
      })
    }
    removeSection(removed.id)
    toast('섹션을 삭제했어요', {
      icon: <Trash2 className="size-4" />,
      duration: 4000,
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

  // 복제 후 이미지는 백그라운드 복사
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    const clone = cloneSection(section)
    const scrollToClone = () =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          document
            .querySelector(`[data-section-id="${clone.id}"]`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }),
      )
    const urls = [...new Set(sectionImageUrls(clone))]
    if (urls.length === 0) {
      restoreSection(clone, index + 1)
      scrollToClone()
      return
    }
    // 이미지 복제 후 패널 열기
    insertSection(clone, index + 1)
    selectSection(null)
    scrollToClone()
    setCopying(clone.id, true)
    void (async () => {
      const copied = await copyImages(urls)
      const state = getEditorStore().getState()
      if (state.sections.some((s) => s.id === clone.id)) {
        remapSectionImages(clone.id, new Map(copied.map((c) => [c.from, c.to])))
        // 선택 비어 있으면 복제본 열기
        if (state.selectedSectionId === null) {
          selectSection(clone.id, 'content')
        }
      } else {
        // 도중 삭제됐으면 새 이미지 정리
        copied.forEach((c) => void deleteImage(c.to))
      }
      setCopying(clone.id, false)
    })()
  }

  // 패널 액션 컨트롤 버튼
  const controls = (
    <>
      <button
        aria-label="순서 변경"
        className="text-muted-foreground hover:bg-muted flex size-7 cursor-grab items-center justify-center rounded-md active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <button
        aria-label="복제"
        onClick={handleDuplicate}
        className="text-muted-foreground hover:bg-muted flex size-7 cursor-pointer items-center justify-center rounded-md"
      >
        <Copy className="size-4" />
      </button>
      <button
        aria-label="삭제"
        onClick={handleRemove}
        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex size-7 cursor-pointer items-center justify-center rounded-md"
      >
        <Trash2 className="size-4" />
      </button>
    </>
  )

  return (
    <SectionReveal animation={section.container?.animation}>
      <div
        ref={setSectionRef}
        data-section-id={section.id}
        onClick={handleBackgroundClick}
        style={{
          ...containerBackground(section),
          minHeight: section.container?.height,
          transform: CSS.Transform.toString(transform),
          transition: transition ? `${transition}, ${COLOR_TRANSITION}` : COLOR_TRANSITION,
        }}
        className={cn(
          'group relative flex cursor-pointer flex-col justify-center py-2',
          !isSorting && !isEmptyMedia && 'hover:bg-muted has-[[data-content]:hover]:bg-transparent',
          backgroundSelected && !isEmptyMedia && 'ring-foreground/20 ring-2 ring-inset',
          isDragging && 'opacity-0',
        )}
      >
        <div
          ref={columnRef}
          data-content
          onClick={handleContentClick}
          className={cn(
            'relative mx-auto w-full rounded-md transition-colors',
            !wide && selectedSectionId !== null ? 'max-w-[min(64rem,100%-14rem)]' : 'max-w-5xl',
            section.type === 'columns' ? 'py-2' : 'p-2',
            !isEmptyMedia &&
              section.type !== 'columns' &&
              (isSelected && panelTab === 'content'
                ? 'ring-foreground/20 ring-2 ring-inset'
                : !isSorting && 'hover:bg-muted'),
          )}
        >
          <EditorSectionContent
            section={section}
            isSelected={isSelected && panelTab === 'content'}
          />
          {isCopying && (
            <div className="bg-background/60 text-muted-foreground pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-md backdrop-blur-[1px]">
              <Loader className="size-6 animate-spin" />
            </div>
          )}
          {wide && (
            <div
              className={cn(
                'absolute top-1/2 right-0 z-10 flex translate-x-[calc(100%+0.375rem)] -translate-y-1/2 gap-0.5 transition-opacity',
                isSelected
                  ? 'opacity-100'
                  : 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100',
              )}
            >
              {controls}
            </div>
          )}
        </div>
        {!wide && (
          <div
            className={cn(
              'absolute top-1/2 right-4 z-10 flex w-fit -translate-y-1/2 gap-0.5 transition-opacity',
              isSelected
                ? 'opacity-100'
                : 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100',
            )}
          >
            {controls}
          </div>
        )}
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
