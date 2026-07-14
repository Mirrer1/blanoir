'use client'

import type { ReactElement } from 'react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const EditorTooltip = ({
  label,
  side = 'top',
  sideOffset,
  children,
}: {
  label: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  children: ReactElement
}) => (
  <TooltipProvider delay={300}>
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side={side} sideOffset={sideOffset}>
        {label}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export default EditorTooltip
