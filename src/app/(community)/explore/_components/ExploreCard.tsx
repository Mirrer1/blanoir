import { Heart, ImageIcon, Repeat2 } from 'lucide-react'
import Link from 'next/link'

import type { ExplorePost } from '../_data/dummyPosts'
import ExploreAvatar from './ExploreAvatar'

const ExploreCard = ({ post }: { post: ExplorePost }) => {
  const title = post.title || '제목 없는 페이지'

  return (
    <Link
      href={`/explore/${post.pageId}`}
      className="hover:border-foreground/30 group flex flex-col gap-3 rounded-lg border p-4 transition-colors"
    >
      {post.thumbnail ? (
        <img
          src={post.thumbnail}
          alt=""
          className="bg-muted/40 aspect-video w-full rounded object-cover"
        />
      ) : (
        <div className="bg-muted/40 flex aspect-video items-center justify-center rounded">
          <ImageIcon className="text-muted-foreground/40 size-10" strokeWidth={1.5} />
        </div>
      )}

      <span className="truncate font-medium">{title}</span>

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <ExploreAvatar src={post.authorImage} className="size-5" />
          <span className="text-muted-foreground truncate text-sm">{post.authorName}</span>
        </div>
        <div className="text-muted-foreground flex shrink-0 items-center gap-3 text-xs">
          <span className="flex items-center gap-1 leading-none">
            <Heart className="size-3.5" />
            {post.likeCount}
          </span>
          <span className="flex items-center gap-1 leading-none">
            <Repeat2 className="size-3.5" />
            {post.useCount}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ExploreCard
