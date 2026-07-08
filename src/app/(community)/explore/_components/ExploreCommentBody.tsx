'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import ExploreCommentDelete from './ExploreCommentDelete'
import { updateComment } from '@/actions/comment'
import { Button } from '@/components/ui/button'
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea'
import { cn } from '@/lib/utils'
import type { AddOptimisticComment } from '@/types/explore'

const MAX_LENGTH = 1000

// 텍스트와 수정 인풋 여백을 맞춰 전환 시 위치 고정
const BOX_CLASS =
  'w-full rounded-lg border px-3 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap'

interface ExploreCommentBodyProps {
  commentId: string
  text: string
  createdLabel: string
  isMine: boolean
  canReply: boolean
  onReply?: () => void
  addOptimistic: AddOptimisticComment
  onDelete: (commentId: string) => void
}

const ExploreCommentBody = ({
  commentId,
  text,
  createdLabel,
  isMine,
  canReply,
  onReply,
  addOptimistic,
  onDelete,
}: ExploreCommentBodyProps) => {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(text)
  const [pending, startTransition] = useTransition()
  const textareaRef = useAutoResizeTextarea()

  const startEdit = () => {
    setValue(text)
    setEditing(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value
    if (next.length >= MAX_LENGTH) {
      toast.warning('최대 1000자까지 쓸 수 있어요')
    }
    setValue(next)
  }

  const handleSave = () => {
    const next = value.trim()
    if (!next) {
      toast.warning('댓글을 입력해 주세요')
      return
    }
    setEditing(false)

    startTransition(async () => {
      addOptimistic({ type: 'edit', id: commentId, text: next })
      const result = await updateComment({ commentId, text: next })
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      router.refresh()
    })
  }

  if (editing) {
    return (
      <>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          rows={1}
          maxLength={MAX_LENGTH}
          autoFocus
          onFocus={(e) => e.currentTarget.setSelectionRange(value.length, value.length)}
          className={cn(
            BOX_CLASS,
            'border-input focus-visible:border-ring focus-visible:ring-ring/20 resize-none overflow-hidden bg-transparent outline-none focus-visible:ring-1',
          )}
        />
        <div className="flex h-7 translate-y-1 items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
            취소
          </Button>
          <Button size="sm" onClick={handleSave} loading={pending}>
            저장
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <p className={cn(BOX_CLASS, 'border-transparent')}>{text}</p>
      <div className="text-muted-foreground flex h-7 items-center gap-3 px-3 text-xs">
        <span>{createdLabel}</span>
        {canReply && (
          <button onClick={onReply} className="hover:text-foreground cursor-pointer">
            답글
          </button>
        )}
        {isMine && (
          <button onClick={startEdit} className="hover:text-foreground cursor-pointer">
            수정
          </button>
        )}
        {isMine && <ExploreCommentDelete commentId={commentId} onDelete={onDelete} />}
      </div>
    </>
  )
}

export default ExploreCommentBody
