'use client'

import { Popover } from '@base-ui/react/popover'
import { ChevronDown, FileText } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import PageVisibilityBadge from './PageVisibilityBadge'
import { cn } from '@/lib/utils'
import useEditorStore, { type PageSummary } from '@/store/editor'

interface EditorPageLinkPickerProps {
  selectedPageId: string | null
  onSelect: (pageId: string) => void
}

// 버튼 링크로 내 다른 페이지를 고르는 팝오버 선택기
const EditorPageLinkPicker = ({ selectedPageId, onSelect }: EditorPageLinkPickerProps) => {
  const myPages = useEditorStore((s) => s.myPages)
  const [open, setOpen] = useState(false)

  const selected = myPages.find((page) => page.pageId === selectedPageId) ?? null
  const triggerLabel = selected ? selected.title || '제목 없는 페이지' : '페이지 선택'
  const sortedPages = [...myPages].sort((a, b) => Number(b.isPublic) - Number(a.isPublic))

  const choose = (page: PageSummary) => {
    onSelect(page.pageId)
    setOpen(false)

    if (!page.isPublic) {
      toast.warning('비공개 페이지는 방문자가 접근할 수 없어요')
    }
  }

  return (
    <div>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger className="hover:bg-muted flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-left text-sm transition-colors">
          <FileText className="text-muted-foreground size-4 shrink-0" />
          <span className={cn('min-w-0 flex-1 truncate', !selected && 'text-muted-foreground')}>
            {triggerLabel}
          </span>
          {selected && <PageVisibilityBadge isPublic={selected.isPublic} />}
          <ChevronDown className="text-muted-foreground size-4 shrink-0" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={6} align="start" className="z-50">
            <Popover.Popup className="bg-background w-72 rounded-lg border p-1 shadow-md transition-[transform,opacity] duration-150 ease-out data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
              {myPages.length === 0 ? (
                <p className="text-muted-foreground px-3 py-6 text-center text-xs">
                  연결할 다른 페이지가 없어요
                </p>
              ) : (
                <ul className="max-h-64 overflow-y-auto">
                  {sortedPages.map((page) => (
                    <li key={page.pageId}>
                      <button
                        onClick={() => choose(page)}
                        className={cn(
                          'hover:bg-muted flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors',
                          page.pageId === selectedPageId && 'bg-muted',
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate">
                          {page.title || '제목 없는 페이지'}
                        </span>
                        <PageVisibilityBadge isPublic={page.isPublic} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}

export default EditorPageLinkPicker
