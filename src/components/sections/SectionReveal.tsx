'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

import type { SectionAnimation } from '@/types/section'
import { ANIMATION_TO, revealMotionFrom } from '@/utils/revealMotion'

interface SectionRevealProps {
  animation: SectionAnimation | undefined
  children: ReactNode
}

// key를 효과 값에 포함시켜 섹션 애니메이션 최초 트리거 효과
const SectionReveal = ({ animation, children }: SectionRevealProps) => {
  const from = revealMotionFrom(animation)

  return (
    <>
      {from ? (
        <motion.div
          key={animation}
          initial={from}
          whileInView={ANIMATION_TO}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </>
  )
}

export default SectionReveal
