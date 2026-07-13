'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { listHref } from '@/utils/listScrollCache'

// 롤백 후 저장된 옵션 필터와 스크롤 복원
const ExploreBackLink = ({ className }: { className?: string }) => {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push(listHref())}
      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-fit', className)}
    >
      <ArrowLeft className="size-4" />
      목록
    </button>
  )
}

export default ExploreBackLink
