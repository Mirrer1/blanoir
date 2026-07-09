'use client'

import { ArrowUp } from 'lucide-react'

import useHasScrolled from '@/hooks/useHasScrolled'
import { cn } from '@/lib/utils'

const scrollToTop = () => document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })

// 스크롤 최상단으로 이동시키는 업버튼
const ScrollToTopButton = () => {
  const visible = useHasScrolled()

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="맨 위로"
      className={cn(
        'bg-background/80 text-foreground hover:bg-muted fixed right-4 bottom-4 z-40 flex size-10 cursor-pointer items-center justify-center rounded-full border shadow-md backdrop-blur transition-[opacity,background-color] duration-400 sm:right-6 sm:bottom-6',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <ArrowUp className="size-4" />
    </button>
  )
}

export default ScrollToTopButton
