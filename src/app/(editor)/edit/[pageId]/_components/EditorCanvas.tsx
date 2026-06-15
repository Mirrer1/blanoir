'use client'

import AddSectionMenu from './AddSectionMenu'
import EditorEmptyState from './EditorEmptyState'
import EditorSection from './EditorSection'
import useEditorStore from '@/store/editor'

const EditorCanvas = () => {
  const sections = useEditorStore((s) => s.sections)
  const selectSection = useEditorStore((s) => s.selectSection)

  return (
    <div className="flex-1 overflow-y-auto" onClick={() => selectSection(null)}>
      <div className="mx-auto min-h-full max-w-3xl px-6 py-16">
        {sections.length === 0 ? (
          <EditorEmptyState />
        ) : (
          <div className="space-y-1">
            {sections.map((section) => (
              <EditorSection key={section.id} section={section} />
            ))}
            <div className="flex justify-center pt-4">
              <AddSectionMenu />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditorCanvas
