'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// 라우트 이동 시 내부 스크롤 컨테이너를 맨 위로 초기화
const ScrollReset = ({ targetId }: { targetId: string }) => {
  const pathname = usePathname()

  useEffect(() => {
    document.getElementById(targetId)?.scrollTo({ top: 0 })
  }, [pathname, targetId])

  return null
}

export default ScrollReset
