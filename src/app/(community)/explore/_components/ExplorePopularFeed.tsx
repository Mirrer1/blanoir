'use client'

import { Loader2 } from 'lucide-react'
import { useCallback } from 'react'

import ExploreFeedCard from './ExploreFeedCard'
import { fetchPopularPosts } from '@/actions/explore'
import useInfinitePosts from '@/hooks/useInfinitePosts'
import type { SharedPage } from '@/lib/explore'

interface Props {
  initial: SharedPage
  pageId: string // 현재 상세 페이지는 피드에서 제외
}

const ExplorePopularFeed = ({ initial, pageId }: Props) => {
  const loadPage = useCallback(
    (skip: number) => fetchPopularPosts({ skip, exclude: pageId }),
    [pageId],
  )
  const { posts, hasMore, loading, sentinelRef } = useInfinitePosts({ initial, loadPage })

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ExploreFeedCard key={post.pageId} post={post} />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-6">
          {loading && <Loader2 className="text-muted-foreground size-5 animate-spin" />}
        </div>
      )}
    </div>
  )
}

export default ExplorePopularFeed
