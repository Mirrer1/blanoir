'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'

import EditorCanvas from './EditorCanvas'
import EditorHeader from './EditorHeader'
import EditorStylePanel from './EditorStylePanel'
import useAutoSave from '@/hooks/useAutoSave'
import useUnsavedGuard from '@/hooks/useUnsavedGuard'
import useEditorStore, { type EditorInitialPage } from '@/store/editor'

const EditorShell = ({ page }: { page: EditorInitialPage }) => {
  const initialize = useEditorStore((s) => s.initialize)
  const reset = useEditorStore((s) => s.reset)
  const currentPageId = useEditorStore((s) => s.pageId)
  const selectedSection = useEditorStore(
    (s) => s.sections.find((section) => section.id === s.selectedSectionId) ?? null,
  )

  // 서버 데이터로 store 초기화
  if (currentPageId !== page.pageId) {
    initialize(page)
  }

  // 이탈 시 스토어 초기화
  useEffect(() => () => reset(), [reset])

  useAutoSave()
  useUnsavedGuard()

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader />
      <div className="relative flex flex-1 overflow-hidden">
        <EditorCanvas />
        <AnimatePresence>
          {selectedSection && (
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute top-0 right-0 z-20 h-full"
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
