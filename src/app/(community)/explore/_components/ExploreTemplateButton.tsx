'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import ExploreLoginGate from './ExploreLoginGate'
import { Button } from '@/components/ui/button'

// 실제 복제는 API 슬라이스에서 연결
const ExploreTemplateButton = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [gateOpen, setGateOpen] = useState(false)

  const handleClick = () => {
    if (!isLoggedIn) {
      setGateOpen(true)
      return
    }
    toast('곧 사용할 수 있어요')
  }

  return (
    <>
      <Button onClick={handleClick}>템플릿 사용하기</Button>
      <ExploreLoginGate
        open={gateOpen}
        onOpenChange={setGateOpen}
        message="로그인하고 이 템플릿으로 시작해보세요"
      />
    </>
  )
}

export default ExploreTemplateButton
