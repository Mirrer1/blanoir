'use client'

import { ChevronLeft, Compass, LayoutTemplate, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

import { EDITOR_TEMPLATES, type EditorTemplate } from '../../templates'
import EditorLeaveDialog from './EditorLeaveDialog'
import { deleteImage } from '@/actions/upload'
import useEditorLeaveGuard from '@/hooks/useEditorLeaveGuard'
import useEditorStore from '@/store/editor'
import { sectionImageUrls } from '@/utils/imageUrls'

const EditorTemplatePanel = ({
  onCollapse,
  onApplied,
}: {
  onCollapse: () => void
  onApplied: () => void
}) => {
  const sections = useEditorStore((s) => s.sections)
  const replaceSections = useEditorStore((s) => s.replaceSections)
  const { open, setOpen, leaving, requestLeave, confirmLeave } = useEditorLeaveGuard('/explore')

  // 템플릿 적용은 즉시 덮어쓴 뒤 실행취소 토스트
  const handleApply = (template: EditorTemplate) => {
    const before = sections
    let undone = false
    let cleaned = false
    const cleanup = () => {
      if (undone || cleaned) {
        return
      }
      cleaned = true
      before.flatMap(sectionImageUrls).forEach((url) => void deleteImage(url))
    }
    replaceSections(template.build())
    onApplied()
    toast(`${template.label} 템플릿을 적용했어요`, {
      icon: <LayoutTemplate className="size-4" />,
      duration: 4000,
      action: {
        label: (
          <span className="flex items-center gap-1.5">
            <RotateCcw className="size-3.5" />
            실행취소
          </span>
        ),
        onClick: () => {
          undone = true
          replaceSections(before)
        },
      },
      onAutoClose: cleanup,
      onDismiss: cleanup,
    })
  }

  return (
    <div className="border-border bg-background flex h-full w-64 flex-col border-r">
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-medium">템플릿으로 시작</span>
        <button
          onClick={onCollapse}
          aria-label="템플릿 접기"
          className="text-muted-foreground hover:text-foreground flex size-7 cursor-pointer items-center justify-center rounded-md transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto p-3">
        {EDITOR_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleApply(template)}
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
