import { Settings } from 'lucide-react'
import Link from 'next/link'

import ThemeToggle from '@/components/common/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { cn } from '@/lib/utils'

const ExploreHeader = async () => {
  const session = await auth()
  const isLoggedIn = !!session?.user
  const homeHref = isLoggedIn ? '/dashboard' : '/'

  return (
    <header className="bg-background w-full shrink-0 border-b">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href={homeHref} className="font-heading text-lg font-extrabold tracking-tight">
          Blanoir
        </Link>
        <nav className="flex items-center gap-1">
          <ThemeToggle />
          {isLoggedIn ? (
            <Link
              href="/settings"
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
              aria-label="설정"
            >
              <Settings className="size-5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: 'ghost' }), 'border-foreground/30')}
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default ExploreHeader
