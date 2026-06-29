import Link from 'next/link'
import type { ReactNode } from 'react'

interface LandingBrowseButtonProps {
  className?: string
  children: ReactNode
}

// 구경하기 기능 준비 전이라 로그인으로 연결
const LandingBrowseButton = ({ className, children }: LandingBrowseButtonProps) => (
  <Link href="/login" className={className}>
    {children}
  </Link>
)

export default LandingBrowseButton
