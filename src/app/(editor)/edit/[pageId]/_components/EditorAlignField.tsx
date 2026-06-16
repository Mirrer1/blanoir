'use client'

import { AlignCenter, AlignLeft, AlignRight, type LucideIcon } from 'lucide-react'

import EditorStyleField from './EditorStyleField'
import { ICON_BASE, SEG_OFF, SEG_ON } from './editorControlStyles'
import { cn } from '@/lib/utils'
import type { TextAlign } from '@/types/section'

const ALIGN_OPTIONS: { value: TextAlign; icon: LucideIcon; label: string }[] = [
  { value: 'left', icon: AlignLeft, label: '왼쪽 정렬' },
  { value: 'center', icon: AlignCenter, label: '가운데 정렬' },
  { value: 'right', icon: AlignRight, label: '오른쪽 정렬' },
]

interface EditorAlignFieldProps {
  align: TextAlign
  onChange: (align: TextAlign) => void
}

const EditorAlignField = ({ align, onChange }: EditorAlignFieldProps) => (
  <EditorStyleField label="정렬">
    <div className="flex gap-1">
      {ALIGN_OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          aria-label={label}
          onClick={() => onChange(value)}
          className={cn(ICON_BASE, align === value ? SEG_ON : SEG_OFF)}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  </EditorStyleField>
)

export default EditorAlignField
