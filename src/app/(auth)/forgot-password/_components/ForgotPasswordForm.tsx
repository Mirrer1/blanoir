'use client'

import { CircleCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useState } from 'react'

import ResetCodeStep from './ResetCodeStep'
import ResetEmailStep from './ResetEmailStep'
import ResetPasswordStep from './ResetPasswordStep'
import { buttonVariants } from '@/components/ui/button'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Step = 'email' | 'code' | 'password' | 'done'

const ForgotPasswordForm = () => {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const handleSent = (sentEmail: string) => {
    setEmail(sentEmail)
    setStep('code')
  }

  const handleVerified = (verifiedCode: string) => {
    setCode(verifiedCode)
    setStep('password')
  }

  return (
    <>
      {step !== 'done' ? (
        <CardHeader className="text-center">
          <CardTitle className="text-xl">비밀번호 재설정</CardTitle>
          <CardDescription>이메일로 인증코드를 받아 비밀번호를 재설정해요</CardDescription>
        </CardHeader>
      ) : null}
      <CardContent>
        <div className="flex flex-col gap-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {step === 'email' ? (
                <ResetEmailStep onSent={handleSent} />
              ) : step === 'code' ? (
                <ResetCodeStep email={email} onVerified={handleVerified} />
              ) : step === 'password' ? (
                <ResetPasswordStep email={email} code={code} onDone={() => setStep('done')} />
              ) : (
                <div className="flex flex-col items-center gap-4 py-2 text-center">
                  <CircleCheck className="size-12 text-green-600 dark:text-green-500" />
                  <div className="space-y-1">
                    <p className="font-medium">비밀번호가 변경됐어요</p>
                    <p className="text-muted-foreground text-sm">새 비밀번호로 로그인해 주세요.</p>
                  </div>
                  <Link href="/login" className={buttonVariants({ className: 'h-11 w-full' })}>
                    로그인하기
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step !== 'done' ? (
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground text-center text-sm"
            >
              로그인으로 돌아가기
            </Link>
          ) : null}
        </div>
      </CardContent>
    </>
  )
}

export default ForgotPasswordForm
