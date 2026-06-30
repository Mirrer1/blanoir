import type { Metadata } from 'next'

import ForgotPasswordForm from './_components/ForgotPasswordForm'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = { title: '비밀번호 재설정' }

const ForgotPasswordPage = () => {
  return (
    <Card className="w-full max-w-sm">
      <ForgotPasswordForm />
    </Card>
  )
}

export default ForgotPasswordPage
