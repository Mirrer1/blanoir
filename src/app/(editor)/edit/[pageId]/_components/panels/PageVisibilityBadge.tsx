import { cn } from '@/lib/utils'

// 페이지 공개 여부 뱃지
const PageVisibilityBadge = ({ isPublic }: { isPublic: boolean }) => (
  <span
    className={cn(
      'min-w-11 shrink-0 rounded border px-1.5 py-0.5 text-center text-[10px]',
      isPublic
        ? 'bg-primary text-primary-foreground border-primary'
        : 'text-foreground border-border bg-background',
    )}
  >
    {isPublic ? '공개' : '비공개'}
  </span>
)

export default PageVisibilityBadge
