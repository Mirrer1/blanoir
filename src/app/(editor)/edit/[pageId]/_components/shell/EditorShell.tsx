'use client'

import { ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'

import EditorStylePanel from '../panels/EditorStylePanel'
import EditorCanvas from './EditorCanvas'
import EditorHeader from './EditorHeader'
import EditorTemplatePanel from './EditorTemplatePanel'
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
      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence initial={false}>
          {showTemplate && (
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
        {!showTemplate && (
          <button
            onClick={handleExpandTemplate}
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
