'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { createComment } from '@/actions/comment'
import { Button } from '@/components/ui/button'
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea'
import type { AddOptimisticComment, CommentView, CommentViewer } from '@/types/explore'

const MAX_LENGTH = 1000

const scrollToComment = (id: string) =>
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-comment-id="${id}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }),
  )

interface ExploreReplyFormProps {
  pageId: string
  parentId: string
  viewer: CommentViewer
  addOptimistic: AddOptimisticComment
  onClose: () => void
}

// 로그인 확인은 리스트에서 처리
const ExploreReplyForm = ({
  pageId,
  parentId,
  viewer,
  addOptimistic,
  onClose,
}: ExploreReplyFormProps) => {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [pending, startTransition] = useTransition()
  const textareaRef = useAutoResizeTextarea()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value
    if (next.length >= MAX_LENGTH) {
      toast.warning('최대 1000자까지 쓸 수 있어요')
    }
    setValue(next)
  }

  const handleSubmit = () => {
    const text = value.trim()
    if (!text) {
      toast.warning('답글을 입력해 주세요')
      return
    }
    onClose()

    startTransition(async () => {
      const optimistic: CommentView = {
        id: crypto.randomUUID(),
        authorName: viewer.name,
        authorImage: viewer.image,
        text,
        createdAt: '',
        createdLabel: '방금',
        isAuthor: viewer.isPageAuthor,
        isMine: true,
        deleted: false,
      }
      addOptimistic({ type: 'addReply', parentId, reply: optimistic })
      scrollToComment(optimistic.id)

      const result = await createComment({ pageId, text, parentId })
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder="답글을 남겨보세요"
        rows={1}
        maxLength={MAX_LENGTH}
        autoFocus
        className="border-input focus-visible:border-ring focus-visible:ring-ring/20 w-full resize-none overflow-hidden rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1"
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button onClick={handleSubmit} loading={pending}>
          등록
        </Button>
      </div>
    </div>
  )
}

export default ExploreReplyForm
