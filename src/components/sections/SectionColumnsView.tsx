'use client'

import { useEffect, useRef, useState } from 'react'

import ColumnChildView from './ColumnChildView'
import type { ColumnsSection } from '@/types/section'

// 이 폭 미만이면 칸을 세로로 스택
const STACK_WIDTH = 480

const SectionColumnsView = ({ section }: { section: ColumnsSection }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [stacked, setStacked] = useState(false)
  const { columns } = section.content
  const { widths } = section.style

  // 실제 폭으로 스택 여부 결정, 모바일 미리보기 박스도 반영
  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }
    const observer = new ResizeObserver(() => setStacked(el.clientWidth < STACK_WIDTH))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="grid gap-4"
      style={{
        gridTemplateColumns: stacked ? '1fr' : widths.map((w) => `${w}fr`).join(' '),
      }}
    >
      {columns.map((col, i) => (
        <div key={col[0]?.id ?? `col-${i}`} className="flex min-w-0 flex-col justify-center">
          {col[0] && <ColumnChildView child={col[0]} live />}
        </div>
      ))}
    </div>
  )
}

export default SectionColumnsView
