import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'
import type { ButtonSection } from '@/types/section'

const SHAPE_CLASS = { square: 'rounded-md', rounded: 'rounded-full' } as const
const SIZE_CLASS = {
  small: 'px-8 py-2.5 text-sm',
  medium: 'px-12 py-3 text-base',
  large: 'px-16 py-4 text-xl',
} as const
const WIDTH_CLASS = { auto: '', wide: 'w-1/2', full: 'w-full' } as const
const JUSTIFY_CLASS = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
} as const

const SectionButton = ({ section }: { section: ButtonSection }) => {
  const { text } = section.content
  const { color, shape, size, width, align } = section.style

  const buttonStyle: CSSProperties = {
    backgroundColor: color || 'var(--foreground)',
    color: 'var(--background)',
  }

  return (
    <div className={cn('flex', JUSTIFY_CLASS[align])}>
      <span
        style={buttonStyle}
        className={cn(
          'inline-flex items-center justify-center font-medium',
          SIZE_CLASS[size],
          SHAPE_CLASS[shape],
          WIDTH_CLASS[width],
        )}
      >
        {text || '버튼'}
      </span>
    </div>
  )
}

export default SectionButton
