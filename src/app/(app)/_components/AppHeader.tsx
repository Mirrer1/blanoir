import { Settings } from 'lucide-react'
import Link from 'next/link'

import ThemeToggle from '@/components/common/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'

const AppHeader = () => {
  return (
    <header className="bg-background w-full shrink-0 border-b">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/dashboard" className="font-heading text-lg font-extrabold tracking-tight">
          Blanoir
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/settings"
            className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            aria-label="설정"
          >
            <Settings className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
