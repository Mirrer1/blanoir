import Link from 'next/link'
import type { ReactNode } from 'react'

interface LandingBrowseButtonProps {
  className?: string
  children: ReactNode
}

const LandingBrowseButton = ({ className, children }: LandingBrowseButtonProps) => (
  <Link href="/explore" className={className}>
    {children}
  </Link>
)

export default LandingBrowseButton
