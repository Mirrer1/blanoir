import type { CSSProperties } from 'react'

import type { DividerSection } from '@/types/section'
import { fillBackground, isGradient } from '@/utils/colorFill'

const THICKNESS_WIDTH = { thin: '1px', medium: '2px', thick: '4px' } as const

const SectionDivider = ({ section }: { section: DividerSection }) => {
  const { variant, thickness, color } = section.style
  // 그레디언트는 보더색이 불가능해 랜더
  const lineStyle: CSSProperties =
    color && isGradient(color)
      ? { border: 0, height: THICKNESS_WIDTH[thickness], ...fillBackground(color) }
      : {
          border: 0,
          borderTopWidth: THICKNESS_WIDTH[thickness],
          borderTopStyle: variant,
          borderTopColor: color || 'var(--border)',
        }

  return <hr style={lineStyle} className="my-3 w-full" />
}

export default SectionDivider
