'use client'

import Link from 'next/link'

import { Button, buttonVariants } from '@/components/ui/button'

const isDev = process.env.NODE_ENV === 'development'

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <p className="font-heading text-2xl font-extrabold tracking-tight">문제가 발생했어요</p>
        <p className="text-muted-foreground text-sm">
          잠시 후 다시 시도해 주세요. 계속되면 새로고침해 주세요.
        </p>
      </div>

      {/* 개발 모드에서만 실제 에러 노출 */}
      {isDev && (
        <pre className="text-destructive bg-muted max-w-xl overflow-auto rounded-md border p-4 text-left text-xs break-all whitespace-pre-wrap">
          {error.message}
          {error.stack ? `\n\n${error.stack}` : ''}
        </pre>
      )}

      <div className="flex gap-2">
        <Button onClick={reset}>다시 시도</Button>
        <Link href="/" className={buttonVariants({ variant: 'outline' })}>
          홈으로
        </Link>
      </div>
    </div>
  )
}

export default Error
