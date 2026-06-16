import Link from 'next/link'

import OrDivider from '../_components/OrDivider'
import SocialButtons from '../_components/SocialButtons'
import LoginForm from './_components/LoginForm'
import ToastOnMount from '@/components/common/ToastOnMount'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// 로그인 실패 코드, 안내 메시지 매핑
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked: '이미 다른 방법으로 가입된 이메일이에요',
  AccessDenied: '로그인이 거부됐어요',
}
const OAUTH_ERROR_FALLBACK = '소셜 로그인에 실패했어요. 다시 시도해 주세요'

const LoginPage = async ({ searchParams }: { searchParams: Promise<{ error?: string }> }) => {
  const { error } = await searchParams
  const errorMessage = error ? (OAUTH_ERROR_MESSAGES[error] ?? OAUTH_ERROR_FALLBACK) : undefined

  return (
    <Card className="w-full max-w-sm">
      <ToastOnMount message={errorMessage} id="login-error" />
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
