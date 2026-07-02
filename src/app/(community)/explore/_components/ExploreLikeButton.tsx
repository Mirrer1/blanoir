'use client'

import { Heart } from 'lucide-react'
import { useState } from 'react'

import ExploreLoginGate from './ExploreLoginGate'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ExploreLikeButton = ({ count, isLoggedIn }: { count: number; isLoggedIn: boolean }) => {
  const [liked, setLiked] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)

  const handleClick = () => {
    if (!isLoggedIn) {
      setGateOpen(true)
      return
    }
    setLiked((prev) => !prev)
  }

  return (
    <>
      <Button variant="outline" onClick={handleClick} aria-pressed={liked}>
        <Heart className={cn('size-4', liked && 'fill-current')} />
        {count + (liked ? 1 : 0)}
      </Button>
      <ExploreLoginGate
        open={gateOpen}
        onOpenChange={setGateOpen}
        message="로그인하고 좋아요를 눌러보세요"
      />
    </>
  )
}

export default ExploreLikeButton
