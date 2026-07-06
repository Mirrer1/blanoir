'use client'

import { Menu } from '@base-ui/react/menu'
import { Check, ChevronDown } from 'lucide-react'

import type { SharePageItem } from './ExploreShareForm'
import { cn } from '@/lib/utils'

interface ExploreSharePageSelectProps {
  pages: SharePageItem[]
  selected: string
  onSelect: (pageId: string) => void
}

const ExploreSharePageSelect = ({ pages, selected, onSelect }: ExploreSharePageSelectProps) => {
  const current = pages.find((page) => page.pageId === selected)

  return (
    <Menu.Root>
      <Menu.Trigger className="hover:border-foreground/30 flex w-64 max-w-full cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-colors">
        <span className={cn('truncate', !current && 'text-muted-foreground')}>
          {current ? current.title || '제목 없는 페이지' : '페이지를 선택하세요'}
        </span>
        <ChevronDown className="text-muted-foreground size-4 shrink-0" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Backdrop className="fixed inset-0 z-40" />
        <Menu.Positioner sideOffset={6} align="start" className="z-50">
          <Menu.Popup className="bg-background max-h-72 w-64 origin-top overflow-y-auto rounded-lg border p-1 shadow-md transition-[transform,opacity] duration-150 ease-out data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            {pages.length === 0 ? (
              <p className="text-muted-foreground px-2 py-1.5 text-sm">공유할 페이지가 없어요</p>
            ) : (
              pages.map((page) => (
                <Menu.Item
                  key={page.pageId}
                  disabled={page.sharedToCommunity}
                  onClick={() => onSelect(page.pageId)}
                  className="data-[highlighted]:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                >
                  <Check
                    className={cn(
                      'size-4 shrink-0',
                      page.pageId === selected ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="truncate">{page.title || '제목 없는 페이지'}</span>
                  {page.sharedToCommunity ? (
                    <span className="text-muted-foreground ml-auto shrink-0 rounded-full border px-2 py-1 text-xs leading-none">
                      공유됨
                    </span>
                  ) : (
                    <span
                      className={cn(
                        'ml-auto inline-flex w-12 shrink-0 items-center justify-center rounded-full py-1 text-xs leading-none',
                        page.isPublic
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground border',
                      )}
                    >
                      {page.isPublic ? '공개' : '비공개'}
                    </span>
                  )}
                </Menu.Item>
              ))
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export default ExploreSharePageSelect
