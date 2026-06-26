'use client'

import { X } from 'lucide-react'

import EditorBackgroundPanel from './EditorBackgroundPanel'
import EditorButtonStylePanel from './EditorButtonStylePanel'
import EditorCardStylePanel from './EditorCardStylePanel'
import EditorColumnsStylePanel from './EditorColumnsStylePanel'
import EditorDividerStylePanel from './EditorDividerStylePanel'
import EditorGalleryStylePanel from './EditorGalleryStylePanel'
import EditorImageStylePanel from './EditorImageStylePanel'
import EditorSpacerStylePanel from './EditorSpacerStylePanel'
import EditorTextStylePanel from './EditorTextStylePanel'
import { cn } from '@/lib/utils'
import useEditorStore, { type PanelTab } from '@/store/editor'
import type { Section } from '@/types/section'

const TABS: { key: PanelTab; label: string }[] = [
  { key: 'content', label: '콘텐츠' },
  { key: 'background', label: '배경' },
]

const EditorStylePanel = ({
  section,
  isChild = false,
}: {
  section: Section
  isChild?: boolean
}) => {
  const imageUploading = useEditorStore((s) => s.imageUploading)
  const selectSection = useEditorStore((s) => s.selectSection)
  const panelTab = useEditorStore((s) => s.panelTab)
  const setPanelTab = useEditorStore((s) => s.setPanelTab)

  // 칸 자식은 컨테이너가 없어 배경 탭을 두지 않음
  const tabs = isChild ? TABS.filter((t) => t.key === 'content') : TABS
  const activeTab = isChild ? 'content' : panelTab

  return (
    <div
      className={cn(
        'border-border bg-background flex h-full w-80 flex-col overflow-y-auto border-l',
        '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
        imageUploading && 'pointer-events-none opacity-60',
      )}
    >
      <div className="border-border flex items-center gap-1 border-b px-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setPanelTab(t.key)}
            className={cn(
              '-mb-px cursor-pointer border-b-2 px-3 py-3 text-xs font-medium transition-colors',
              activeTab === t.key
                ? 'border-foreground text-foreground'
                : 'text-muted-foreground hover:text-foreground border-transparent',
            )}
          >
            {t.label}
          </button>
        ))}
        <button
          onClick={() => selectSection(null)}
          aria-label="닫기"
          className="text-muted-foreground hover:text-foreground -mb-px ml-auto flex cursor-pointer items-center justify-center self-stretch border-b-2 border-transparent px-2 transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="flex flex-col gap-6 p-4">
        {activeTab === 'background' ? (
          <EditorBackgroundPanel section={section} />
        ) : section.type === 'columns' ? (
          <EditorColumnsStylePanel section={section} />
        ) : section.type === 'divider' ? (
          <EditorDividerStylePanel section={section} />
        ) : section.type === 'spacer' ? (
          <EditorSpacerStylePanel section={section} />
        ) : section.type === 'button' ? (
          <EditorButtonStylePanel section={section} />
        ) : section.type === 'image' ? (
          <EditorImageStylePanel section={section} />
        ) : section.type === 'gallery' ? (
          <EditorGalleryStylePanel section={section} />
        ) : section.type === 'card' ? (
          <EditorCardStylePanel section={section} />
        ) : (
          <EditorTextStylePanel section={section} />
        )}
      </div>
    </div>
  )
}

export default EditorStylePanel
