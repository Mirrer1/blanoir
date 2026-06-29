'use client'

import { Link2, X } from 'lucide-react'
import { useState } from 'react'

import { SEG_BASE, SEG_OFF, SEG_ON } from '../../controlStyles'
import EditorPageLinkPicker from './EditorPageLinkPicker'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'

type LinkMode = 'url' | 'page'

const LINK_MODE_OPTIONS: { value: LinkMode; label: string }[] = [
  { value: 'url', label: '외부 URL' },
  { value: 'page', label: '내 페이지' },
]

const PAGE_LINK_PREFIX = '/user/'
const linkModeOf = (url: string): LinkMode => (url.startsWith(PAGE_LINK_PREFIX) ? 'page' : 'url')
const pageIdOf = (url: string): string | null =>
  url.startsWith(PAGE_LINK_PREFIX) ? (url.split('/').pop() ?? null) || null : null

interface EditorLinkFieldProps {
  value: string
  resetKey: string // 다른 섹션 선택 시 링크 입력 상태 초기화 기준
  onChange: (url: string) => void
  alwaysOpen?: boolean
}

const EditorLinkField = ({ value, resetKey, onChange, alwaysOpen }: EditorLinkFieldProps) => {
  const handle = useEditorStore((s) => s.handle)

  const [linkMode, setLinkMode] = useState<LinkMode>(() => linkModeOf(value))
  const [expanded, setExpanded] = useState(!!value)
  const [trackedKey, setTrackedKey] = useState(resetKey)
  if (trackedKey !== resetKey) {
    setTrackedKey(resetKey)
    setLinkMode(linkModeOf(value))
    setExpanded(!!value)
  }

  // 링크 종류를 바꾸면 이전 종류의 값은 비움
  const changeLinkMode = (next: LinkMode) => {
    if (next === linkMode) {
      return
    }
    setLinkMode(next)
    onChange('')
  }

  const remove = () => {
    onChange('')
    setExpanded(false)
  }

  if (!alwaysOpen && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed py-2 text-xs transition-colors"
      >
        <Link2 className="size-4" />
        링크 추가
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium">링크</p>
        {!alwaysOpen && (
          <button
            onClick={remove}
            aria-label="링크 제거"
            className="text-muted-foreground hover:text-foreground flex size-5 cursor-pointer items-center justify-center rounded"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
      <div className="flex gap-1">
        {LINK_MODE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => changeLinkMode(option.value)}
            className={cn(SEG_BASE, 'flex-1', linkMode === option.value ? SEG_ON : SEG_OFF)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {linkMode === 'url' ? (
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com"
        />
      ) : (
        <EditorPageLinkPicker
          selectedPageId={pageIdOf(value)}
          onSelect={(pageId) => onChange(`${PAGE_LINK_PREFIX}${handle}/${pageId}`)}
        />
      )}
    </div>
  )
}

export default EditorLinkField
