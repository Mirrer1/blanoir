import { ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import ExploreCardOverlay from './ExploreCardOverlay'
import type { ExplorePost } from '@/types/explore'
import { optimizedImageUrl } from '@/utils/cloudinaryOptimize'

const PLACEHOLDER_RATIO = 0.75

interface Props {
  post: ExplorePost
  onRatio: (pageId: string, ratio: number) => void
  uniform?: boolean
}

const ExploreGalleryCard = ({ post, onRatio, uniform = false }: Props) => {
  const [ratio, setRatio] = useState<number | null>(null)

  const report = (img: HTMLImageElement) => {
    if (uniform || !img.naturalWidth) {
      return
    }
    const next = img.naturalHeight / img.naturalWidth
    setRatio(next)
    onRatio(post.pageId, next)
  }

  // onLoad를 건너뛰는 캐시 이미지 대비 마운트 시점에도 측정
  const measure = (img: HTMLImageElement | null) => {
    if (img && img.complete) {
      report(img)
    }
  }

  return (
    <Link
      href={`/explore/${post.pageId}`}
      data-pageid={post.pageId}
      className="group relative block overflow-hidden rounded-lg border"
    >
      {post.thumbnail ? (
        <img
          ref={measure}
          src={optimizedImageUrl(post.thumbnail, 640)}
          alt=""
          onLoad={(e) => report(e.currentTarget)}
          style={{
            aspectRatio: uniform ? `1 / ${PLACEHOLDER_RATIO}` : `1 / ${ratio ?? PLACEHOLDER_RATIO}`,
          }}
          className="bg-muted/40 block w-full object-cover"
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

export default ExploreGalleryCard
