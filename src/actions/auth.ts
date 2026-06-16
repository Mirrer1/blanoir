'use server'

import bcrypt from 'bcryptjs'

import { sendResetCodeEmail } from '@/lib/email'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import {
  type ForgotPasswordValues,
  type ResetPasswordValues,
  type SignupValues,
  forgotPasswordSchema,
  resetPasswordSchema,
  signupSchema,
} from '@/types/auth'
import { generateHandle } from '@/utils/handle'
import { generateResetCode } from '@/utils/password'

// 서버 에러 공통 메시지
const UNEXPECTED_ERROR = '잠시 후 다시 시도해 주세요'

type RegisterResult = { ok: true } | { ok: false; field?: 'email'; message: string }

// 로컬 회원가입
export async function registerUser(values: SignupValues): Promise<RegisterResult> {
  try {
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

    // handle이 존재하면 접미사를 추가
    const base = generateHandle(name)
    let handle = base
    let suffix = 2
    while (await User.exists({ handle })) {
      handle = `${base}_${suffix}`
      suffix += 1
    }

    await User.create({ email, password: hashedPassword, name, handle, provider: 'local' })

    return { ok: true }
  } catch (error) {
    console.error('registerUser failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}

type ActionResult = { ok: true } | { ok: false; message: string }

const RESET_CODE_TTL_MS = 10 * 60 * 1000
const MAX_RESET_ATTEMPTS = 5

type ResetCandidate = {
  resetCode?: string | null
  resetCodeExpiresAt?: Date | null
  resetCodeAttempts?: number
  save: () => Promise<unknown>
}

// 인증코드 검증
async function verifyResetAttempt(user: ResetCandidate | null, code: string): Promise<boolean> {
  if (!user?.resetCode || !user.resetCodeExpiresAt) {
    return false
  }
  if (user.resetCodeExpiresAt.getTime() < Date.now()) {
    return false
  }

  const matched = await bcrypt.compare(code, user.resetCode)
  if (!matched) {
    const attempts = (user.resetCodeAttempts ?? 0) + 1
    if (attempts >= MAX_RESET_ATTEMPTS) {
      user.resetCode = null
      user.resetCodeExpiresAt = null
      user.resetCodeAttempts = 0
    } else {
      user.resetCodeAttempts = attempts
    }
    await user.save()
    return false
  }

  return true
}

// 암호 재설정 인증코드를 발급해 이메일로 발송
export async function sendResetCode(values: ForgotPasswordValues): Promise<ActionResult> {
  try {
    const parsed = forgotPasswordSchema.safeParse(values)
    if (!parsed.success) {
      return { ok: false, message: '이메일을 확인해 주세요' }
    }

    const { email } = parsed.data

    await connectDB()
    const user = await User.findOne({ email })
    if (!user) {
      return { ok: false, message: '가입되지 않은 이메일이에요' }
    }
    if (user.provider !== 'local') {
      return { ok: false, message: '소셜 로그인으로 가입된 계정이에요' }
    }

    const code = generateResetCode()
    user.resetCode = await bcrypt.hash(code, 10)
    user.resetCodeExpiresAt = new Date(Date.now() + RESET_CODE_TTL_MS)
    user.resetCodeAttempts = 0
    await user.save()
    await sendResetCodeEmail(email, code)

    return { ok: true }
  } catch (error) {
    console.error('sendResetCode failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}

// 인증코드 유효성 검사
export async function verifyResetCode(email: string, code: string): Promise<ActionResult> {
  try {
    await connectDB()
    const user = await User.findOne({ email })

    if (!(await verifyResetAttempt(user, code))) {
      return { ok: false, message: '인증코드가 올바르지 않거나 만료됐어요' }
    }

    return { ok: true }
  } catch (error) {
    console.error('verifyResetCode failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}

// 인증코드 재검증 후 새 비밀번호로 교체
export async function resetPassword(
  email: string,
  code: string,
  values: ResetPasswordValues,
): Promise<ActionResult> {
  try {
    const parsed = resetPasswordSchema.safeParse(values)
    if (!parsed.success) {
      return { ok: false, message: '비밀번호를 확인해 주세요' }
    }

    await connectDB()
    const user = await User.findOne({ email })

    if (!user || !(await verifyResetAttempt(user, code))) {
      return { ok: false, message: '인증코드가 올바르지 않거나 만료됐어요' }
    }

    user.password = await bcrypt.hash(parsed.data.password, 10)
    user.resetCode = null
    user.resetCodeExpiresAt = null
    user.resetCodeAttempts = 0
    await user.save()

    return { ok: true }
  } catch (error) {
    console.error('resetPassword failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}
