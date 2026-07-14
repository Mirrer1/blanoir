'use client'

import { Compass, HelpCircle } from 'lucide-react'
import { type ReactElement } from 'react'

import { EDITOR_TEMPLATES } from '../../templates'
import EditorLeaveDialog from './EditorLeaveDialog'
import EditorTooltip from './EditorTooltip'
import useApplyTemplate from '@/hooks/useApplyTemplate'
import useEditorLeaveGuard from '@/hooks/useEditorLeaveGuard'

const EditorTemplatePanel = ({
  collapsed,
  onApplied,
  onHelp,
}: {
  collapsed: boolean
  onApplied: () => void
  onHelp: () => void
}) => {
  const applyTemplate = useApplyTemplate(onApplied)
  const { open, setOpen, leaving, requestLeave, confirmLeave } = useEditorLeaveGuard('/explore')

  // 트레일러 아이콘 라벨 툴팁 추가
  const withTooltip = (label: string, node: ReactElement) =>
    collapsed ? (
      <EditorTooltip label={label} side="right" sideOffset={10}>
        {node}
      </EditorTooltip>
    ) : (
      node
    )

  // 아이콘 제자리 고정
  const labelClass = `flex min-w-0 flex-col gap-0.5 transition-opacity duration-200 ${
    collapsed ? 'opacity-0' : 'opacity-100'
  }`

  // hover 배경
  const rowClass = `group flex cursor-pointer items-center gap-3 rounded-lg px-0.5 py-2 text-left transition-colors ${
    collapsed ? '' : 'hover:bg-muted'
  }`

  // hover 아이콘 배경
  const chipClass = `text-muted-foreground group-hover:text-foreground flex size-9 shrink-0 items-center justify-center rounded-md transition-colors ${
    collapsed ? 'group-hover:bg-muted' : ''
  }`

  return (
    <div className="bg-background flex h-full w-64 flex-col px-1.5">
      <div className="flex flex-1 [scrollbar-width:none] flex-col overflow-y-auto py-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div data-tour="template" className="flex flex-col gap-0.5">
          {EDITOR_TEMPLATES.map((template) => (
            <button
              key={template.id}
              aria-label={`${template.label} 템플릿`}
              onClick={() => applyTemplate(template)}
              className={rowClass}
            >
              {withTooltip(
                template.label,
                <span className={chipClass}>
                  <template.icon className="size-4.5" strokeWidth={1.75} />
                </span>,
              )}
              <span className={labelClass}>
                <span className="text-sm font-medium whitespace-nowrap">{template.label}</span>
                <span className="text-muted-foreground text-xs leading-snug whitespace-nowrap">
                  {template.description}
                </span>
              </span>
            </button>
          ))}
          <button aria-label="다른 템플릿" onClick={requestLeave} className={rowClass}>
            {withTooltip(
              '다른 템플릿',
              <span className={chipClass}>
                <Compass className="size-4.5" strokeWidth={1.75} />
              </span>,
            )}
            <span className={labelClass}>
              <span className="text-sm font-medium whitespace-nowrap">다른 템플릿</span>
              <span className="text-muted-foreground text-xs leading-snug whitespace-nowrap">
                여러 사용자의 다양한 템플릿
              </span>
            </span>
          </button>
        </div>
      </div>
      <button onClick={onHelp} aria-label="사용법 안내" className={rowClass}>
        {withTooltip(
          '사용법 안내',
          <span className={chipClass}>
            <HelpCircle className="size-5" strokeWidth={1.75} />
          </span>,
        )}
        <span
          className={`text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${
            collapsed ? 'opacity-0' : 'opacity-100'
          }`}
        >
          사용법 안내
        </span>
      </button>
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
