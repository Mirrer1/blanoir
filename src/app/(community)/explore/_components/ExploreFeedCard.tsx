import { ImageIcon } from 'lucide-react'
import Link from 'next/link'

import ExploreCardOverlay from './ExploreCardOverlay'
import type { ExplorePost } from '@/types/explore'
import { optimizedImageUrl } from '@/utils/cloudinaryOptimize'

const ExploreFeedCard = ({ post }: { post: ExplorePost }) => {
  return (
    <Link
      href={`/explore/${post.pageId}`}
      className="group relative block overflow-hidden rounded-lg border"
    >
      {post.thumbnail ? (
        <img
          src={optimizedImageUrl(post.thumbnail)}
          alt=""
          className="bg-muted/40 block aspect-[4/3] w-full object-cover"
        />
      ) : (
        <div className="bg-muted/40 flex aspect-[4/3] items-center justify-center">
          <ImageIcon className="text-muted-foreground/40 size-10" strokeWidth={1.5} />
        </div>
      )}

      <ExploreCardOverlay post={post} />
    </Link>
  )
}

export default ExploreFeedCard
