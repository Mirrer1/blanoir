import Link from 'next/link'

import LandingBrowseButton from './LandingBrowseButton'
import ThemeToggle from '@/components/common/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const LandingHeader = () => {
  return (
    <header className="bg-background w-full shrink-0 border-b">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-lg font-extrabold tracking-tight">
          Blanoir
        </Link>
        <nav className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: 'ghost' }), 'border-foreground/30 min-w-20')}
          >
            로그인
          </Link>
          <LandingBrowseButton className={cn(buttonVariants(), 'min-w-20')}>
            구경하기
          </LandingBrowseButton>
        </nav>
      </div>
    </header>
  )
}

export default LandingHeader
