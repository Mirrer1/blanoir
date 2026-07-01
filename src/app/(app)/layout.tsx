import type { Metadata } from 'next'

import AppHeader from './_components/AppHeader'

// 로그인 후 개인 화면은 검색에 미노출
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader />
      <main className="flex-1">{children}</main>
    </>
  )
}

export default AppLayout
