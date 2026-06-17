'use client'

import EditorStyleField from './EditorStyleField'
import { cn } from '@/lib/utils'

const COLOR_PALETTE = ['', '#52525B', '#DC2626', '#EA580C', '#16A34A', '#2563EB', '#7C3AED']
const RAINBOW =
  'conic-gradient(from 0deg, #DC2626, #EA580C, #D97706, #16A34A, #0891B2, #2563EB, #7C3AED, #DB2777, #DC2626)'

interface EditorColorFieldProps {
  label: string
  color: string
  onChange: (color: string) => void
  defaultColor?: string
}

const EditorColorField = ({
  label,
  color,
  onChange,
  defaultColor = 'var(--foreground)',
}: EditorColorFieldProps) => {
  const isCustom = color !== '' && !COLOR_PALETTE.includes(color)

  return (
    <EditorStyleField label={label}>
      <div className="flex flex-wrap gap-2">
        {COLOR_PALETTE.map((value) => (
          <button
            key={value || 'default'}
            aria-label={value || '기본'}
            onClick={() => onChange(value)}
            style={{ backgroundColor: value || defaultColor }}
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
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>
    </EditorStyleField>
  )
}

export default EditorColorField
