import type { Metadata } from 'next'
import Link from 'next/link'

import OrDivider from '../_components/OrDivider'
import SocialButtons from '../_components/SocialButtons'
import SignupForm from './_components/SignupForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = { title: '회원가입' }

const SignupPage = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">회원가입</CardTitle>
        <CardDescription>5분이면 내 페이지를 만들 수 있어요</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <SocialButtons />
        <OrDivider />
        <SignupForm />
      </CardContent>
      <CardFooter className="text-muted-foreground justify-center text-sm">
        이미 계정이 있으신가요?
        <Link href="/login" className="text-foreground ml-1 font-medium hover:underline">
          로그인
        </Link>
      </CardFooter>
    </Card>
  )
}

export default SignupPage
