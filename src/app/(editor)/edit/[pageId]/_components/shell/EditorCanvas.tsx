'use client'

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useRef } from 'react'

import EditorSection from '../sections/EditorSection'
import AddSectionMenu from './AddSectionMenu'
import EditorEmptyState from './EditorEmptyState'
import SectionInsert from './SectionInsert'
import useEditorStore from '@/store/editor'

const EditorCanvas = () => {
  const sections = useEditorStore((s) => s.sections)
  const selectSection = useEditorStore((s) => s.selectSection)
  const moveSection = useEditorStore((s) => s.moveSection)

  const scrollRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

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

  const handleDragEnd = (event: DragEndEvent) => {
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

  return (
    <div
      ref={scrollRef}
      className="canvas-light bg-background text-foreground flex-1 [scrollbar-gutter:stable] overflow-y-auto"
      onClick={() => selectSection(null)}
    >
      <div className="mx-auto min-h-full max-w-3xl px-6 py-16">
        {sections.length === 0 ? (
          <EditorEmptyState />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              <div>
                {sections.map((section, i) => (
                  <div key={section.id}>
                    <SectionInsert index={i} />
                    <EditorSection section={section} />
                  </div>
                ))}
              </div>
            </SortableContext>
            <div className="flex justify-center pt-4">
              <AddSectionMenu onAdded={scrollToBottom} />
            </div>
          </DndContext>
        )}
      </div>
    </div>
  )
}

export default EditorCanvas
