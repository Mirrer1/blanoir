import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { authConfig } from './auth.config'
import { connectDB } from './mongodb'
import User, { type Provider } from '@/models/User'
import { generateHandle } from '@/utils/handle'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: { email: {}, password: {} },
      // 이메일과 비밀번호 DB bcrypt 해시와 비교
      authorize: async (credentials) => {
        const email = credentials?.email as string
        const password = credentials?.password as string
        if (!email || !password) {
          return null
        }

        await connectDB()
        const user = await User.findOne({ email })
        if (!user?.password) {
          return null
        }

        const matched = await bcrypt.compare(password, user.password)
        if (!matched) {
          return null
        }

        return { id: String(user._id), email: user.email, name: user.name, handle: user.handle }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    // 소셜 첫 로그인 시 DB에 사용자 생성
    signIn: async ({ user, account }) => {
      if (account?.provider === 'credentials') {
        return true
      }
      if (!user.email) {
        return false
      }

      await connectDB()
      const existing = await User.findOne({ email: user.email })
      if (!existing) {
        await User.create({
          email: user.email,
          name: user.name ?? '사용자',
          handle: generateHandle(user.name ?? user.email),
          profileImage: user.image ?? '',
          provider: (account?.provider ?? 'local') as Provider,
        })
      }

      return true
    },
    // 로그인 시 토큰에 DB의 id/handle 추가
    jwt: async ({ token, user }) => {
      if (user?.email) {
        await connectDB()
        const dbUser = await User.findOne({ email: user.email })
        if (dbUser) {
          token.id = String(dbUser._id)
          token.handle = dbUser.handle
        }
      }

      return token
    },
  },
})
