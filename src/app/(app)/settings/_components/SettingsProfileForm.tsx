'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { updateProfile } from '@/actions/user'
import FieldErrorText from '@/components/common/FieldErrorText'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { type ProfileValues, profileSchema } from '@/types/user'

interface SettingsProfileFormProps {
  defaultName: string
  defaultHandle: string
}

const SettingsProfileForm = ({ defaultName, defaultHandle }: SettingsProfileFormProps) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: defaultName, handle: defaultHandle },
  })

  const handleInputRef = useRef<HTMLInputElement>(null)
  const { ref: handleRef, ...handleField } = register('handle')

  const onSubmit = async (values: ProfileValues) => {
    const result = await updateProfile(values)
    if (!result.ok) {
      if (result.field) {
        setError(result.field, { message: result.message })
      } else {
        toast.error(result.message)
      }
      return
    }

    reset(values)
    toast.success('프로필을 저장했어요')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-1 flex-col">
      <FieldGroup className="gap-4">
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
          <FieldLabel htmlFor="handle">페이지 주소</FieldLabel>
          <p className="text-muted-foreground -mt-1 text-xs">
            공개 페이지가 열리는 주소로 영문 소문자·숫자·밑줄(_)만 쓸 수 있어요
          </p>
          <div
            onClick={() => handleInputRef.current?.focus()}
            className={cn(
              'dark:bg-input/30 flex h-8 cursor-text items-center rounded-lg border bg-transparent px-2.5 text-base transition-colors focus-within:ring-3 md:text-sm',
              errors.handle
                ? 'border-destructive ring-destructive/20 ring-3'
                : 'border-input focus-within:border-ring focus-within:ring-ring/50',
            )}
          >
            <span className="text-muted-foreground shrink-0">/user/</span>
            <input
              id="handle"
              autoComplete="off"
              placeholder="아이디"
              aria-invalid={!!errors.handle}
              className="[field-sizing:content] bg-transparent px-0.5 outline-none"
              {...handleField}
              ref={(element) => {
                handleRef(element)
                handleInputRef.current = element
              }}
            />
            <span className="text-muted-foreground/60 shrink truncate">/페이지별 주소</span>
          </div>
          <FieldErrorText message={errors.handle?.message} />
        </Field>
      </FieldGroup>
      <Button
        type="submit"
        className="mt-2 w-fit min-w-36 self-end"
        disabled={!isDirty}
        loading={isSubmitting}
      >
        저장
      </Button>
    </form>
  )
}

export default SettingsProfileForm
