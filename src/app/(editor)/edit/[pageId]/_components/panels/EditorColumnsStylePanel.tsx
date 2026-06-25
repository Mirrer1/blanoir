'use client'

import type { ColumnsSection } from '@/types/section'

// 열 섹션은 칸 편집·너비 조절을 캔버스에서 직접
const EditorColumnsStylePanel = ({ section }: { section: ColumnsSection }) => {
  const count = section.content.columns.length

  return (
    <div className="text-muted-foreground space-y-2 text-xs leading-relaxed">
      <p>{count}열 섹션이에요.</p>
      <p>각 칸을 클릭해 블록을 추가·편집하고, 칸 사이 경계를 드래그하면 너비가 한 칸씩 조절돼요.</p>
      <p>배경·등장 효과는 위 배경 탭에서 설정할 수 있어요.</p>
    </div>
  )
}

export default EditorColumnsStylePanel
