'use server'

import bcrypt from 'bcryptjs'

import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { type SignupValues, signupSchema } from '@/types/auth'
import { generateHandle } from '@/utils/handle'

type RegisterResult = { ok: true } | { ok: false; field?: 'email'; message: string }

export async function registerUser(values: SignupValues): Promise<RegisterResult> {
  const parsed = signupSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false, message: '입력값을 확인해 주세요' }
  }

  const { email, password, name } = parsed.data

  await connectDB()

  const existing = await User.findOne({ email })
  if (existing) {
    return { ok: false, field: 'email', message: '이미 가입된 이메일이에요' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // handle이 이미 있으면 숫자 접미사를 붙여 유일하게 만든다
  const base = generateHandle(name)
  let handle = base
  let suffix = 2
  while (await User.exists({ handle })) {
    handle = `${base}_${suffix}`
    suffix += 1
  }

  await User.create({ email, password: hashedPassword, name, handle, provider: 'local' })

  return { ok: true }
}
