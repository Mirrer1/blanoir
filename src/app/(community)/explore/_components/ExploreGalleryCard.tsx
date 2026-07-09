import { Eye, ImageIcon, Repeat2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import ExploreAvatar from './ExploreAvatar'
import type { ExplorePost } from '@/types/explore'

const PLACEHOLDER_RATIO = 0.75

interface Props {
  post: ExplorePost
  onRatio: (pageId: string, ratio: number) => void
}

const ExploreGalleryCard = ({ post, onRatio }: Props) => {
  const title = post.title || '제목 없는 페이지'
  const [ratio, setRatio] = useState<number | null>(null)

  // aspect-ratio로 자리 확보에 쓰고 상위엔 컬럼 배치용으로 전달
  const report = (img: HTMLImageElement) => {
    if (!img.naturalWidth) {
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
      className="group relative block overflow-hidden rounded-lg border"
    >
      {post.thumbnail ? (
        <img
          ref={measure}
          src={post.thumbnail}
          alt=""
          onLoad={(e) => report(e.currentTarget)}
          style={{ aspectRatio: `1 / ${ratio ?? PLACEHOLDER_RATIO}` }}
          className="bg-muted/40 block w-full object-cover"
        />
      ) : (
        <div className="bg-muted/40 flex aspect-[4/3] items-center justify-center">
          <ImageIcon className="text-muted-foreground/40 size-10" strokeWidth={1.5} />
        </div>
      )}

      {/* 모바일은 항상 표시하고 데스크톱은 hover 시 하단 그라데이션 위로 콘텐츠 표시 */}
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
    </Link>
  )
}

export default ExploreGalleryCard
