import { Eye, Repeat2 } from 'lucide-react'

import ExploreAvatar from './ExploreAvatar'
import type { ExplorePost } from '@/types/explore'

const ExploreCardOverlay = ({ post }: { post: ExplorePost }) => {
  const title = post.title || '제목 없는 페이지'

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-12 opacity-100 transition-opacity duration-200 lg:opacity-0 lg:group-hover:opacity-100">
      <span className="line-clamp-2 text-sm font-medium text-white">{title}</span>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <ExploreAvatar src={post.authorImage} className="size-5" />
          <span className="truncate text-xs text-white/80">{post.authorName}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-xs text-white/80">
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {post.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <Repeat2 className="size-3.5" />
            {post.useCount}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ExploreCardOverlay
