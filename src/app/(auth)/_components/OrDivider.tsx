import { Separator } from '@/components/ui/separator'

// 카드 안에서 쓰는 "또는" 구분선. 텍스트 배경을 카드색에 맞춰 띄워 보이지 않게 함.
const OrDivider = () => {
  return (
    <div className="relative h-5 text-sm">
      <Separator className="absolute inset-0 top-1/2" />
      <span className="bg-card text-muted-foreground relative mx-auto block w-fit px-2">또는</span>
    </div>
  )
}

export default OrDivider
