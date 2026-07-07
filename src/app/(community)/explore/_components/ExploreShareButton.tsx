'use client'

import { Share2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import ExploreLoginGate from './ExploreLoginGate'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ExploreShareButton = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [gateOpen, setGateOpen] = useState(false)

  if (isLoggedIn) {
    return (
      <Link href="/explore/share" className={cn(buttonVariants())}>
        <Share2 className="size-4" />
        템플릿 추가
      </Link>
    )
  }

  return (
    <>
      <Button onClick={() => setGateOpen(true)}>
        <Share2 className="size-4" />
        템플릿 추가
      </Button>
      <ExploreLoginGate
        open={gateOpen}
        onOpenChange={setGateOpen}
        message="로그인하고 내 페이지를 템플릿으로 추가해보세요"
      />
    </>
  )
}

export default ExploreShareButton
