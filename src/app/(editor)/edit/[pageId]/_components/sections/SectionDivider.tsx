import type { CSSProperties } from 'react'

import type { DividerSection } from '@/types/section'

const THICKNESS_WIDTH = { thin: '1px', medium: '2px', thick: '4px' } as const

const SectionDivider = ({ section }: { section: DividerSection }) => {
  const { variant, thickness, color } = section.style
  const lineStyle: CSSProperties = {
    border: 0,
    borderTopWidth: THICKNESS_WIDTH[thickness],
    borderTopStyle: variant,
    borderTopColor: color || 'var(--border)',
  }

  return <hr style={lineStyle} className="my-3 w-full" />
}

export default SectionDivider
