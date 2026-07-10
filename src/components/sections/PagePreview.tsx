'use client'

import { Dialog } from '@base-ui/react/dialog'
import { Monitor, Smartphone, X } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import PublicPageBody from './PublicPageBody'
import useIsSmallScreen from '@/hooks/useIsSmallScreen'
import { cn } from '@/lib/utils'
import type { Section } from '@/types/section'

type Device = 'pc' | 'mobile'

interface PagePreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sections: Section[]
  title?: string
  actions?: ReactNode // 헤더 우측 액션 슬롯
}

// 에디터와 둘러보기가 공유하는 전체화면 결과물 미리보기
const PagePreview = ({ open, onOpenChange, sections, title, actions }: PagePreviewProps) => {
  const [device, setDevice] = useState<Device>('pc')
  const isSmallScreen = useIsSmallScreen()
  const effectiveDevice = isSmallScreen ? 'mobile' : device

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Popup className="bg-background fixed inset-0 z-[60] flex flex-col transition-[opacity,transform] duration-300 ease-out data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0">
          <Dialog.Title className="sr-only">미리보기</Dialog.Title>
          <div className="relative flex h-14 shrink-0 items-center justify-between border-b pr-2 pl-0.5">
            <div className="flex min-w-0 items-center gap-1">
              <Dialog.Close
                aria-label="닫기"
                className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors"
              >
                <X className="size-5" />
              </Dialog.Close>
              {isSmallScreen && title && (
                <span className="text-muted-foreground min-w-0 truncate text-xs">
                  {title} 미리보기
                </span>
              )}
            </div>
            {!isSmallScreen && (
              <div className="bg-muted/50 absolute left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-md p-0.5">
                <button
                  type="button"
                  onClick={() => setDevice('pc')}
                  aria-label="PC 미리보기"
                  className={cn(
                    'flex size-7 cursor-pointer items-center justify-center rounded transition-colors',
                    device === 'pc' ? 'bg-background shadow-sm' : 'text-muted-foreground',
                  )}
                >
                  <Monitor className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDevice('mobile')}
                  aria-label="모바일 미리보기"
                  className={cn(
                    'flex size-7 cursor-pointer items-center justify-center rounded transition-colors',
                    device === 'mobile' ? 'bg-background shadow-sm' : 'text-muted-foreground',
                  )}
                >
                  <Smartphone className="size-4" />
                </button>
              </div>
            )}
            <div className="flex items-center">{actions}</div>
          </div>
          <div className="canvas-light text-foreground bg-background flex-1 overflow-auto">
            <div
              key={effectiveDevice}
              className={cn(
                'animate-in fade-in-0 mx-auto duration-300 ease-out',
                effectiveDevice === 'mobile' && !isSmallScreen
                  ? 'bg-background my-8 w-[430px] overflow-hidden rounded-xl border shadow-sm'
                  : 'w-full',
              )}
            >
              <PublicPageBody sections={sections} />
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default PagePreview
