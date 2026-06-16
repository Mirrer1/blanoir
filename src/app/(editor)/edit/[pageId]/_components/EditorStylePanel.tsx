'use client'

import EditorButtonStylePanel from './EditorButtonStylePanel'
import EditorDividerStylePanel from './EditorDividerStylePanel'
import EditorImageStylePanel from './EditorImageStylePanel'
import EditorTextStylePanel from './EditorTextStylePanel'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { Section } from '@/types/section'

const EditorStylePanel = ({ section }: { section: Section }) => {
  const imageUploading = useEditorStore((s) => s.imageUploading)

  return (
    <div
      className={cn(
        'border-border bg-background flex h-full w-72 flex-col gap-6 overflow-y-auto border-l p-4',
        imageUploading && 'pointer-events-none opacity-60',
      )}
    >
      <p className="text-sm font-semibold">스타일</p>
      {section.type === 'divider' ? (
        <EditorDividerStylePanel section={section} />
      ) : section.type === 'button' ? (
        <EditorButtonStylePanel section={section} />
      ) : section.type === 'image' ? (
        <EditorImageStylePanel section={section} />
      ) : (
        <EditorTextStylePanel section={section} />
      )}
    </div>
  )
}

export default EditorStylePanel
