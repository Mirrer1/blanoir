import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <p className="text-muted-foreground font-heading text-5xl font-extrabold tracking-tight">
          404
        </p>
        <p className="font-heading text-2xl font-extrabold tracking-tight">
          페이지를 찾을 수 없어요
        </p>
        <p className="text-muted-foreground text-sm">주소가 바뀌었거나 존재하지 않는 페이지예요.</p>
      </div>
      <Link href="/" className={buttonVariants()}>
        홈으로 돌아가기
      </Link>
    </div>
  )
}

export default NotFound
