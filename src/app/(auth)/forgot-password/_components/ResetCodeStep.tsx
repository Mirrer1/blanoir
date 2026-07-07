'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { verifyResetCode } from '@/actions/auth'
import FieldErrorText from '@/components/common/FieldErrorText'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { type ResetCodeValues, resetCodeSchema } from '@/types/auth'

interface ResetCodeStepProps {
  email: string
  onVerified: (code: string) => void
}

const ResetCodeStep = ({ email, onVerified }: ResetCodeStepProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetCodeValues>({ resolver: zodResolver(resetCodeSchema) })

  const onSubmit = async ({ code }: ResetCodeValues) => {
    const result = await verifyResetCode(email, code)
    if (!result.ok) {
      setError('code', { message: result.message })
      return
    }

    onVerified(code)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-3">
        <p className="text-muted-foreground text-sm">
          <span className="text-foreground font-medium">{email}</span>로 보낸 6자리 코드를 입력해
          주세요.
        </p>
        <Field>
          <FieldLabel htmlFor="code">인증코드</FieldLabel>
          <Input
            id="code"
            inputMode="numeric"
            maxLength={6}
            placeholder="6자리 숫자"
            aria-invalid={!!errors.code}
            {...register('code')}
          />
          <FieldErrorText message={errors.code?.message} />
        </Field>
        <Button type="submit" className="h-11 w-full" loading={isSubmitting}>
          인증코드 확인
        </Button>
      </FieldGroup>
    </form>
  )
}

export default ResetCodeStep
