'use client'

import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, type LucideIcon } from 'lucide-react'

import { FONT_OPTIONS } from '@/lib/fontOptions'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { Section, TextAlign, TextSize } from '@/types/section'

const SIZE_OPTIONS: { value: TextSize; label: string }[] = [
  { value: 'small', label: '작게' },
  { value: 'medium', label: '보통' },
  { value: 'large', label: '크게' },
  { value: 'xlarge', label: '매우 크게' },
]
const ALIGN_OPTIONS: { value: TextAlign; icon: LucideIcon; label: string }[] = [
  { value: 'left', icon: AlignLeft, label: '왼쪽 정렬' },
  { value: 'center', icon: AlignCenter, label: '가운데 정렬' },
  { value: 'right', icon: AlignRight, label: '오른쪽 정렬' },
]
const COLOR_PALETTE = ['', '#52525B', '#DC2626', '#EA580C', '#16A34A', '#2563EB', '#7C3AED']
const RAINBOW =
  'conic-gradient(from 0deg, #DC2626, #EA580C, #D97706, #16A34A, #0891B2, #2563EB, #7C3AED, #DB2777, #DC2626)'

const SEG_BASE = 'cursor-pointer rounded-md border px-2 py-1.5 text-xs transition-colors'
const SEG_ON = 'bg-foreground text-background border-foreground'
const SEG_OFF = 'text-foreground hover:bg-muted'
const ICON_BASE =
  'flex size-8 cursor-pointer items-center justify-center rounded-md border transition-colors'

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <p className="text-muted-foreground text-xs font-medium">{label}</p>
    {children}
  </div>
)

const EditorStylePanel = ({ section }: { section: Section }) => {
  const updateSectionStyle = useEditorStore((s) => s.updateSectionStyle)
  const { size, align, bold, italic, color, font } = section.style
  const isCustom = color !== '' && !COLOR_PALETTE.includes(color)

  return (
    <div className="border-border flex h-full w-72 flex-col gap-6 overflow-y-auto border-l p-4">
      <p className="text-sm font-semibold">스타일</p>

      <Field label="폰트">
        <div className="grid grid-cols-2 gap-1">
          {FONT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { font: option.value })}
              style={{ fontFamily: option.cssVar }}
              className={cn(SEG_BASE, font === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="크기">
        <div className="grid grid-cols-2 gap-1">
          {SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { size: option.value })}
              className={cn(SEG_BASE, size === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="정렬">
        <div className="flex gap-1">
          {ALIGN_OPTIONS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              aria-label={label}
              onClick={() => updateSectionStyle(section.id, { align: value })}
              className={cn(ICON_BASE, align === value ? SEG_ON : SEG_OFF)}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </Field>

      <Field label="강조">
        <div className="flex gap-1">
          <button
            aria-label="굵게"
            onClick={() => updateSectionStyle(section.id, { bold: !bold })}
            className={cn(ICON_BASE, bold ? SEG_ON : SEG_OFF)}
          >
            <Bold className="size-4" />
          </button>
          <button
            aria-label="기울임"
            onClick={() => updateSectionStyle(section.id, { italic: !italic })}
            className={cn(ICON_BASE, italic ? SEG_ON : SEG_OFF)}
          >
            <Italic className="size-4" />
          </button>
        </div>
      </Field>

      <Field label="색상">
        <div className="flex flex-wrap gap-2">
          {COLOR_PALETTE.map((value) => (
            <button
              key={value || 'default'}
              aria-label={value || '기본'}
              onClick={() => updateSectionStyle(section.id, { color: value })}
              style={{ backgroundColor: value || 'var(--foreground)' }}
              className={cn(
                'size-6 cursor-pointer rounded-full border transition-transform hover:scale-110',
                color === value && 'ring-foreground ring-offset-background ring-2 ring-offset-2',
              )}
            />
          ))}
          <label
            aria-label="사용자 지정 색"
            style={isCustom ? { backgroundColor: color } : { background: RAINBOW }}
            className={cn(
              'relative size-6 cursor-pointer overflow-hidden rounded-full border transition-transform hover:scale-110',
              isCustom && 'ring-foreground ring-offset-background ring-2 ring-offset-2',
            )}
          >
            <input
              type="color"
              value={color || '#000000'}
              onChange={(e) => updateSectionStyle(section.id, { color: e.target.value })}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>
      </Field>
    </div>
  )
}

export default EditorStylePanel
