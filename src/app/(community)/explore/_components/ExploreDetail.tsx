import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'

import ExploreAvatar from './ExploreAvatar'
import ExploreCardCarousel from './ExploreCardCarousel'
import ExploreComments from './ExploreComments'
import ExplorePopularFeed from './ExplorePopularFeed'
import ExplorePreview from './ExplorePreview'
import ExploreViewCount from './ExploreViewCount'
import { buttonVariants } from '@/components/ui/button'
import type { SharedDetail } from '@/lib/explore'
import { cn } from '@/lib/utils'
import type { CommentViewer, ExploreCommentThread } from '@/types/explore'

const ExploreDetail = ({
  detail,
  comments,
  viewer,
  isLoggedIn,
  isOwner,
}: {
  detail: SharedDetail
  comments: ExploreCommentThread[]
  viewer: CommentViewer | null
  isLoggedIn: boolean
  isOwner: boolean
}) => {
  const { post, communityPost, sections, others, popular } = detail

  return (
    <article className="flex flex-col gap-12">
      <Link
        href="/explore"
        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), '-mb-6 w-fit')}
      >
        <ArrowLeft className="size-4" />
        목록
      </Link>
      <div className="flex flex-col gap-5">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">{post.title}</h1>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <ExploreAvatar src={post.authorImage} className="size-10" />
            <div className="min-w-0">
              <p className="truncate font-medium">{post.authorName}</p>
              <p className="text-muted-foreground truncate text-sm">@{post.authorHandle}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <ExploreViewCount pageId={post.pageId} initialCount={post.viewCount} />
            <ExplorePreview
              pageId={post.pageId}
              sections={sections}
              allowRemix={post.allowRemix}
              isOwner={isOwner}
              isLoggedIn={isLoggedIn}
            />
            {isOwner && (
              <Link
                href={`/explore/share?pageId=${post.pageId}&from=detail`}
                className={cn(buttonVariants())}
              >
                <Pencil className="size-4" />
                수정
              </Link>
            )}
          </div>
        </div>
      </div>

      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt=""
          className="bg-muted aspect-video w-full rounded-xl border object-cover"
        />
      )}

      {communityPost && (
        <div
          className="space-y-4 leading-relaxed [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_h2]:text-lg [&_h2]:font-semibold [&_img]:rounded-xl [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: communityPost }}
        />
      )}

      <ExploreComments
        pageId={post.pageId}
        comments={comments}
        viewer={viewer}
        isLoggedIn={isLoggedIn}
      />

      {others.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            작성자의 다른 페이지
          </h2>
          <ExploreCardCarousel posts={others} />
        </section>
      )}

      {popular.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold tracking-tight">인기 페이지</h2>
          <ExplorePopularFeed posts={popular} />
        </section>
      )}
    </article>
  )
}

export default ExploreDetail
