'use client'

import { Menu } from '@base-ui/react/menu'
import {
  Image as ImageIcon,
  type LucideIcon,
  Minus,
  MousePointerClick,
  Pilcrow,
  Plus,
  Type,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import useEditorStore from '@/store/editor'
import type { SectionType } from '@/types/section'

const SECTION_TYPES: { type: SectionType; label: string; icon: LucideIcon }[] = [
  { type: 'title', label: '제목', icon: Type },
  { type: 'paragraph', label: '문단', icon: Pilcrow },
  { type: 'image', label: '이미지', icon: ImageIcon },
  { type: 'divider', label: '구분선', icon: Minus },
  { type: 'button', label: '버튼', icon: MousePointerClick },
]

const AddSectionMenu = ({ index, compact }: { index?: number; compact?: boolean }) => {
  const addSection = useEditorStore((s) => s.addSection)

  return (
    <Menu.Root>
      {compact ? (
        <Menu.Trigger
          aria-label="섹션 추가"
          onClick={(e) => e.stopPropagation()}
          className="bg-background text-muted-foreground hover:text-foreground flex size-6 cursor-pointer items-center justify-center rounded-full border shadow-sm transition-colors"
        >
          <Plus className="size-4" />
        </Menu.Trigger>
      ) : (
        <Menu.Trigger
          render={<Button variant="outline" size="sm" />}
          onClick={(e) => e.stopPropagation()}
        >
          <Plus className="size-4" />
          섹션 추가
        </Menu.Trigger>
      )}
      <Menu.Portal>
        <Menu.Backdrop className="fixed inset-0 z-40" />
        <Menu.Positioner sideOffset={6} align="center" className="z-50">
          <Menu.Popup className="bg-background min-w-36 origin-top rounded-lg border p-1 shadow-md transition-[transform,opacity] duration-150 ease-out data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            {SECTION_TYPES.map(({ type, label, icon: Icon }) => (
              <Menu.Item
                key={type}
                onClick={() => addSection(type, index)}
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

export default AddSectionMenu
