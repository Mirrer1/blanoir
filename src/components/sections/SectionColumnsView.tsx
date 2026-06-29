'use client'

import { useEffect, useRef, useState } from 'react'

import ColumnChildView from './ColumnChildView'
import type { ColumnsSection } from '@/types/section'

// 이 폭들 기준으로 표시 칸 수 결정
const STACK_WIDTH = 480
const TABLET_WIDTH = 768

const SectionColumnsView = ({ section }: { section: ColumnsSection }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { columns } = section.content
  const { widths } = section.style
  const colCount = columns.length
  const [effectiveCols, setEffectiveCols] = useState(colCount)

  // 실제 폭으로 표시 칸 수를 정하고 3열은 태블릿급에서 2열 경유 후 모바일 1열
  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }
    const observer = new ResizeObserver(() => {
      const w = el.clientWidth
      setEffectiveCols(w < STACK_WIDTH ? 1 : w < TABLET_WIDTH && colCount === 3 ? 2 : colCount)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [colCount])

  const templateColumns =
    effectiveCols === 1
      ? '1fr'
      : effectiveCols === colCount
        ? widths.map((w) => `${w}fr`).join(' ')
        : `repeat(${effectiveCols}, minmax(0, 1fr))`

  return (
    <div ref={ref} className="grid gap-4" style={{ gridTemplateColumns: templateColumns }}>
      {columns.map((col, i) => (
        <div key={col[0]?.id ?? `col-${i}`} className="flex min-w-0 flex-col justify-center">
          {col[0] && <ColumnChildView child={col[0]} live />}
        </div>
      ))}
    </div>
  )
}

export default SectionColumnsView
