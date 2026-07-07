'use client'

import type { ReactElement } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// 아이콘 버튼 공용 툴팁
const IconTooltip = ({ label, children }: { label: string; children: ReactElement }) => (
  <Tooltip>
    <TooltipTrigger render={children} />
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
)

export default IconTooltip
