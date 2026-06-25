'use client'

import { Menu } from '@base-ui/react/menu'
import {
  Image as ImageIcon,
  type LucideIcon,
  MousePointerClick,
  Pilcrow,
  Plus,
  Type,
} from 'lucide-react'

import useEditorStore from '@/store/editor'
import type { ColumnChildType } from '@/types/section'

const CHILD_TYPES: { type: ColumnChildType; label: string; icon: LucideIcon }[] = [
  { type: 'title', label: '제목', icon: Type },
  { type: 'paragraph', label: '문단', icon: Pilcrow },
  { type: 'image', label: '이미지', icon: ImageIcon },
  { type: 'button', label: '버튼', icon: MousePointerClick },
]

const AddColumnChildMenu = ({ sectionId, colIndex }: { sectionId: string; colIndex: number }) => {
  const addColumnChild = useEditorStore((s) => s.addColumnChild)

  const handleAdd = (e: React.MouseEvent, type: ColumnChildType) => {
    e.stopPropagation()
    addColumnChild(sectionId, colIndex, type)
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        onClick={(e) => e.stopPropagation()}
        className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground flex h-full min-h-20 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed py-4 text-sm transition-colors"
      >
        <Plus className="size-4" />
        추가
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Backdrop className="fixed inset-0 z-40" />
        <Menu.Positioner sideOffset={6} align="center" className="z-50">
          <Menu.Popup className="bg-background min-w-32 origin-top rounded-lg border p-1 shadow-md transition-[transform,opacity] duration-150 ease-out data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            {CHILD_TYPES.map(({ type, label, icon: Icon }) => (
              <Menu.Item
                key={type}
                onClick={(e) => handleAdd(e, type)}
                className="data-[highlighted]:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none"
              >
                <Icon className="size-4" />
                {label}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export default AddColumnChildMenu
