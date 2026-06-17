'use client'

import type { ReactElement } from 'react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const EditorTooltip = ({ label, children }: { label: string; children: ReactElement }) => (
  <TooltipProvider delay={300}>
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export default EditorTooltip
