import Link from 'next/link'

import OrDivider from '../_components/OrDivider'
import SocialButtons from '../_components/SocialButtons'
import LoginForm from './_components/LoginForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const LoginPage = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">로그인</CardTitle>
        <CardDescription>다시 만나서 반가워요</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <SocialButtons />
        <OrDivider />
        <LoginForm />
      </CardContent>
      <CardFooter className="text-muted-foreground justify-center text-sm">
        아직 계정이 없으신가요?
        <Link href="/signup" className="text-foreground ml-1 font-medium hover:underline">
          회원가입
        </Link>
      </CardFooter>
    </Card>
  )
}

export default LoginPage
