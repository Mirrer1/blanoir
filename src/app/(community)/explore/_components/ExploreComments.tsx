import { DUMMY_COMMENTS } from '../_data/dummyDetail'
import ExploreAvatar from './ExploreAvatar'
import ExploreCommentForm from './ExploreCommentForm'

const ExploreComments = () => {
  const total = DUMMY_COMMENTS.reduce((sum, comment) => sum + 1 + comment.replies.length, 0)

  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-heading text-lg font-semibold tracking-tight">댓글 {total}</h2>
      <ExploreCommentForm />
      <ul className="flex flex-col gap-6">
        {DUMMY_COMMENTS.map((comment) => (
          <li key={comment.id} className="flex flex-col gap-4">
            <div className="flex gap-3">
              <ExploreAvatar src={comment.authorImage} className="size-9" />
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">{comment.authorName}</span>
                  <span className="text-muted-foreground text-xs">{comment.createdAt}</span>
                </div>
                <p className="text-sm leading-relaxed">{comment.text}</p>
              </div>
            </div>
            {comment.replies.length > 0 && (
              <ul className="flex flex-col gap-4 pl-12">
                {comment.replies.map((reply) => (
                  <li key={reply.id} className="flex gap-3">
                    <ExploreAvatar src={reply.authorImage} className="size-8" />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium">{reply.authorName}</span>
                        <span className="text-muted-foreground text-xs">{reply.createdAt}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{reply.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ExploreComments
