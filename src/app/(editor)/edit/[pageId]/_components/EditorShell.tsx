'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'

import EditorCanvas from './EditorCanvas'
import EditorHeader from './EditorHeader'
import EditorStylePanel from './EditorStylePanel'
import useEditorStore, { type EditorInitialPage } from '@/store/editor'

const EditorShell = ({ page }: { page: EditorInitialPage }) => {
  const initialize = useEditorStore((s) => s.initialize)
  const currentPageId = useEditorStore((s) => s.pageId)
  const selectSection = useEditorStore((s) => s.selectSection)
  const selectedSection = useEditorStore(
    (s) => s.sections.find((section) => section.id === s.selectedSectionId) ?? null,
  )

  // 서버 데이터로 store 초기화
  if (currentPageId !== page.pageId) {
    initialize(page)
  }

  // 에디터 상태 초기화
  useEffect(() => () => selectSection(null), [selectSection])

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader />
      <div className="flex flex-1 overflow-hidden">
        <EditorCanvas />
        <AnimatePresence>
          {selectedSection && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="shrink-0 overflow-hidden"
            >
              <EditorStylePanel section={selectedSection} />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EditorShell
