'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { registerUser } from '@/actions/auth'
import FieldErrorText from '@/components/common/FieldErrorText'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { type SignupValues, signupSchema } from '@/types/auth'

const SignupForm = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) })

  const onSubmit = async (values: SignupValues) => {
    const result = await registerUser(values)
    if (!result.ok) {
      if (result.field) {
        setError(result.field, { message: result.message })
      } else {
        toast.error(result.message)
      }
      return
    }

    const login = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    })
    if (login?.error) {
      toast.error('가입은 됐지만 자동 로그인에 실패했어요. 로그인 페이지에서 다시 시도해 주세요')
      router.push('/login')
      return
    }

    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-3">
        <Field>
          <FieldLabel htmlFor="name">닉네임</FieldLabel>
          <Input
            id="name"
            placeholder="닉네임을 입력해 주세요"
            autoComplete="nickname"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          <FieldErrorText message={errors.name?.message} />
        </Field>
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
            placeholder="8자 이상 입력해 주세요"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <FieldErrorText message={errors.password?.message} />
        </Field>
        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : '회원가입'}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default SignupForm
