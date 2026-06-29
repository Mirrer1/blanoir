'use client'

import { useEffect, useRef, useState } from 'react'

import AddColumnChildMenu from './AddColumnChildMenu'
import SectionImage from './SectionImage'
import SectionParagraph from './SectionParagraph'
import SectionTitle from './SectionTitle'
import SectionButton from '@/components/sections/SectionButton'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { ColumnsSection } from '@/types/section'

const STACK_WIDTH = 480
const TABLET_WIDTH = 768
const GAP = 16

const SectionColumns = ({ section }: { section: ColumnsSection }) => {
  const selectedId = useEditorStore((s) => s.selectedSectionId)
  const panelTab = useEditorStore((s) => s.panelTab)
  const selectSection = useEditorStore((s) => s.selectSection)
  const setColumnWidths = useEditorStore((s) => s.setColumnWidths)
  const { columns } = section.content
  const { widths } = section.style
  const total = widths.reduce((a, b) => a + b, 0)
  const allCellsHighlighted = selectedId === section.id && panelTab === 'content'

  const gridRef = useRef<HTMLDivElement>(null)
  const colCount = columns.length
  const [effectiveCols, setEffectiveCols] = useState(colCount)

  // 실제 폭으로 표시 칸 수를 정하며 3열은 작은 화면에서 2열을 거쳐 1열로 줄임
  useEffect(() => {
    const el = gridRef.current
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

  // 원래 칸 수로 펼쳐졌을 때만 비율 드래그를 허용하고 좁아지면 균등 줄바꿈
  const isFull = effectiveCols === colCount
  const templateColumns =
    effectiveCols === 1
      ? '1fr'
      : isFull
        ? widths.map((w) => `${w}fr`).join(' ')
        : `repeat(${effectiveCols}, minmax(0, 1fr))`

  // fr 칸 폭은 간격을 뺀 영역에 배분되므로 경계 핸들 위치도 간격만큼 보정
  const handleLeft = (cumFraction: number, i: number) =>
    `calc(${cumFraction * 100}% + ${i * GAP + GAP / 2 - cumFraction * (colCount - 1) * GAP}px)`

  // 경계 핸들 드래그 중엔 DOM을 직접 따라가 부드럽게 움직이고 놓으면 가까운 칸으로 ease-out 안착
  const handleResize = (e: React.PointerEvent, i: number) => {
    e.preventDefault()
    e.stopPropagation()
    const grid = gridRef.current
    const handleEl = e.currentTarget as HTMLElement
    if (!grid) {
      return
    }
    const unit = grid.clientWidth / total
    const startX = e.clientX
    const start = [...widths]
    let current = start

    const compute = (clientX: number, snap: boolean) => {
      const raw = (clientX - startX) / unit
      const delta = snap ? Math.round(raw) : raw
      let left = start[i] + delta
      let right = start[i + 1] - delta
      if (left < 1) {
        right -= 1 - left
        left = 1
      }
      if (right < 1) {
        left -= 1 - right
        right = 1
      }
      const next = [...start]
      next[i] = left
      next[i + 1] = right
      return next
    }

    // 스토어를 거치지 않고 그리드와 핸들 위치만 직접 갱신
    const paint = (w: number[]) => {
      grid.style.gridTemplateColumns = w.map((v) => `${v}fr`).join(' ')
      const cum = w.slice(0, i + 1).reduce((a, b) => a + b, 0)
      handleEl.style.left = handleLeft(cum / total, i)
    }

    const onMove = (ev: PointerEvent) => {
      current = compute(ev.clientX, false)
      paint(current)
    }

    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)

      const target = compute(ev.clientX, true)
      const from = current
      const duration = 160
      let startTime: number | null = null
      const settle = (now: number) => {
        if (startTime === null) {
          startTime = now
        }
        const t = Math.min(1, (now - startTime) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        paint(from.map((v, idx) => v + (target[idx] - v) * eased))
        if (t < 1) {
          requestAnimationFrame(settle)
        } else {
          setColumnWidths(section.id, target)
        }
      }
      requestAnimationFrame(settle)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  // 각 칸의 표시 정보를 미리 계산
  const columnSlots = columns.map((col, i) => {
    const child = col[0]
    const selected = !!child && selectedId === child.id
    return {
      key: child?.id ?? `col-${i}`,
      child,
      colIndex: i,
      selected,
      // 칸 직접 선택 또는 부모 콘텐츠 탭 선택일 때 칸 ring 표시
      contentSelected: (selected && panelTab === 'content') || allCellsHighlighted,
      // 빈 이미지 칸은 드롭존 보더가 있어 강조를 끔
      emptyImage: child?.type === 'image' && !child.content.src,
    }
  })

  // 너비 조절 핸들 위치를 미리 계산
  const resizeHandles = isFull
    ? widths.slice(0, -1).map((_, i) => ({
        key: `handle-${i}`,
        index: i,
        left: handleLeft(widths.slice(0, i + 1).reduce((a, b) => a + b, 0) / total, i),
      }))
    : []

  return (
    <div
      ref={gridRef}
      className="group/cols relative grid gap-4"
      style={{ gridTemplateColumns: templateColumns }}
    >
      {columnSlots.map(({ key, child, colIndex, selected, contentSelected, emptyImage }) => (
        <div key={key} className="min-w-0">
          {child ? (
            <div
              onClick={(e) => {
                e.stopPropagation()
                selectSection(child.id, 'content')
              }}
              className={cn(
                'flex h-full min-h-20 flex-col justify-center rounded-md p-2 transition-colors',
                !emptyImage &&
                  (contentSelected ? 'ring-foreground/20 ring-2 ring-inset' : 'hover:bg-muted'),
              )}
            >
              {child.type === 'title' && <SectionTitle section={child} isSelected={selected} />}
              {child.type === 'paragraph' && (
                <SectionParagraph section={child} isSelected={selected} />
              )}
              {child.type === 'button' && <SectionButton section={child} />}
              {child.type === 'image' && <SectionImage section={child} isSelected={selected} />}
            </div>
          ) : (
            <AddColumnChildMenu sectionId={section.id} colIndex={colIndex} />
          )}
        </div>
      ))}

      {resizeHandles.map(({ key, index, left }) => (
        <button
          key={key}
          aria-label="너비 조절"
          onPointerDown={(e) => handleResize(e, index)}
          onClick={(e) => e.stopPropagation()}
          style={{ left }}
          className="group/handle absolute top-0 bottom-0 z-20 flex w-4 -translate-x-1/2 cursor-col-resize items-center justify-center opacity-0 transition-opacity group-hover/cols:opacity-100"
        >
          <span className="bg-foreground/20 group-hover/handle:bg-foreground/40 h-10 w-1 rounded-full transition-colors" />
        </button>
      ))}
    </div>
  )
}

export default SectionColumns
