'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

import useIsSmallScreen from '@/hooks/useIsSmallScreen'

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
}

// 초기 뷰포트 페이드업 래퍼
const FadeIn = ({ children, delay = 0, className }: FadeInProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const isSmall = useIsSmallScreen()
  const effectiveDelay = isSmall ? 0 : delay

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '-80px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.5s ease-out ${effectiveDelay}s, transform 0.5s ease-out ${effectiveDelay}s`,
  }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}

export default FadeIn
