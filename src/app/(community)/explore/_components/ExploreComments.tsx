import ExploreCommentList from './ExploreCommentList'
import type { CommentThreadView, CommentViewer, ExploreCommentThread } from '@/types/explore'
import { relativeTime } from '@/utils/relativeTime'

interface ExploreCommentsProps {
  pageId: string
  comments: ExploreCommentThread[]
  isLoggedIn: boolean
  viewer: CommentViewer | null
}

const ExploreComments = ({ pageId, comments, isLoggedIn, viewer }: ExploreCommentsProps) => {
  const threads: CommentThreadView[] = comments.map((c) => ({
    ...c,
    createdLabel: relativeTime(c.createdAt),
    replies: c.replies.map((r) => ({ ...r, createdLabel: relativeTime(r.createdAt) })),
  }))

  return (
    <ExploreCommentList pageId={pageId} threads={threads} isLoggedIn={isLoggedIn} viewer={viewer} />
  )
}

export default ExploreComments
