import type { Metadata } from 'next'
import Link from 'next/link'

import AuthCardMotion from './_components/AuthCardMotion'
import ThemeToggle from '@/components/common/ThemeToggle'
import { Toaster } from '@/components/ui/sonner'

// 인증 화면은 검색에 미노출
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="bg-background w-full shrink-0 border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-heading text-lg font-extrabold tracking-tight">
            Blanoir
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 [scrollbar-gutter:stable] flex-col items-center justify-center overflow-y-auto px-6 py-12">
        <AuthCardMotion>{children}</AuthCardMotion>
      </main>
      <Toaster />
    </div>
  )
}

export default AuthLayout
