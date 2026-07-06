'use client'

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import ExploreLoginGate from './ExploreLoginGate'
import { remixPage } from '@/actions/explore'
import { Button } from '@/components/ui/button'

const ExploreTemplateButton = ({ pageId, isLoggedIn }: { pageId: string; isLoggedIn: boolean }) => {
  const router = useRouter()
  const [gateOpen, setGateOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const handleClick = async () => {
    if (!isLoggedIn) {
      setGateOpen(true)
      return
    }
    setPending(true)
    const result = await remixPage(pageId)
    if (!result.ok) {
      toast.error(result.message)
      setPending(false)
      return
    }
    router.push(`/edit/${result.pageId}`)
  }

  return (
    <>
      <Button onClick={handleClick} disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        템플릿 사용하기
      </Button>
      <ExploreLoginGate
        open={gateOpen}
        onOpenChange={setGateOpen}
        message="로그인하고 이 템플릿으로 시작해보세요"
      />
    </>
  )
}

export default ExploreTemplateButton
