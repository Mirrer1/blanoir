import { Pencil, Repeat2 } from 'lucide-react'
import Link from 'next/link'

import ExploreAvatar from './ExploreAvatar'
import ExploreBackLink from './ExploreBackLink'
import ExploreCardCarousel from './ExploreCardCarousel'
import ExploreComments from './ExploreComments'
import ExplorePopularFeed from './ExplorePopularFeed'
import ExplorePreview from './ExplorePreview'
import ExploreViewCount from './ExploreViewCount'
import { buttonVariants } from '@/components/ui/button'
import type { SharedDetail } from '@/lib/explore'
import { cn } from '@/lib/utils'
import type { CommentViewer, ExploreCommentThread } from '@/types/explore'
import { optimizedImageUrl } from '@/utils/cloudinaryOptimize'

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
    <article className="flex flex-col gap-8 sm:gap-12">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-4 [grid-template-areas:'back_stats'_'title_title'] lg:gap-y-6 lg:[grid-template-areas:'back_back'_'title_stats']">
          <ExploreBackLink className="[grid-area:back]" />
          <h1 className="font-heading min-w-0 text-2xl font-extrabold tracking-tight [grid-area:title]">
            {post.title}
          </h1>
          <div className="flex shrink-0 items-center gap-3 justify-self-end [grid-area:stats]">
            <ExploreViewCount pageId={post.pageId} initialCount={post.viewCount} />
            <span className="text-muted-foreground flex items-center gap-1 text-sm leading-none lg:text-base">
              <Repeat2 className="size-4 lg:size-4.5" />
              {post.useCount}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <ExploreAvatar src={post.authorImage} className="size-12 sm:size-14" />
            <div className="min-w-0">
              <p className="truncate font-medium">{post.authorName}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ExplorePreview
              pageId={post.pageId}
              title={post.title}
              sections={sections}
              allowRemix={post.allowRemix}
              isOwner={isOwner}
              isLoggedIn={isLoggedIn}
            />
            {isOwner && (
              <Link
                href={`/explore/share?pageId=${post.pageId}&from=detail`}
                aria-label="수정"
                className={cn(buttonVariants())}
              >
                <Pencil className="size-4" />
                <span className="hidden sm:inline">수정</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {post.thumbnail && (
        <img
          src={optimizedImageUrl(post.thumbnail, 1200)}
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

      {popular.posts.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold tracking-tight">인기 페이지</h2>
          <ExplorePopularFeed initial={popular} pageId={post.pageId} />
        </section>
      )}
    </article>
  )
}

export default ExploreDetail
