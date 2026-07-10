import { Compass, Settings } from 'lucide-react'
import Link from 'next/link'

import IconTooltip from '@/components/common/IconTooltip'
import ThemeToggle from '@/components/common/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'

const AppHeader = () => {
  return (
    <header className="bg-background w-full shrink-0 border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/dashboard" className="font-heading text-lg font-extrabold tracking-tight">
          Blanoir
        </Link>
        <TooltipProvider delay={300}>
          <div className="flex items-center gap-1">
            <IconTooltip label="둘러보기">
              <Link
                href="/explore"
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                aria-label="둘러보기"
              >
                <Compass className="size-5" />
              </Link>
            </IconTooltip>
            <ThemeToggle tooltip="테마" />
            <IconTooltip label="설정">
              <Link
                href="/settings"
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                aria-label="설정"
              >
                <Settings className="size-5" />
              </Link>
            </IconTooltip>
          </div>
        </TooltipProvider>
      </div>
    </header>
  )
}

export default AppHeader
