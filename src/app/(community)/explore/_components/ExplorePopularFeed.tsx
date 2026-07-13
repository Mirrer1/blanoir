'use client'

import { useState, useSyncExternalStore } from 'react'

import ExploreFeedCard from './ExploreFeedCard'
import type { ExplorePost } from '@/types/explore'

const subscribe = () => () => {}

const useMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

// 랜더링마다 카드 순서 셔플
const shuffle = (posts: ExplorePost[]) => {
  const next = [...posts]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

const ExplorePopularFeed = ({ posts }: { posts: ExplorePost[] }) => {
  const mounted = useMounted()
  const [shuffled] = useState(() => shuffle(posts))
  const ordered = mounted ? shuffled : posts

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {ordered.map((post) => (
        <ExploreFeedCard key={post.pageId} post={post} />
      ))}
    </div>
  )
}

export default ExplorePopularFeed
