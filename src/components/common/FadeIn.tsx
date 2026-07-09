'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import useIsSmallScreen from '@/hooks/useIsSmallScreen'

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
}

// 스크롤로 화면에 들어올 때 한 번 페이드업. 서버 컴포넌트 콘텐츠를 감싸는 용도.
const FadeIn = ({ children, delay = 0, className }: FadeInProps) => {
  const reduceMotion = useReducedMotion()
  const isSmall = useIsSmallScreen()

  const effectiveDelay = isSmall ? 0 : delay
  const offset = reduceMotion ? 0 : 24

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: effectiveDelay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default FadeIn
