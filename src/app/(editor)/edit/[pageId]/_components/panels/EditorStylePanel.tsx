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
  containerSection,
}: {
  section: Section
  containerSection: Section
}) => {
  const uploadingIds = useEditorStore((s) => s.uploadingSectionIds)
  const selectSection = useEditorStore((s) => s.selectSection)
  const panelTab = useEditorStore((s) => s.panelTab)
  const setPanelTab = useEditorStore((s) => s.setPanelTab)
  const columnsForManage = containerSection.type === 'columns' ? containerSection : null

  return (
    <div
      className={cn(
        'border-border bg-background flex h-full w-80 flex-col overflow-y-auto border-l',
        '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
        (uploadingIds.includes(section.id) || uploadingIds.includes(containerSection.id)) &&
          'pointer-events-none opacity-60',
      )}
    >
      <div className="border-border flex items-center gap-1 border-b px-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setPanelTab(t.key)}
            className={cn(
              '-mb-px cursor-pointer border-b-2 px-3 py-3 text-xs font-medium transition-colors',
              panelTab === t.key
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
        {panelTab === 'background' ? (
          <>
            {columnsForManage && <EditorColumnsStylePanel section={columnsForManage} />}
            <EditorBackgroundPanel section={containerSection} />
          </>
        ) : section.type === 'columns' ? (
          <p className="text-muted-foreground text-xs leading-relaxed">편집할 칸을 클릭하세요.</p>
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
