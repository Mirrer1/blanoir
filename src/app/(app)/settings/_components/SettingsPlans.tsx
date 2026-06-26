'use client'

import { Check, Clock } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

const FREE_FEATURES = ['페이지 무제한 생성', '8종 섹션 편집', '공개 페이지 배포']
const PRO_FEATURES = ['커스텀 도메인 연결', '방문 통계', '우선 지원']

const SettingsPlans = () => {
  // TODO: 요금제 결제 기능
  const handleUpgrade = () => {
    toast('Pro 플랜을 준비하고 있어요', { icon: <Clock className="size-4" /> })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold">Free</h3>
          <span className="bg-muted inline-flex shrink-0 items-center rounded-full px-2.5 pt-1.5 pb-1 text-xs leading-none font-medium">
            현재 플랜
          </span>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">개인용으로 충분한 기본 기능</p>
        <ul className="mt-4 flex flex-col gap-2 text-sm">
          {FREE_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="size-4 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-foreground/30 rounded-lg border p-5">
        <h3 className="font-heading font-semibold">Pro</h3>
        <p className="text-muted-foreground mt-1 text-sm">더 강력한 기능이 필요할 때</p>
        <ul className="mt-4 flex flex-col gap-2 text-sm">
          {PRO_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="size-4 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <Button className="mt-5 w-full" onClick={handleUpgrade}>
          업그레이드
        </Button>
      </div>
    </div>
  )
}

export default SettingsPlans
