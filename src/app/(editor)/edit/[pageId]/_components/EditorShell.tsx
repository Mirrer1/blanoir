import EditorCanvas from './EditorCanvas'
import EditorHeader from './EditorHeader'
import EditorStylePanel from './EditorStylePanel'

interface EditorPage {
  pageId: string
  title: string
  isPublic: boolean
  sections: unknown[]
}

const EditorShell = ({ page }: { page: EditorPage }) => {
  // 선택된 섹션 ID
  const selectedSectionId: string | null = null

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader title={page.title} isPublic={page.isPublic} />
      <div className="flex flex-1 overflow-hidden">
        <EditorCanvas sections={page.sections} />
        {selectedSectionId && <EditorStylePanel />}
      </div>
    </div>
  )
}

export default EditorShell
