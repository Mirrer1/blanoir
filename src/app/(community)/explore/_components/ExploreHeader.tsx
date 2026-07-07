import { LayoutDashboard, Settings } from 'lucide-react'
import Link from 'next/link'

import IconTooltip from '@/components/common/IconTooltip'
import ThemeToggle from '@/components/common/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
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
        <TooltipProvider delay={300}>
          <nav className="flex items-center gap-1">
            {isLoggedIn && (
              <IconTooltip label="내 페이지">
                <Link
                  href="/dashboard"
                  className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                  aria-label="내 페이지"
                >
                  <LayoutDashboard className="size-5" />
                </Link>
              </IconTooltip>
            )}
            <ThemeToggle tooltip="테마" />
            {isLoggedIn ? (
              <IconTooltip label="설정">
                <Link
                  href="/settings"
                  className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                  aria-label="설정"
                >
                  <Settings className="size-5" />
                </Link>
              </IconTooltip>
            ) : (
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: 'ghost' }), 'border-foreground/30')}
              >
                로그인
              </Link>
            )}
          </nav>
        </TooltipProvider>
      </div>
    </header>
  )
}

export default ExploreHeader
