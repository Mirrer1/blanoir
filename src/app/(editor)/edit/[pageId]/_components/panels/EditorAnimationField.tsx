'use client'

import {
  Ban,
  Focus,
  type LucideIcon,
  Maximize2,
  MoveDown,
  MoveLeft,
  MoveRight,
  MoveUp,
  Sparkles,
} from 'lucide-react'

import { ICON_BASE, SEG_OFF, SEG_ON } from '../../controlStyles'
import EditorTooltip from '../shell/EditorTooltip'
import EditorStyleField from './EditorStyleField'
import { cn } from '@/lib/utils'
import type { SectionAnimation } from '@/types/section'

const ANIMATION_OPTIONS: { value: SectionAnimation; icon: LucideIcon; label: string }[] = [
  { value: 'none', icon: Ban, label: '없음' },
  { value: 'up', icon: MoveUp, label: '위로' },
  { value: 'down', icon: MoveDown, label: '아래로' },
  { value: 'left', icon: MoveLeft, label: '왼쪽으로' },
  { value: 'right', icon: MoveRight, label: '오른쪽으로' },
  { value: 'fade', icon: Sparkles, label: '페이드' },
  { value: 'zoom', icon: Maximize2, label: '확대' },
  { value: 'blur', icon: Focus, label: '블러' },
]

interface EditorAnimationFieldProps {
  animation: SectionAnimation
  onChange: (animation: SectionAnimation) => void
}

const EditorAnimationField = ({ animation, onChange }: EditorAnimationFieldProps) => (
  <EditorStyleField label="등장 효과">
    <div className="flex flex-wrap gap-1">
      {ANIMATION_OPTIONS.map(({ value, icon: Icon, label }) => (
        <EditorTooltip key={value} label={label}>
          <button
            aria-label={label}
            onClick={() => onChange(value)}
            className={cn(ICON_BASE, animation === value ? SEG_ON : SEG_OFF)}
          >
            <Icon className="size-4" />
          </button>
        </EditorTooltip>
      ))}
    </div>
  </EditorStyleField>
)

export default EditorAnimationField
