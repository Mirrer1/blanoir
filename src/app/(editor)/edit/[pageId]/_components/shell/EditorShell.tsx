'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'

import EditorStylePanel from '../panels/EditorStylePanel'
import EditorCanvas from './EditorCanvas'
import EditorHeader from './EditorHeader'
import EditorTemplatePanel from './EditorTemplatePanel'
import EditorTemplateRail from './EditorTemplateRail'
import useAutoSave from '@/hooks/useAutoSave'
import useDualPanel from '@/hooks/useDualPanel'
import useTemplatePanel from '@/hooks/useTemplatePanel'
import useUnsavedGuard from '@/hooks/useUnsavedGuard'
import useEditorStore, { findContainerSection, findNode } from '@/store/editor'

const EditorShell = () => {
  const selectedNode = useEditorStore((s) => findNode(s.sections, s.selectedSectionId))
  const containerSection = useEditorStore((s) =>
    findContainerSection(s.sections, s.selectedSectionId),
  )
  const selectSection = useEditorStore((s) => s.selectSection)
  const pageId = useEditorStore((s) => s.pageId)
  const initiallyEmpty = useEditorStore((s) => s.sections.length === 0)

  const [templateOpen, setTemplateOpen] = useTemplatePanel(pageId, initiallyEmpty)
  const canFitBoth = useDualPanel()
  const canvasScrollRef = useRef<HTMLDivElement>(null)

  const showTemplate = templateOpen && (canFitBoth || !selectedNode)
  // 업로드 전 비어 있는 이미지, 갤러리, 카드는 패널 미표시
  const showStylePanel =
    !!selectedNode &&
    !(selectedNode.type === 'image' && !selectedNode.content.src) &&
    !(selectedNode.type === 'gallery' && selectedNode.content.images.length === 0) &&
    !(selectedNode.type === 'card' && selectedNode.content.cards.length === 0)

  // 좁은 화면에서 템플릿을 펼치면 스타일 패널을 닫아 자리를 비움
  const handleExpandTemplate = () => {
    setTemplateOpen(true)
    if (!canFitBoth) {
      selectSection(null)
    }
  }

  // 템플릿 적용 시 페이지 스크롤 맨 위로 이동
  const scrollCanvasToTop = () => {
    requestAnimationFrame(() => {
      canvasScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' })
    })
  }

  // 루트 스크롤바 거터를 없애는 문서 스크롤 잠금
  useEffect(() => {
    const html = document.documentElement
    const previousHtml = html.style.overflow
    const previousBody = document.body.style.overflow
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = previousHtml
      document.body.style.overflow = previousBody
    }
  }, [])

  useAutoSave()
  useUnsavedGuard()

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader />
      <div className="relative flex flex-1 overflow-hidden">
        <motion.aside
          initial={false}
          animate={{ width: showTemplate ? 256 : 56 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="border-border relative h-full shrink-0 overflow-hidden border-r"
        >
          <motion.div
            animate={{ opacity: showTemplate ? 1 : 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute inset-y-0 left-0 ${showTemplate ? '' : 'pointer-events-none'}`}
          >
            <EditorTemplatePanel onApplied={scrollCanvasToTop} />
          </motion.div>
          <motion.div
            animate={{ opacity: showTemplate ? 0 : 1 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute inset-y-0 left-0 ${showTemplate ? 'pointer-events-none' : ''}`}
          >
            <EditorTemplateRail onApplied={scrollCanvasToTop} />
          </motion.div>
        </motion.aside>
        <motion.button
          onClick={showTemplate ? () => setTemplateOpen(false) : handleExpandTemplate}
          aria-label={showTemplate ? '템플릿 접기' : '템플릿 펼치기'}
          initial={false}
          animate={{ left: showTemplate ? 256 : 56 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="border-border bg-background text-muted-foreground hover:text-foreground absolute top-1/2 z-10 flex size-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border transition-colors"
        >
          {showTemplate ? (
            <ChevronLeft className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
        </motion.button>
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
