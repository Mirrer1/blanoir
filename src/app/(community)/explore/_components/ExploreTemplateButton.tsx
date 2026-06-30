'use client'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

// 실제 복제는 API 슬라이스에서 연결
const ExploreTemplateButton = () => (
  <Button onClick={() => toast('곧 사용할 수 있어요')}>템플릿 사용하기</Button>
)

export default ExploreTemplateButton
