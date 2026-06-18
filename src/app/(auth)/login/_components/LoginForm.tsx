'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import FieldErrorText from '@/components/common/FieldErrorText'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해 주세요').email('올바른 이메일 형식이 아니에요'),
  password: z.string().min(1, '비밀번호를 입력해 주세요'),
})

type LoginValues = z.infer<typeof loginSchema>

const LoginForm = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async ({ email, password }: LoginValues) => {
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) {
      toast.error('이메일 또는 비밀번호를 확인해 주세요')
      return
    }

    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-3">
        <Field>
          <FieldLabel htmlFor="email">이메일</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          <FieldErrorText message={errors.email?.message} />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">비밀번호</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <FieldErrorText message={errors.password?.message} />
        </Field>
        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : '로그인'}
        </Button>
        <Link
          href="/forgot-password"
          className="text-muted-foreground hover:text-foreground text-center text-sm"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
