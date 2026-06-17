'use client'

import EditorButtonStylePanel from './EditorButtonStylePanel'
import EditorCardStylePanel from './EditorCardStylePanel'
import EditorDividerStylePanel from './EditorDividerStylePanel'
import EditorGalleryStylePanel from './EditorGalleryStylePanel'
import EditorImageStylePanel from './EditorImageStylePanel'
import EditorSpacerStylePanel from './EditorSpacerStylePanel'
import EditorTextStylePanel from './EditorTextStylePanel'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { Section } from '@/types/section'

const EditorStylePanel = ({ section }: { section: Section }) => {
  const imageUploading = useEditorStore((s) => s.imageUploading)

  return (
    <div
      className={cn(
        'border-border bg-background flex h-full w-80 flex-col gap-6 overflow-y-auto border-l p-4',
        imageUploading && 'pointer-events-none opacity-60',
      )}
    >
      <p className="text-sm font-semibold">스타일</p>
      {section.type === 'divider' ? (
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
  )
}

export default EditorStylePanel
