'use client'

import { Heart } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ExploreLikeButton = ({ count }: { count: number }) => {
  const [liked, setLiked] = useState(false)

  return (
    <Button variant="outline" onClick={() => setLiked((prev) => !prev)} aria-pressed={liked}>
      <Heart className={cn('size-4', liked && 'fill-current')} />
      {count + (liked ? 1 : 0)}
    </Button>
  )
}

export default ExploreLikeButton
