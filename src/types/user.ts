import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().min(1, '닉네임을 입력해 주세요').max(20, '닉네임은 20자 이하예요'),
  handle: z
    .string()
    .min(2, '주소는 2자 이상이에요')
    .max(20, '주소는 20자 이하예요')
    .regex(/^[a-z0-9_]+$/, '영문 소문자, 숫자, 밑줄(_)만 쓸 수 있어요'),
})

export type ProfileValues = z.infer<typeof profileSchema>

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해 주세요'),
  newPassword: z.string().min(8, '비밀번호는 8자 이상이에요'),
})

export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>
