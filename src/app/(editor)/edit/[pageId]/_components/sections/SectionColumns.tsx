'use client'

import { RotateCcw, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import AddColumnChildMenu from './AddColumnChildMenu'
import SectionImage from './SectionImage'
import SectionParagraph from './SectionParagraph'
import SectionTitle from './SectionTitle'
import { deleteImage } from '@/actions/upload'
import SectionButton from '@/components/sections/SectionButton'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { ColumnChild, ColumnsSection } from '@/types/section'

const STACK_WIDTH = 480
const TABLET_WIDTH = 768

const SectionColumns = ({ section }: { section: ColumnsSection }) => {
  const selectedId = useEditorStore((s) => s.selectedSectionId)
  const selectSection = useEditorStore((s) => s.selectSection)
  const removeColumnChild = useEditorStore((s) => s.removeColumnChild)
  const restoreColumnChild = useEditorStore((s) => s.restoreColumnChild)
  const setColumnWidths = useEditorStore((s) => s.setColumnWidths)
  const { columns } = section.content
  const { widths } = section.style
  const total = widths.reduce((a, b) => a + b, 0)

  const gridRef = useRef<HTMLDivElement>(null)
  const colCount = columns.length
  const [effectiveCols, setEffectiveCols] = useState(colCount)

  // 실제 폭으로 표시 칸 수 결정, 3열은 태블릿급에서 2열 경유 후 모바일 1열
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

  // 칸 비율 드래그는 원래 칸 수로 펼쳐졌을 때만, 줄어들면 균등 + 줄바꿈
  const isFull = effectiveCols === colCount
  const templateColumns =
    effectiveCols === 1
      ? '1fr'
      : isFull
        ? widths.map((w) => `${w}fr`).join(' ')
        : `repeat(${effectiveCols}, minmax(0, 1fr))`

  // 칸 블록 삭제, 즉시 비우고 실행취소 토스트(이미지는 토스트 닫힐 때 정리)
  const handleRemoveChild = (e: React.MouseEvent, colIndex: number, child: ColumnChild) => {
    e.stopPropagation()
    let undone = false
    let cleaned = false
    const cleanup = () => {
      if (undone || cleaned) {
        return
      }
      cleaned = true
      if (child.type === 'image' && child.content.src) {
        void deleteImage(child.content.src)
      }
    }
    removeColumnChild(child.id)
    toast('블록을 삭제했어요', {
      icon: <Trash2 className="size-4" />,
      duration: 5000,
      action: {
        label: (
          <span className="flex items-center gap-1.5">
            <RotateCcw className="size-3.5" />
            실행취소
          </span>
        ),
        onClick: () => {
          undone = true
          restoreColumnChild(section.id, colIndex, child)
        },
      },
      onAutoClose: cleanup,
      onDismiss: cleanup,
    })
  }

  // 경계 핸들 드래그: 중엔 DOM을 직접 따라가 부드럽게, 놓으면 가까운 칸으로 ease-out 안착
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

    // 스토어를 거치지 않고 그리드·핸들 위치만 직접 갱신
    const paint = (w: number[]) => {
      grid.style.gridTemplateColumns = w.map((v) => `${v}fr`).join(' ')
      const cum = w.slice(0, i + 1).reduce((a, b) => a + b, 0)
      handleEl.style.left = `${(cum / total) * 100}%`
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

  return (
    <div
      ref={gridRef}
      className="group/cols border-border relative grid gap-4 rounded-lg border p-2"
      style={{ gridTemplateColumns: templateColumns }}
    >
      {columns.map((col, i) => {
        const child = col[0]
        const sel = !!child && selectedId === child.id
        return (
          <div key={child?.id ?? `col-${i}`} className="min-w-0">
            {child ? (
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  selectSection(child.id)
                }}
                className={cn(
                  'group/cell relative flex h-full min-h-20 flex-col justify-center rounded-md p-2 transition-colors',
                  sel && 'ring-foreground/20 ring-2 ring-inset',
                )}
              >
                {child.type === 'title' && <SectionTitle section={child} isSelected={sel} />}
                {child.type === 'paragraph' && (
                  <SectionParagraph section={child} isSelected={sel} />
                )}
                {child.type === 'button' && <SectionButton section={child} />}
                {child.type === 'image' && <SectionImage section={child} isSelected={sel} />}
                <button
                  aria-label="블록 제거"
                  onClick={(e) => handleRemoveChild(e, i, child)}
                  className="border-border bg-background text-muted-foreground hover:text-destructive absolute top-1 right-1 z-10 flex size-6 cursor-pointer items-center justify-center rounded-md border opacity-0 shadow-sm transition-opacity group-hover/cell:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <AddColumnChildMenu sectionId={section.id} colIndex={i} />
            )}
          </div>
        )
      })}

      {isFull &&
        widths.slice(0, -1).map((_, i) => {
          const cum = widths.slice(0, i + 1).reduce((a, b) => a + b, 0)
          return (
            <button
              key={`handle-${i}`}
              aria-label="너비 조절"
              onPointerDown={(e) => handleResize(e, i)}
              onClick={(e) => e.stopPropagation()}
              style={{ left: `${(cum / total) * 100}%` }}
              className="group/handle absolute top-0 bottom-0 z-20 flex w-4 -translate-x-1/2 cursor-col-resize items-center justify-center opacity-0 transition-opacity group-hover/cols:opacity-100"
            >
              <span className="bg-foreground/20 group-hover/handle:bg-foreground/40 h-10 w-1 rounded-full transition-colors" />
            </button>
          )
        })}
    </div>
  )
}

export default SectionColumns
