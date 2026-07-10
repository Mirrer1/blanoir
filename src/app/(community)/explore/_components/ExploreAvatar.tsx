import { UserRound } from 'lucide-react'

import { cn } from '@/lib/utils'
import { optimizedImageUrl } from '@/utils/cloudinaryOptimize'

const ExploreAvatar = ({ src, className }: { src: string; className?: string }) =>
  src ? (
    <img
      src={optimizedImageUrl(src, 150)}
      alt=""
      className={cn('bg-muted shrink-0 rounded-full object-cover', className)}
    />
  ) : (
    <span
      className={cn(
        'bg-muted text-muted-foreground flex shrink-0 items-center justify-center rounded-full',
        className,
      )}
    >
      <UserRound className="size-1/2" />
    </span>
  )

export default ExploreAvatar
