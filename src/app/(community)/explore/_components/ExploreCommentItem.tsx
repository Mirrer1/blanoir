import ExploreAvatar from './ExploreAvatar'
import ExploreCommentBody from './ExploreCommentBody'
import { cn } from '@/lib/utils'
import type { AddOptimisticComment, CommentView } from '@/types/explore'

interface ExploreCommentItemProps {
  comment: CommentView
  avatarSize: string
  addOptimistic: AddOptimisticComment
  onDelete: (commentId: string) => void
  canReply?: boolean
  onReply?: () => void
}

const INDENT_CLASS: Record<string, string> = {
  'size-9': 'pl-12',
  'size-8': 'pl-11',
}

const ExploreCommentItem = ({
  comment,
  avatarSize,
  addOptimistic,
  onDelete,
  canReply = false,
  onReply,
}: ExploreCommentItemProps) => {
  if (comment.deleted) {
    return <p className="text-muted-foreground text-sm">삭제된 댓글입니다</p>
  }

  return (
    <div data-comment-id={comment.id} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <ExploreAvatar src={comment.authorImage} className={avatarSize} />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{comment.authorName}</span>
          {comment.isAuthor && (
            <span className="bg-foreground text-background inline-flex items-center rounded-full px-2 pt-1 pb-0.5 text-xs leading-none font-medium">
              작성자
            </span>
          )}
        </div>
      </div>
      <div className={cn(INDENT_CLASS[avatarSize] ?? 'pl-12', 'flex flex-col gap-1.5')}>
        <ExploreCommentBody
          commentId={comment.id}
          text={comment.text}
          createdLabel={comment.createdLabel}
          isMine={comment.isMine}
          canReply={canReply}
          onReply={onReply}
          addOptimistic={addOptimistic}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}

export default ExploreCommentItem
