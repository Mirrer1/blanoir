'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button, buttonVariants } from '@/components/ui/button'
import useEditorStore, { type SaveStatus } from '@/store/editor'

const SAVE_STATUS_LABEL: Record<SaveStatus, string> = {
  saved: '자동 저장됨',
  unsaved: '저장되지 않은 변경사항',
  saving: '저장 중…',
}

const EditorHeader = () => {
  const title = useEditorStore((s) => s.title)
  const isPublic = useEditorStore((s) => s.isPublic)
  const saveStatus = useEditorStore((s) => s.saveStatus)
  const displayTitle = title || '제목 없는 페이지'

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
      <div className="flex min-w-0 items-center gap-2">
        <Link
          href="/dashboard"
          aria-label="대시보드로 나가기"
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
        >
          <ArrowLeft />
        </Link>
        <span className="truncate text-sm font-medium">{displayTitle}</span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-muted-foreground text-xs">{SAVE_STATUS_LABEL[saveStatus]}</span>
        <Button size="sm">{isPublic ? '공개됨' : '공개'}</Button>
      </div>
    </header>
  )
}

export default EditorHeader
