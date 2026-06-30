'use client'

import { Menu } from '@base-ui/react/menu'
import { Check, ChevronDown } from 'lucide-react'

import type { ExploreCategoryKey } from '../_data/dummyPosts'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ExploreCategoryDropdownProps {
  tabs: { key: ExploreCategoryKey; label: string }[]
  active: ExploreCategoryKey
  onSelect: (key: ExploreCategoryKey) => void
  className?: string
}

const ExploreCategoryDropdown = ({
  tabs,
  active,
  onSelect,
  className,
}: ExploreCategoryDropdownProps) => {
  const activeLabel = tabs.find((tab) => tab.key === active)?.label ?? '전체'

  return (
    <Menu.Root>
      <Menu.Trigger
        render={<Button variant="outline" />}
        className={cn('justify-between', className)}
      >
        {activeLabel}
        <ChevronDown className="size-4" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Backdrop className="fixed inset-0 z-40" />
        <Menu.Positioner sideOffset={6} align="start" className="z-50">
          <Menu.Popup className="bg-background min-w-40 origin-top rounded-lg border p-1 shadow-md transition-[transform,opacity] duration-150 ease-out data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            {tabs.map((tab) => (
              <Menu.Item
                key={tab.key}
                onClick={() => onSelect(tab.key)}
                className="data-[highlighted]:bg-muted flex cursor-pointer items-center justify-between gap-4 rounded-md px-2 py-1.5 text-sm outline-none"
              >
                {tab.label}
                {active === tab.key && <Check className="size-4" />}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export default ExploreCategoryDropdown
