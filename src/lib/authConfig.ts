import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Kakao from 'next-auth/providers/kakao'
import Naver from 'next-auth/providers/naver'

// middleware 공통 설정
export const authConfig = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // 토큰의 id/handle 세션 노출
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string
      }
      if (token.handle) {
        session.user.handle = token.handle as string
      }

      return session
    },
  },
} satisfies NextAuthConfig
