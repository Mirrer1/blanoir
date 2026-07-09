'use client'

import { useRouter } from 'next/navigation'
import { useOptimistic, useState, useTransition } from 'react'
import { toast } from 'sonner'

import ExploreCommentForm from './ExploreCommentForm'
import ExploreCommentItem from './ExploreCommentItem'
import ExploreLoginGate from './ExploreLoginGate'
import ExploreReplyForm from './ExploreReplyForm'
import { deleteComment } from '@/actions/comment'
import type { CommentOptimisticAction, CommentThreadView, CommentViewer } from '@/types/explore'

interface ExploreCommentListProps {
  pageId: string
  threads: CommentThreadView[]
  isLoggedIn: boolean
  viewer: CommentViewer | null
}

// 답글 없는 tombstone은 서버와 동일하게 제외
const pruneEmptyTombstones = (threads: CommentThreadView[]) =>
  threads.filter((t) => !t.deleted || t.replies.length > 0)

const reducer = (
  threads: CommentThreadView[],
  action: CommentOptimisticAction,
): CommentThreadView[] => {
  switch (action.type) {
    case 'add':
      return [...threads, action.thread]
    case 'addReply':
      return threads.map((t) =>
        t.id === action.parentId ? { ...t, replies: [...t.replies, action.reply] } : t,
      )
    case 'edit':
      return threads.map((t) => ({
        ...t,
        text: t.id === action.id ? action.text : t.text,
        replies: t.replies.map((r) => (r.id === action.id ? { ...r, text: action.text } : r)),
      }))
    case 'delete':
      return pruneEmptyTombstones(threads.filter((t) => t.id !== action.id))
    case 'tombstone':
      return pruneEmptyTombstones(
        threads.map((t) => (t.id === action.id ? { ...t, deleted: true, text: '' } : t)),
      )
    case 'deleteReply':
      return pruneEmptyTombstones(
        threads.map((t) =>
          t.id === action.parentId
            ? { ...t, replies: t.replies.filter((r) => r.id !== action.replyId) }
            : t,
        ),
      )
  }
}

const ExploreCommentList = ({ pageId, threads, isLoggedIn, viewer }: ExploreCommentListProps) => {
  const router = useRouter()
  const [optimistic, addOptimistic] = useOptimistic(threads, reducer)
  const [, startTransition] = useTransition()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [gateOpen, setGateOpen] = useState(false)

  const handleReply = (commentId: string) => {
    if (!isLoggedIn || !viewer) {
      setGateOpen(true)
      return
    }
    setReplyingTo((current) => (current === commentId ? null : commentId))
  }

  // 항목이 사라지는 삭제여서 트랜지션은 리스트가 소유
  // 서버와 동일하게 남의 답글 있으면 tombstone 처리하고 없으면 완전 삭제
  const handleDelete = (commentId: string) => {
    const thread = optimistic.find((t) => t.id === commentId)
    const action: CommentOptimisticAction = thread
      ? thread.replies.some((r) => !r.isMine)
        ? { type: 'tombstone', id: commentId }
        : { type: 'delete', id: commentId }
      : {
          type: 'deleteReply',
          parentId: optimistic.find((t) => t.replies.some((r) => r.id === commentId))?.id ?? '',
          replyId: commentId,
        }

    startTransition(async () => {
      addOptimistic(action)
      const result = await deleteComment(commentId)
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      router.refresh()
    })
  }

  // 대댓글 포함하여 tombstone 제외
  const total = optimistic.reduce((sum, c) => sum + (c.deleted ? 0 : 1) + c.replies.length, 0)

  return (
    <section className="flex flex-col gap-4 sm:gap-6">
      <h2 className="font-heading text-lg font-semibold tracking-tight">
        댓글 <span className="text-muted-foreground">{total}</span>
      </h2>
      <ExploreCommentForm
        pageId={pageId}
        isLoggedIn={isLoggedIn}
        viewer={viewer}
        addOptimistic={addOptimistic}
      />
      {optimistic.length > 0 && (
        <ul className="divide-border flex flex-col divide-y">
          {optimistic.map((comment) => (
            <li
              key={comment.id}
              className="flex flex-col gap-3 pt-4 pb-4 first:pt-0 last:pb-0 sm:pt-6 sm:pb-6"
            >
              <ExploreCommentItem
                comment={comment}
                avatarSize="size-9"
                canReply={!comment.deleted}
                onReply={() => handleReply(comment.id)}
                addOptimistic={addOptimistic}
                onDelete={handleDelete}
              />
              {replyingTo === comment.id && viewer && (
                <div className="pl-8 sm:pl-12">
                  <ExploreReplyForm
                    pageId={pageId}
                    parentId={comment.id}
                    viewer={viewer}
                    addOptimistic={addOptimistic}
                    onClose={() => setReplyingTo(null)}
                  />
                </div>
              )}
              {comment.replies.length > 0 && (
                <ul className="flex flex-col gap-3 pl-8 sm:pl-12">
                  {comment.replies.map((reply) => (
                    <li key={reply.id}>
                      <ExploreCommentItem
                        comment={reply}
                        avatarSize="size-8"
                        addOptimistic={addOptimistic}
                        onDelete={handleDelete}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
      <ExploreLoginGate
        open={gateOpen}
        onOpenChange={setGateOpen}
        message="로그인하고 댓글을 남겨보세요"
      />
    </section>
  )
}

export default ExploreCommentList
