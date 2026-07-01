import Link from 'next/link'
import type { ReactNode } from 'react'

interface LandingBrowseButtonProps {
  className?: string
  children: ReactNode
}

// TODO: 둘러보기 구현 후 롤백
const LandingBrowseButton = ({ className, children }: LandingBrowseButtonProps) => (
  <Link href="/login" className={className}>
    {children}
  </Link>
)

export default LandingBrowseButton
