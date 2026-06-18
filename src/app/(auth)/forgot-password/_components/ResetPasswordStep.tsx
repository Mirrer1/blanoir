'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { resetPassword } from '@/actions/auth'
import FieldErrorText from '@/components/common/FieldErrorText'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { type ResetPasswordValues, resetPasswordSchema } from '@/types/auth'

interface ResetPasswordStepProps {
  email: string
  code: string
  onDone: () => void
}

const ResetPasswordStep = ({ email, code, onDone }: ResetPasswordStepProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async (values: ResetPasswordValues) => {
    const result = await resetPassword(email, code, values)
    if (!result.ok) {
      toast.error(result.message)
      return
    }

    onDone()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-3">
        <Field>
          <FieldLabel htmlFor="password">새 비밀번호</FieldLabel>
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
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : '비밀번호 변경'}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default ResetPasswordStep
