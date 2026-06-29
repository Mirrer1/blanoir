'use client'

import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

// 인증 화면 등장 모션 애니메이션
const AuthCardMotion = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      className="w-full max-w-sm"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default AuthCardMotion
