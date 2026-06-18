'use client'

import { Monitor, Smartphone, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import PublicPageBody from '@/components/sections/PublicPageBody'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'

type Device = 'pc' | 'mobile'

const EditorPreviewButton = () => {
  const sections = useEditorStore((s) => s.sections)
  const [open, setOpen] = useState(false)
  const [device, setDevice] = useState<Device>('pc')

  // 미리보기 열렸을 때 Esc로 닫기
  useEffect(() => {
    if (!open) {
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        미리보기
      </Button>
      {open && (
        <div className="bg-background fixed inset-0 z-50 flex flex-col">
          <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
            <span className="text-sm font-medium">미리보기</span>
            <div className="bg-muted/50 flex items-center gap-0.5 rounded-md p-0.5">
              <button
                onClick={() => setDevice('pc')}
                aria-label="PC 미리보기"
                className={cn(
                  'flex size-7 cursor-pointer items-center justify-center rounded',
                  device === 'pc' ? 'bg-background shadow-sm' : 'text-muted-foreground',
                )}
              >
                <Monitor className="size-4" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                aria-label="모바일 미리보기"
                className={cn(
                  'flex size-7 cursor-pointer items-center justify-center rounded',
                  device === 'mobile' ? 'bg-background shadow-sm' : 'text-muted-foreground',
                )}
              >
                <Smartphone className="size-4" />
              </button>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)} aria-label="닫기">
              <X className="size-4" />
            </Button>
          </div>
          <div className="canvas-light text-foreground bg-background flex-1 overflow-auto">
            {device === 'pc' ? (
              <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
                <PublicPageBody sections={sections} />
              </div>
            ) : (
              <div className="bg-background mx-auto my-8 w-[430px] overflow-hidden rounded-xl border shadow-sm">
                <div className="px-4 py-12">
                  <PublicPageBody sections={sections} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default EditorPreviewButton
