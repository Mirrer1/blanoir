'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

// 실제 등록은 API 슬라이스에서 연결
const ExploreCommentForm = () => {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (!text.trim()) {
      return
    }
    toast('댓글은 곧 등록할 수 있어요')
    setText('')
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="댓글을 남겨보세요"
        rows={3}
        className="border-input focus-visible:border-ring focus-visible:ring-ring/20 w-full resize-none rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1"
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSubmit}>
          등록
        </Button>
      </div>
    </div>
  )
}

export default ExploreCommentForm
