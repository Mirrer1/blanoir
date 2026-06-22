import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'

import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { koreanFontVariables } from '@/lib/fonts'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site'
import Providers from '@/providers/Providers'

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-sans',
  display: 'swap',
  weight: '100 900',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const naverVerification = process.env.NAVER_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: '%s | Blanoir' },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    '노코드',
    '노코드 빌더',
    '홈페이지 빌더',
    '홈페이지 만들기',
    '무료 홈페이지',
    '무료 웹사이트',
    '웹사이트 제작',
    '페이지 제작',
    '포트폴리오',
    '청첩장',
    '이력서',
    '매장 소개',
    '한글',
    'Blanoir',
    '블라누아',
    '블루누아',
  ],
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'ko_KR',
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: SITE_TITLE, description: SITE_DESCRIPTION },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    ...(naverVerification ? { other: { 'naver-site-verification': naverVerification } } : {}),
  },
}

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${pretendard.variable} ${geistMono.variable} ${koreanFontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}

export default RootLayout
