'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import ExploreLoginGate from './ExploreLoginGate'
import { createComment } from '@/actions/comment'
import { Button } from '@/components/ui/button'
import type { AddOptimisticComment, CommentThreadView, CommentViewer } from '@/types/explore'

const MAX_LENGTH = 1000

const scrollToComment = (id: string) =>
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-comment-id="${id}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }),
  )

interface ExploreCommentFormProps {
  pageId: string
  isLoggedIn: boolean
  viewer: CommentViewer | null
  addOptimistic: AddOptimisticComment
}

const ExploreCommentForm = ({
  pageId,
  isLoggedIn,
  viewer,
  addOptimistic,
}: ExploreCommentFormProps) => {
  const router = useRouter()
  const [text, setText] = useState('')
  const [gateOpen, setGateOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value
    if (next.length >= MAX_LENGTH) {
      toast.warning('최대 1000자까지 쓸 수 있어요')
    }
    setText(next)
  }

  const handleSubmit = () => {
    if (!isLoggedIn || !viewer) {
      setGateOpen(true)
      return
    }
    const value = text.trim()
    if (!value) {
      toast.warning('댓글을 입력해 주세요')
      return
    }
    setText('')

    startTransition(async () => {
      const optimistic: CommentThreadView = {
        id: crypto.randomUUID(),
        authorName: viewer.name,
        authorImage: viewer.image,
        text: value,
        createdAt: '',
        createdLabel: '방금',
        isAuthor: viewer.isPageAuthor,
        isMine: true,
        deleted: false,
        replies: [],
      }
      addOptimistic({ type: 'add', thread: optimistic })
      scrollToComment(optimistic.id)

      const result = await createComment({ pageId, text: value })
      if (!result.ok) {
        toast.error(result.message)
        setText(value)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="댓글을 남겨보세요"
        rows={3}
        maxLength={MAX_LENGTH}
        className="border-input focus-visible:border-ring focus-visible:ring-ring/20 w-full resize-none rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1"
      />
      <div className="flex justify-end">
        <Button onClick={handleSubmit} loading={pending}>
          등록
        </Button>
      </div>
      <ExploreLoginGate
        open={gateOpen}
        onOpenChange={setGateOpen}
        message="로그인하고 댓글을 남겨보세요"
      />
    </div>
  )
}

export default ExploreCommentForm
