'use client'

import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

// 실제 공유는 공유 화면 슬라이스에서 연결
const ExploreShareButton = () => (
  <Button onClick={() => toast('곧 공유할 수 있어요')}>
    <Share2 className="size-4" />
    공유하기
  </Button>
)

export default ExploreShareButton
