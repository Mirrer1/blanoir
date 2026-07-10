'use client'

import { Popover } from '@base-ui/react/popover'
import { Check, Copy, ExternalLink, Globe, Lock } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { togglePagePublic } from '@/actions/page'
import { Button } from '@/components/ui/button'
import useEditorStore from '@/store/editor'

interface EditorPublishButtonProps {
  compact?: boolean
}

const EditorPublishButton = ({ compact = false }: EditorPublishButtonProps = {}) => {
  const pageId = useEditorStore((s) => s.pageId)
  const handle = useEditorStore((s) => s.handle)
  const isPublic = useEditorStore((s) => s.isPublic)
  const setPublic = useEditorStore((s) => s.setPublic)
  const [pending, setPending] = useState(false)
  const [copied, setCopied] = useState(false)

  const path = `/user/${handle}/${pageId}`

  const handleToggle = async () => {
    const next = !isPublic
    setPending(true)
    const result = await togglePagePublic(pageId, next)
    setPending(false)
    if (!result.ok) {
      return toast.error(result.message)
    }
    setPublic(result.isPublic)
    toast.success(result.isPublic ? '페이지를 공개했어요' : '비공개로 전환했어요')
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${path}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <Button
            size={compact ? 'icon-sm' : 'sm'}
            variant={compact ? 'ghost' : isPublic ? 'default' : 'outline'}
            aria-label={compact ? (isPublic ? '공개' : '비공개') : undefined}
          />
        }
      >
        {isPublic ? <Globe /> : <Lock />}
        {!compact && (isPublic ? '공개' : '비공개')}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={6} align="end" className="z-50">
          <Popover.Popup className="bg-background w-72 origin-top-right rounded-lg border p-4 shadow-md transition-[transform,opacity] duration-150 ease-out data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <div className="flex items-center gap-2">
              {isPublic ? (
                <Globe className="size-4" />
              ) : (
                <Lock className="text-muted-foreground size-4" />
              )}
              <span className="text-sm font-medium">{isPublic ? '공개' : '비공개'}</span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              {isPublic ? '누구나 이 링크로 볼 수 있어요' : '나만 볼 수 있어요'}
            </p>

            {isPublic && (
              <div className="mt-3 flex flex-col gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="border-border text-muted-foreground flex-1 truncate rounded-md border px-2 py-1.5 text-xs">
                    {path}
                  </span>
                  <button
                    onClick={handleCopy}
                    aria-label="링크 복사"
                    className="hover:bg-muted flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md border"
                  >
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  </button>
                </div>
                <a
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 text-xs leading-none"
                >
                  <ExternalLink className="size-3.5 -translate-y-px" />새 탭에서 열기
                </a>
              </div>
            )}

            <Button
              onClick={handleToggle}
              disabled={pending}
              variant={isPublic ? 'outline' : 'default'}
              size="sm"
              className={isPublic ? 'mt-3 w-full' : 'mt-4 w-full'}
            >
              {isPublic ? '비공개로 전환' : '공개하기'}
            </Button>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default EditorPublishButton
