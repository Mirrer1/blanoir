'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'

import EditorStylePanel from '../panels/EditorStylePanel'
import EditorCanvas from './EditorCanvas'
import EditorHeader from './EditorHeader'
import useAutoSave from '@/hooks/useAutoSave'
import useUnsavedGuard from '@/hooks/useUnsavedGuard'
import useEditorStore from '@/store/editor'

const EditorShell = () => {
  const selectedSection = useEditorStore(
    (s) => s.sections.find((section) => section.id === s.selectedSectionId) ?? null,
  )

  const showStylePanel =
    !!selectedSection &&
    !(selectedSection.type === 'image' && !selectedSection.content.src) &&
    !(selectedSection.type === 'gallery' && selectedSection.content.images.length === 0) &&
    !(selectedSection.type === 'card' && selectedSection.content.cards.length === 0)

  // 마운트 시 body  스크롤 잠금
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  useAutoSave()
  useUnsavedGuard()

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader />
      <div className="flex flex-1 overflow-hidden">
        <EditorCanvas />
        <AnimatePresence>
          {selectedSection && showStylePanel && (
            <motion.aside
              initial={{ width: 0 }}
              animate={{ width: 320 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="h-full shrink-0 overflow-hidden"
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
