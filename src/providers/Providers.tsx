'use client'

import { ThemeProvider } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// 전역 Provider
const Providers = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  // 라우트 이동 시 main과 window 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo({ top: 0 })
    document.querySelector('main')?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  )
}

export default Providers
