'use client'

import { ArrowLeft, Monitor } from 'lucide-react'
import Link from 'next/link'

import EditorPublishButton from './EditorPublishButton'
import EditorShareButton from './EditorShareButton'
import PublicPageBody from '@/components/sections/PublicPageBody'
import { buttonVariants } from '@/components/ui/button'
import useEditorStore from '@/store/editor'

// 작은 화면 접속 시 에디터 대신 미리보기로 전환
const EditorMobilePreview = () => {
  const sections = useEditorStore((s) => s.sections)

  return (
    <div className="min-h-screen">
      <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3">
        <div className="flex min-w-0 items-center gap-1">
          <Link
            href="/dashboard"
            aria-label="대시보드로"
            className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          >
            <ArrowLeft />
          </Link>
          <span className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-xs">
            <Monitor className="size-3.5 shrink-0" />
            <span className="truncate">페이지 편집은 PC를 이용해주세요</span>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <EditorPublishButton compact />
          <EditorShareButton compact />
        </div>
      </header>
      <div className="canvas-light text-foreground bg-background">
        <PublicPageBody sections={sections} />
      </div>
    </div>
  )
}

export default EditorMobilePreview
