'use client'

import { Eye } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { recordView } from '@/actions/explore'

// 조회수 진입 시 최초 카운트
const ExploreViewCount = ({ pageId, initialCount }: { pageId: string; initialCount: number }) => {
  const [count, setCount] = useState(initialCount)
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) {
      return
    }
    fired.current = true
    recordView(pageId).then((result) => {
      if (result.counted) {
        setCount(result.viewCount)
      }
    })
  }, [pageId])

  return (
    <span className="text-muted-foreground flex items-center gap-1 text-sm leading-none lg:text-base">
      <Eye className="size-4 lg:size-4.5" />
      {count}
    </span>
  )
}

export default ExploreViewCount
