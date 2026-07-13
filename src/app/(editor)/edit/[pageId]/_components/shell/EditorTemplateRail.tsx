'use client'

import { Compass } from 'lucide-react'

import { EDITOR_TEMPLATES } from '../../templates'
import EditorLeaveDialog from './EditorLeaveDialog'
import EditorTooltip from './EditorTooltip'
import useApplyTemplate from '@/hooks/useApplyTemplate'
import useEditorLeaveGuard from '@/hooks/useEditorLeaveGuard'

// 템플릿 사이드바 아이콘 레일
const EditorTemplateRail = ({ onApplied }: { onApplied: () => void }) => {
  const applyTemplate = useApplyTemplate(onApplied)
  const { open, setOpen, leaving, requestLeave, confirmLeave } = useEditorLeaveGuard('/explore')

  return (
    <div className="bg-background flex h-full w-14 flex-col items-center gap-1.5 pt-3">
      {EDITOR_TEMPLATES.map((template) => (
        <EditorTooltip key={template.id} label={template.label} side="right">
          <button
            aria-label={`${template.label} 템플릿 적용`}
            onClick={() => applyTemplate(template)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-9 cursor-pointer items-center justify-center rounded-md transition-colors"
          >
            <template.icon className="size-5" strokeWidth={1.75} />
          </button>
        </EditorTooltip>
      ))}
      <EditorTooltip label="다른 템플릿" side="right">
        <button
          aria-label="다른 템플릿"
          onClick={requestLeave}
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-9 cursor-pointer items-center justify-center rounded-md transition-colors"
        >
          <Compass className="size-5" strokeWidth={1.75} />
        </button>
      </EditorTooltip>
      <EditorLeaveDialog
        open={open}
        onOpenChange={setOpen}
        leaving={leaving}
        onConfirm={confirmLeave}
      />
    </div>
  )
}

export default EditorTemplateRail
