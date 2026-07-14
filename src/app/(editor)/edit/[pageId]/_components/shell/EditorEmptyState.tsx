import AddSectionMenu from './AddSectionMenu'

const EditorEmptyState = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="text-muted-foreground text-sm">첫 섹션을 추가해 페이지를 시작해 보세요.</p>
      <span data-tour="add-section" className="inline-flex">
        <AddSectionMenu />
      </span>
    </div>
  )
}

export default EditorEmptyState
