import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

import { authConfig } from '@/lib/authConfig'

const { auth } = NextAuth(authConfig)

// 로그인해야 들어갈 수 있는 경로
const isProtected = (path: string) =>
  path.startsWith('/dashboard') ||
  path.startsWith('/settings') ||
  path.startsWith('/edit') ||
  path.startsWith('/explore/share')

// 로그인하면 안 보여줄 게스트 전용 경로
const isGuestOnly = (path: string) =>
  path === '/' ||
  path.startsWith('/login') ||
  path.startsWith('/signup') ||
  path.startsWith('/forgot-password')

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth?.user
  const protectedPath = isProtected(nextUrl.pathname)
  const guestPath = isGuestOnly(nextUrl.pathname)

  let response: NextResponse
  if (protectedPath && !isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    response = NextResponse.redirect(loginUrl)
  } else if (guestPath && isLoggedIn) {
    response = NextResponse.redirect(new URL('/dashboard', nextUrl))
  } else {
    response = NextResponse.next()
  }

  // 인증 상태로 내용이 갈리는 페이지는 뒤로가기 캐시에서 제외
  if (protectedPath || guestPath) {
    response.headers.set('Cache-Control', 'no-store')
  }
  return response
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
