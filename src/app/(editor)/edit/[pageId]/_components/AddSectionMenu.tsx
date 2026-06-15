'use client'

import { Menu } from '@base-ui/react/menu'
import { type LucideIcon, Plus, Type } from 'lucide-react'

import { Button } from '@/components/ui/button'
import useEditorStore from '@/store/editor'
import type { SectionType } from '@/types/section'

const SECTION_TYPES: { type: SectionType; label: string; icon: LucideIcon }[] = [
  { type: 'title', label: '제목', icon: Type },
]

const AddSectionMenu = ({ index }: { index?: number }) => {
  const addSection = useEditorStore((s) => s.addSection)

  return (
    <Menu.Root>
      <Menu.Trigger
        render={<Button variant="outline" size="sm" />}
        onClick={(e) => e.stopPropagation()}
      >
        <Plus className="size-4" />
        섹션 추가
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="center">
          <Menu.Popup className="bg-background z-50 min-w-36 origin-top rounded-lg border p-1 shadow-md transition-[transform,opacity] duration-150 ease-out data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
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
