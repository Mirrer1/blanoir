'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { registerUser, sendSignupCode, verifySignupCode } from '@/actions/auth'
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
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) })

  const [sentEmail, setSentEmail] = useState<string | null>(null)
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string>()
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const email = useWatch({ control, name: 'email' }) ?? ''
  const codeSent = !!sentEmail && sentEmail === email
  const verified = !!verifiedEmail && verifiedEmail === email

  // 인증코드 발송
  const handleSendCode = async () => {
    if (!(await trigger('email'))) {
      return
    }
    setSending(true)
    const result = await sendSignupCode(email)
    setSending(false)
    if (!result.ok) {
      setError('email', { message: result.message })
      return
    }
    setCode('')
    setCodeError(undefined)
    setSentEmail(email)
  }

  // 인증코드 확인
  const handleVerify = async () => {
    if (!/^\d{6}$/.test(code)) {
      setCodeError('6자리 숫자 코드를 입력해 주세요')
      return
    }
    setVerifying(true)
    const result = await verifySignupCode(email, code)
    setVerifying(false)
    if (!result.ok) {
      setCodeError(result.message)
      return
    }
    setCodeError(undefined)
    setVerifiedEmail(email)
  }

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

    try {
      const login = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })
      if (login?.error) {
        toast.error('다시 로그인해 주세요')
        router.push('/login')
        return
      }

      router.push('/dashboard')
    } catch {
      toast.error('다시 로그인해 주세요')
      router.push('/login')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-3">
        <Field>
          <FieldLabel htmlFor="email">이메일</FieldLabel>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={verified}
              aria-invalid={!!errors.email}
              className="flex-1"
              {...register('email')}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleSendCode}
              disabled={verified || sending}
              className="h-8 w-20 shrink-0"
            >
              {sending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : verified ? (
                <Check className="size-4" />
              ) : codeSent ? (
                '재전송'
              ) : (
                '인증'
              )}
            </Button>
          </div>
          <FieldErrorText message={errors.email?.message} />
        </Field>

        <AnimatePresence initial={false}>
          {codeSent && !verified && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <Field>
                <FieldLabel htmlFor="code">인증코드</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6자리 숫자"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value)
                      setCodeError(undefined)
                    }}
                    aria-invalid={!!codeError}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerify}
                    disabled={verifying}
                    className="h-8 w-20 shrink-0"
                  >
                    {verifying ? <Loader2 className="size-4 animate-spin" /> : '확인'}
                  </Button>
                </div>
                <FieldErrorText message={codeError} />
              </Field>
            </motion.div>
          )}
        </AnimatePresence>

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
        <Button type="submit" className="h-11 w-full" disabled={!verified || isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : '회원가입'}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default SignupForm
