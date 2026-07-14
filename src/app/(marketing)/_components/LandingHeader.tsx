'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import ThemeToggle from '@/components/common/ThemeToggle'
import { cn } from '@/lib/utils'

const LandingHeader = () => {
  const [onDark, setOnDark] = useState(true)

  useEffect(() => {
    const scroller = document.querySelector('main')
    if (!scroller) return

    const onScroll = () => setOnDark(scroller.scrollTop < scroller.clientHeight - 60)
    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'absolute inset-x-0 top-0 z-50 backdrop-blur-md transition-colors',
        onDark ? 'text-white' : 'text-foreground',
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
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
