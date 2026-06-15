import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

const EditorNotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <p className="font-heading text-2xl font-extrabold tracking-tight">
          페이지를 찾을 수 없어요
        </p>
        <p className="text-muted-foreground text-sm">
          존재하지 않거나 접근 권한이 없는 페이지예요.
        </p>
      </div>
      <Link href="/dashboard" className={buttonVariants()}>
        대시보드로 돌아가기
      </Link>
    </div>
  )
}

export default EditorNotFound
