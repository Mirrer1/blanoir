import Link from 'next/link'

import ThemeToggle from '@/components/common/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'

const LandingHeader = () => {
  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-lg font-extrabold tracking-tight">
          Blanoir
        </Link>
        <nav className="flex items-center gap-1">
          <ThemeToggle />
          <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'lg' })}>
            로그인
          </Link>
          <Link href="/signup" className={buttonVariants({ size: 'lg' })}>
            시작하기
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default LandingHeader
