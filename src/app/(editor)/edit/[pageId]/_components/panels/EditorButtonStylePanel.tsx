'use client'

import { useState } from 'react'

import { SEG_BASE, SEG_OFF, SEG_ON } from '../../controlStyles'
import EditorAlignField from './EditorAlignField'
import EditorColorField from './EditorColorField'
import EditorPageLinkPicker from './EditorPageLinkPicker'
import EditorStyleField from './EditorStyleField'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { ButtonSection, ButtonShape, ButtonSize, ButtonWidth } from '@/types/section'

type LinkMode = 'url' | 'page'

const LINK_MODE_OPTIONS: { value: LinkMode; label: string }[] = [
  { value: 'url', label: '외부 URL' },
  { value: 'page', label: '내 페이지' },
]

// 내 페이지 링크는 /user/handle/pageId 경로로 저장
const PAGE_LINK_PREFIX = '/user/'
const linkModeOf = (url: string): LinkMode => (url.startsWith(PAGE_LINK_PREFIX) ? 'page' : 'url')
const pageIdOf = (url: string): string | null =>
  url.startsWith(PAGE_LINK_PREFIX) ? (url.split('/').pop() ?? null) || null : null

const SIZE_OPTIONS: { value: ButtonSize; label: string }[] = [
  { value: 'small', label: '작게' },
  { value: 'medium', label: '보통' },
  { value: 'large', label: '크게' },
]
const WIDTH_OPTIONS: { value: ButtonWidth; label: string }[] = [
  { value: 'auto', label: '자동' },
  { value: 'wide', label: '넓게' },
  { value: 'full', label: '전체' },
]
const SHAPE_OPTIONS: { value: ButtonShape; label: string }[] = [
  { value: 'square', label: '사각' },
  { value: 'rounded', label: '둥근' },
]

const EditorButtonStylePanel = ({ section }: { section: ButtonSection }) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const updateSectionStyle = useEditorStore((s) => s.updateSectionStyle)
  const handle = useEditorStore((s) => s.handle)
  const { text, url } = section.content
  const { color, textColor, shape, size, width, align } = section.style

  // 다른 버튼 섹션 선택 시 그 섹션의 링크 종류로 초기화
  const [linkMode, setLinkMode] = useState<LinkMode>(() => linkModeOf(url))
  const [trackedId, setTrackedId] = useState(section.id)
  if (trackedId !== section.id) {
    setTrackedId(section.id)
    setLinkMode(linkModeOf(url))
  }

  // 링크 종류를 바꾸면 이전 종류의 값은 비움
  const changeLinkMode = (next: LinkMode) => {
    if (next === linkMode) {
      return
    }
    setLinkMode(next)
    updateSectionContent(section.id, { url: '' })
  }

  return (
    <>
      <EditorStyleField label="텍스트">
        <Input
          value={text}
          onChange={(e) => updateSectionContent(section.id, { text: e.target.value })}
          placeholder="버튼"
        />
      </EditorStyleField>

      <EditorStyleField label="링크">
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
            value={url}
            onChange={(e) => updateSectionContent(section.id, { url: e.target.value })}
            placeholder="https://example.com"
          />
        ) : (
          <EditorPageLinkPicker
            selectedPageId={pageIdOf(url)}
            onSelect={(pageId) =>
              updateSectionContent(section.id, { url: `${PAGE_LINK_PREFIX}${handle}/${pageId}` })
            }
          />
        )}
      </EditorStyleField>

      <EditorStyleField label="크기">
        <div className="flex gap-1">
          {SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { size: option.value })}
              className={cn(SEG_BASE, 'flex-1', size === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorStyleField label="너비">
        <div className="flex gap-1">
          {WIDTH_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { width: option.value })}
              className={cn(SEG_BASE, 'flex-1', width === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorAlignField
        align={align}
        onChange={(value) => updateSectionStyle(section.id, { align: value })}
      />

      <EditorStyleField label="모양">
        <div className="flex gap-1">
          {SHAPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { shape: option.value })}
              className={cn(SEG_BASE, 'flex-1', shape === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorColorField
        label="배경 색상"
        color={color}
        onChange={(value) => updateSectionStyle(section.id, { color: value })}
      />

      <EditorColorField
        label="글자 색상"
        color={textColor}
        defaultColor="var(--background)"
        onChange={(value) => updateSectionStyle(section.id, { textColor: value })}
      />
    </>
  )
}

export default EditorButtonStylePanel
