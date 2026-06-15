'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { sendResetCode } from '@/actions/auth'
import FieldErrorText from '@/components/common/FieldErrorText'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { type ForgotPasswordValues, forgotPasswordSchema } from '@/types/auth'

const ResetEmailStep = ({ onSent }: { onSent: (email: string) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (values: ForgotPasswordValues) => {
    const result = await sendResetCode(values)
    if (!result.ok) {
      toast.error(result.message)
      return
    }

    onSent(values.email)
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
        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting ? '보내는 중…' : '인증코드 받기'}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default ResetEmailStep
