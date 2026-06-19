'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { changePassword } from '@/actions/user'
import FieldErrorText from '@/components/common/FieldErrorText'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { type PasswordChangeValues, passwordChangeSchema } from '@/types/user'

const SettingsPasswordForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    mode: 'onChange',
    defaultValues: { currentPassword: '', newPassword: '' },
  })

  const onSubmit = async (values: PasswordChangeValues) => {
    const result = await changePassword(values)
    if (!result.ok) {
      if (result.field) {
        setError(result.field, { message: result.message })
      } else {
        toast.error(result.message)
      }
      return
    }

    reset()
    toast.success('비밀번호를 변경했어요')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel htmlFor="currentPassword">현재 비밀번호</FieldLabel>
          <Input
            id="currentPassword"
            type="password"
            placeholder="현재 비밀번호를 입력해 주세요"
            autoComplete="current-password"
            aria-invalid={!!errors.currentPassword}
            {...register('currentPassword')}
          />
          <FieldErrorText message={errors.currentPassword?.message} />
        </Field>
        <Field>
          <FieldLabel htmlFor="newPassword">새 비밀번호</FieldLabel>
          <Input
            id="newPassword"
            type="password"
            placeholder="8자 이상 입력해 주세요"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            {...register('newPassword')}
          />
          <FieldErrorText message={errors.newPassword?.message} />
        </Field>
        <Button
          type="submit"
          className="w-fit min-w-36 self-end"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : '비밀번호 변경'}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default SettingsPasswordForm
