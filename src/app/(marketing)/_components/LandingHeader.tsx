import Link from 'next/link'

import ThemeToggle from '@/components/common/ThemeToggle'

const LandingHeader = () => {
  return (
    <header className="bg-background w-full shrink-0 border-b">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-lg font-extrabold tracking-tight">
          Blanoir
        </Link>
        <nav className="flex items-center gap-3">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

export default LandingHeader
