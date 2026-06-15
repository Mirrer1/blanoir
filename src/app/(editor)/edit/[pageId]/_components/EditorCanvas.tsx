'use client'

import useEditorStore from '@/store/editor'

const EditorCanvas = () => {
  const sections = useEditorStore((s) => s.sections)
  const isEmpty = sections.length === 0

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto min-h-full max-w-3xl px-6 py-16">
        {isEmpty ? (
          <p className="text-muted-foreground text-center text-sm">
            아직 추가된 섹션이 없어요. 곧 여기에 섹션을 추가할 수 있어요.
          </p>
        ) : (
          <p className="text-muted-foreground text-center text-sm">
            섹션 {sections.length}개 (렌더링은 다음 단계)
          </p>
        )}
      </div>
    </div>
  )
}

export default EditorCanvas
