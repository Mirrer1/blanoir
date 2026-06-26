'use client'

import { Clock } from 'lucide-react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'

interface LandingBrowseButtonProps {
  className?: string
  children: ReactNode
}

// TODO: 커뮤니티 진입
const LandingBrowseButton = ({ className, children }: LandingBrowseButtonProps) => {
  // 관련 기능 구현 후 링크 이동
  const handleClick = () => {
    toast('구경하기를 준비하고 있어요', { icon: <Clock className="size-4" /> })
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}

export default LandingBrowseButton
