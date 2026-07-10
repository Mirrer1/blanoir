import { Loader } from 'lucide-react'

import { optimizedImageUrl } from '@/utils/cloudinaryOptimize'

interface DashboardPendingCardProps {
  item: {
    title: string
    thumbnail: string
    textPreview: string
  }
}

const DashboardPendingCard = ({ item }: DashboardPendingCardProps) => {
  const title = item.title || '제목 없는 페이지'

  return (
    <div className="relative">
      <div className="flex flex-col gap-3 rounded-lg border p-4 opacity-80">
        {item.thumbnail ? (
          <img
            src={optimizedImageUrl(item.thumbnail, 640)}
            alt=""
            className="bg-muted/40 aspect-video w-full rounded object-cover"
          />
        ) : (
          <div className="bg-muted/40 aspect-video w-full rounded" />
        )}
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{title}</span>
        </div>
        <span className="text-muted-foreground text-xs">복제 중…</span>
      </div>
      <div className="bg-background/60 absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-[1px]">
        <Loader className="text-muted-foreground size-6 animate-spin" />
      </div>
    </div>
  )
}

export default DashboardPendingCard
