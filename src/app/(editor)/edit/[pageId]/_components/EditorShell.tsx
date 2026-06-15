'use client'

import EditorCanvas from './EditorCanvas'
import EditorHeader from './EditorHeader'
import EditorStylePanel from './EditorStylePanel'
import useEditorStore, { type EditorInitialPage } from '@/store/editor'

const EditorShell = ({ page }: { page: EditorInitialPage }) => {
  const initialize = useEditorStore((s) => s.initialize)
  const currentPageId = useEditorStore((s) => s.pageId)
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId)

  // 서버 데이터로 store 초기화
  if (currentPageId !== page.pageId) {
    initialize(page)
  }

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader />
      <div className="flex flex-1 overflow-hidden">
        <EditorCanvas />
        {selectedSectionId && <EditorStylePanel />}
      </div>
    </div>
  )
}

export default EditorShell
