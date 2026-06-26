'use client'

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'

import EditorSection from '../sections/EditorSection'
import EditorSectionContent from '../sections/EditorSectionContent'
import AddSectionMenu from './AddSectionMenu'
import EditorEmptyState from './EditorEmptyState'
import SectionInsert from './SectionInsert'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'

const EditorCanvas = ({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) => {
  const sections = useEditorStore((s) => s.sections)
  const selectSection = useEditorStore((s) => s.selectSection)
  const moveSection = useEditorStore((s) => s.moveSection)

  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const activeSection = sections.find((section) => section.id === activeId) ?? null

  // 섹션 추가 시 새 섹션으로 스크롤
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = scrollRef.current
        if (el) {
          el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
        }
      })
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }
    const from = sections.findIndex((section) => section.id === active.id)
    const to = sections.findIndex((section) => section.id === over.id)
    if (from !== -1 && to !== -1) {
      moveSection(from, to)
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  // 캔버스 빈 영역 클릭만 선택 해제
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.currentTarget.contains(e.target as Node)) {
      selectSection(null)
    }
  }

  return (
    <div
      ref={scrollRef}
      className="canvas-light bg-background text-foreground flex-1 overflow-x-hidden overflow-y-auto"
      onClick={handleBackgroundClick}
    >
      <div className="min-h-full">
        {sections.length === 0 ? (
          <EditorEmptyState />
        ) : (
          <DndContext
            id="editor-canvas"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={sections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              <div>
                {sections.map((section, i) => (
                  <div key={section.id} className="relative">
                    {i > 0 && <SectionInsert index={i} />}
                    <EditorSection section={section} index={i} />
                  </div>
                ))}
              </div>
            </SortableContext>
            <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2">
              <div className="bg-border h-px flex-1" />
              <AddSectionMenu onAdded={scrollToBottom} />
              <div className="bg-border h-px flex-1" />
            </div>
            <DragOverlay dropAnimation={null}>
              {activeSection ? (
                <div
                  className={cn(
                    'mx-auto w-full max-w-5xl cursor-grabbing rounded-md py-2 opacity-50',
                    activeSection.type === 'spacer' ? 'bg-muted' : 'bg-background',
                    !['image', 'gallery', 'card', 'columns'].includes(activeSection.type) && 'px-3',
                  )}
                >
                  <EditorSectionContent section={activeSection} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  )
}

export default EditorCanvas
