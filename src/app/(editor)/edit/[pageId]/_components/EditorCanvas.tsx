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

import AddSectionMenu from './AddSectionMenu'
import EditorEmptyState from './EditorEmptyState'
import EditorSection from './EditorSection'
import useEditorStore from '@/store/editor'

const EditorCanvas = () => {
  const sections = useEditorStore((s) => s.sections)
  const selectSection = useEditorStore((s) => s.selectSection)
  const moveSection = useEditorStore((s) => s.moveSection)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

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
    <div className="flex-1 overflow-y-auto" onClick={() => selectSection(null)}>
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
              <div className="space-y-1">
                {sections.map((section) => (
                  <EditorSection key={section.id} section={section} />
                ))}
              </div>
            </SortableContext>
            <div className="flex justify-center pt-4">
              <AddSectionMenu />
            </div>
          </DndContext>
        )}
      </div>
    </div>
  )
}

export default EditorCanvas
