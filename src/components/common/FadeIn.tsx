'use client'

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

import useIsSmallScreen from '@/hooks/useIsSmallScreen'

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

// 모션 최소화 설정 구독
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
const subscribeReduced = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

// 초기 뷰포트 페이드업 래퍼
const FadeIn = ({ children, delay = 0, className }: FadeInProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const isSmall = useIsSmallScreen()
  const reducedMotion = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  )
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

  const style: CSSProperties = reducedMotion
    ? { opacity: 1 }
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ${EASE} ${effectiveDelay}s, transform 0.6s ${EASE} ${effectiveDelay}s`,
      }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}

export default FadeIn
