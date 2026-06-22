import type { Metadata } from 'next'
import Link from 'next/link'

import AuthCardMotion from './_components/AuthCardMotion'
import ThemeToggle from '@/components/common/ThemeToggle'

// 인증 화면은 검색에 미노출
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Link href="/" className="font-heading mb-8 text-2xl font-extrabold tracking-tight">
        Blanoir
      </Link>
      <AuthCardMotion>{children}</AuthCardMotion>
    </div>
  )
}

export default AuthLayout
