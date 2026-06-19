'use server'

import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

import { deleteImage } from './upload'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoDB'
import User from '@/models/User'
import {
  type PasswordChangeValues,
  type ProfileValues,
  passwordChangeSchema,
  profileSchema,
} from '@/types/user'

const UNEXPECTED_ERROR = '잠시 후 다시 시도해 주세요'

type ProfileResult = { ok: true } | { ok: false; field?: 'handle'; message: string }

// 닉네임과 페이지 주소 변경
export async function updateProfile(values: ProfileValues): Promise<ProfileResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    const parsed = profileSchema.safeParse(values)
    if (!parsed.success) {
      return { ok: false, message: '입력값을 확인해 주세요' }
    }

    const { name, handle } = parsed.data

    await connectDB()
    const taken = await User.exists({ handle, _id: { $ne: session.user.id } })
    if (taken) {
      return { ok: false, field: 'handle', message: '이미 사용 중인 주소예요' }
    }

    await User.updateOne({ _id: session.user.id }, { name, handle })
    revalidatePath('/settings')
    return { ok: true }
  } catch (error) {
    console.error('updateProfile failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}

type ActionResult = { ok: true } | { ok: false; message: string }

// 프로필 이미지를 교체 및 기존 업로드 이미지 정리
export async function updateProfileImage(url: string): Promise<ActionResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    await connectDB()
    const user = await User.findById(session.user.id)
      .select('profileImage')
      .lean<{ profileImage: string } | null>()

    await User.updateOne({ _id: session.user.id }, { profileImage: url })

    const previous = user?.profileImage
    if (previous && previous !== url) {
      await deleteImage(previous)
    }

    revalidatePath('/settings')
    return { ok: true }
  } catch (error) {
    console.error('updateProfileImage failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}

type PasswordResult =
  | { ok: true }
  | { ok: false; field?: 'currentPassword' | 'newPassword'; message: string }

// 로컬 계정 비밀번호 확인 후 교체
export async function changePassword(values: PasswordChangeValues): Promise<PasswordResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    const parsed = passwordChangeSchema.safeParse(values)
    if (!parsed.success) {
      return { ok: false, message: '입력값을 확인해 주세요' }
    }

    await connectDB()
    const user = await User.findById(session.user.id).select('password provider')
    if (!user) {
      return { ok: false, message: '계정을 찾을 수 없어요' }
    }
    if (user.provider !== 'local' || !user.password) {
      return { ok: false, message: '소셜 로그인 계정은 비밀번호를 변경할 수 없어요' }
    }

    const matched = await bcrypt.compare(parsed.data.currentPassword, user.password)
    if (!matched) {
      return { ok: false, field: 'currentPassword', message: '현재 비밀번호가 일치하지 않아요' }
    }

    if (parsed.data.newPassword === parsed.data.currentPassword) {
      return { ok: false, field: 'newPassword', message: '기존과 다른 비밀번호를 입력해 주세요' }
    }

    user.password = await bcrypt.hash(parsed.data.newPassword, 10)
    await user.save()
    return { ok: true }
  } catch (error) {
    console.error('changePassword failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}
