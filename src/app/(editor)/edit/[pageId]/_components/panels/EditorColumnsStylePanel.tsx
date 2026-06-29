'use client'

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { RotateCcw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import EditorColumnItem from './EditorColumnItem'
import EditorStyleField from './EditorStyleField'
import { deleteImage } from '@/actions/upload'
import useEditorStore from '@/store/editor'
import type { ColumnChild, ColumnsSection } from '@/types/section'

const CHILD_LABEL: Record<ColumnChild['type'], string> = {
  title: '제목',
  paragraph: '문단',
  image: '이미지',
  button: '버튼',
}
const labelOf = (col: ColumnChild[]) => (col[0] ? CHILD_LABEL[col[0].type] : '빈 칸')

// 열 순서와 삭제는 패널에서 다루고 너비는 캔버스 드래그로 조절
const EditorColumnsStylePanel = ({ section }: { section: ColumnsSection }) => {
  const moveColumn = useEditorStore((s) => s.moveColumn)
  const removeColumnChild = useEditorStore((s) => s.removeColumnChild)
  const restoreColumnChild = useEditorStore((s) => s.restoreColumnChild)
  const { columns } = section.content
  const ids = columns.map((col, i) => col[0]?.id ?? `empty-${i}`)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }
    const from = ids.indexOf(active.id as string)
    const to = ids.indexOf(over.id as string)
    if (from !== -1 && to !== -1) {
      moveColumn(section.id, from, to)
    }
  }

  // 즉시 비우고 실행취소 토스트를 띄우며 이미지는 토스트 닫힐 때 정리
  const handleRemove = (colIndex: number, child: ColumnChild) => {
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
    toast('블록을 비웠어요', {
      icon: <Trash2 className="size-4" />,
      duration: 4000,
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

  return (
    <EditorStyleField label="열 순서">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1.5">
            {columns.map((col, i) => (
              <EditorColumnItem
                key={ids[i]}
                id={ids[i]}
                order={i + 1}
                label={labelOf(col)}
                onRemove={col[0] ? () => handleRemove(i, col[0]) : undefined}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <p className="text-muted-foreground text-xs leading-relaxed">
        칸 너비는 캔버스에서 경계를 드래그해 조절해요.
      </p>
    </EditorStyleField>
  )
}

export default EditorColumnsStylePanel
