'use client'

import { Copy } from 'lucide-react'

interface DashboardDuplicateButtonProps {
  onDuplicate: () => void
}

const DashboardDuplicateButton = ({ onDuplicate }: DashboardDuplicateButtonProps) => (
  <button
    onClick={onDuplicate}
    aria-label="페이지 복제"
    className="bg-background/90 text-muted-foreground hover:text-foreground absolute top-2 right-11 z-10 flex size-8 cursor-pointer items-center justify-center rounded-md border opacity-0 backdrop-blur transition-all group-hover:opacity-100 pointer-coarse:opacity-100"
  >
    <Copy className="size-4" />
  </button>
)

export default DashboardDuplicateButton
