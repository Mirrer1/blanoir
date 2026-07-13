'use client'

import { Compass } from 'lucide-react'

import { EDITOR_TEMPLATES } from '../../templates'
import EditorLeaveDialog from './EditorLeaveDialog'
import useApplyTemplate from '@/hooks/useApplyTemplate'
import useEditorLeaveGuard from '@/hooks/useEditorLeaveGuard'

const EditorTemplatePanel = ({ onApplied }: { onApplied: () => void }) => {
  const applyTemplate = useApplyTemplate(onApplied)
  const { open, setOpen, leaving, requestLeave, confirmLeave } = useEditorLeaveGuard('/explore')

  return (
    <div className="bg-background flex h-full w-64 flex-col">
      <div className="border-border flex items-center border-b px-4 py-3">
        <span className="text-sm font-medium">템플릿으로 시작</span>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto p-3 pr-5">
        {EDITOR_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => applyTemplate(template)}
            className="hover:border-foreground/30 hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-left transition-colors"
          >
            <span className="bg-muted text-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
              <template.icon className="size-4.5" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{template.label}</span>
              <span className="text-muted-foreground text-xs leading-snug">
                {template.description}
              </span>
            </span>
          </button>
        ))}
        <button
          onClick={requestLeave}
          className="hover:border-foreground/30 hover:bg-muted/50 mt-1 flex cursor-pointer items-start gap-3 rounded-lg border border-dashed p-3 text-left transition-colors"
        >
          <span className="bg-muted text-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
            <Compass className="size-4.5" />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">다른 템플릿</span>
            <span className="text-muted-foreground text-xs leading-snug">
              여러 사용자의 다양한 템플릿
            </span>
          </span>
        </button>
      </div>
      <EditorLeaveDialog
        open={open}
        onOpenChange={setOpen}
        leaving={leaving}
        onConfirm={confirmLeave}
      />
    </div>
  )
}

export default EditorTemplatePanel
