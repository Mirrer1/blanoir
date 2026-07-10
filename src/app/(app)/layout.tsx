import type { Metadata } from 'next'

import AppHeader from './_components/AppHeader'
import { Toaster } from '@/components/ui/sonner'

// 로그인 후 개인 화면은 검색에 미노출
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[100dvh] flex-col">
      <AppHeader />
      <main className="flex-1 [scrollbar-gutter:stable] overflow-y-auto">{children}</main>
      <Toaster />
    </div>
  )
}

export default AppLayout
