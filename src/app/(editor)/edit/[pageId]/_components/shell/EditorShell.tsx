'use client'

import { ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'

import EditorStylePanel from '../panels/EditorStylePanel'
import EditorCanvas from './EditorCanvas'
import EditorHeader from './EditorHeader'
import EditorTemplatePanel from './EditorTemplatePanel'
import useAutoSave from '@/hooks/useAutoSave'
import useTemplatePanel from '@/hooks/useTemplatePanel'
import useUnsavedGuard from '@/hooks/useUnsavedGuard'
import useEditorStore, { findContainerSection, findNode } from '@/store/editor'

const EditorShell = () => {
  const selectedNode = useEditorStore((s) => findNode(s.sections, s.selectedSectionId))
  const containerSection = useEditorStore((s) =>
    findContainerSection(s.sections, s.selectedSectionId),
  )

  const pageId = useEditorStore((s) => s.pageId)
  const initiallyEmpty = useEditorStore((s) => s.sections.length === 0)
  const [templateOpen, setTemplateOpen] = useTemplatePanel(pageId, initiallyEmpty)
  const canvasScrollRef = useRef<HTMLDivElement>(null)

  // 템플릿 적용 시 페이지 스크롤 맨 위로 이동
  const scrollCanvasToTop = () => {
    requestAnimationFrame(() => {
      canvasScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' })
    })
  }

  // 업로드 전 비어 있는 이미지, 갤러리, 카드는 패널 미표시
  const showStylePanel =
    !!selectedNode &&
    !(selectedNode.type === 'image' && !selectedNode.content.src) &&
    !(selectedNode.type === 'gallery' && selectedNode.content.images.length === 0) &&
    !(selectedNode.type === 'card' && selectedNode.content.cards.length === 0)

  // 마운트 시 body 스크롤 잠금
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
        <AnimatePresence initial={false}>
          {templateOpen && (
            <motion.aside
              initial={{ width: 0 }}
              animate={{ width: 256 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="h-full shrink-0 overflow-hidden"
            >
              <EditorTemplatePanel
                onCollapse={() => setTemplateOpen(false)}
                onApplied={scrollCanvasToTop}
              />
            </motion.aside>
          )}
        </AnimatePresence>
        {!templateOpen && (
          <button
            onClick={() => setTemplateOpen(true)}
            aria-label="템플릿 펼치기"
            className="border-border bg-background text-muted-foreground hover:text-foreground flex h-full w-9 shrink-0 cursor-pointer items-start justify-center border-r pt-4 transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        )}
        <EditorCanvas scrollRef={canvasScrollRef} />
        <AnimatePresence>
          {selectedNode && showStylePanel && (
            <motion.aside
              initial={{ width: 0 }}
              animate={{ width: 320 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="h-full shrink-0 overflow-hidden"
            >
              <EditorStylePanel
                key={selectedNode.id}
                section={selectedNode}
                containerSection={containerSection ?? selectedNode}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EditorShell
