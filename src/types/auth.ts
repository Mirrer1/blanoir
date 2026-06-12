import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().min(1, '이메일을 입력해 주세요').email('올바른 이메일 형식이 아니에요'),
  password: z.string().min(8, '비밀번호는 8자 이상이에요'),
  name: z.string().min(1, '닉네임을 입력해 주세요').max(20, '닉네임은 20자 이하예요'),
})

export type SignupValues = z.infer<typeof signupSchema>
