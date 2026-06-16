'use client'

import EditorButtonStylePanel from './EditorButtonStylePanel'
import EditorDividerStylePanel from './EditorDividerStylePanel'
import EditorTextStylePanel from './EditorTextStylePanel'
import type { Section } from '@/types/section'

const EditorStylePanel = ({ section }: { section: Section }) => (
  <div className="border-border bg-background flex h-full w-72 flex-col gap-6 overflow-y-auto border-l p-4">
    <p className="text-sm font-semibold">스타일</p>
    {section.type === 'divider' ? (
      <EditorDividerStylePanel section={section} />
    ) : section.type === 'button' ? (
      <EditorButtonStylePanel section={section} />
    ) : (
      <EditorTextStylePanel section={section} />
    )}
  </div>
)

export default EditorStylePanel
