import Link from 'next/link'

import LogoutButton from './LogoutButton'
import ThemeToggle from '@/components/common/ThemeToggle'

const AppHeader = () => {
  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/dashboard" className="font-heading text-lg font-extrabold tracking-tight">
          Blanoir
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}

export default AppHeader
