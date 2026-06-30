import {
  DUMMY_POST_IMAGE,
  DUMMY_POST_TEXT,
  authorOtherPosts,
  popularFeed,
} from '../_data/dummyDetail'
import type { ExplorePost } from '../_data/dummyPosts'
import ExploreAvatar from './ExploreAvatar'
import ExploreCardCarousel from './ExploreCardCarousel'
import ExploreComments from './ExploreComments'
import ExploreLikeButton from './ExploreLikeButton'
import ExplorePopularFeed from './ExplorePopularFeed'
import ExplorePreview from './ExplorePreview'

const ExploreDetail = ({ post }: { post: ExplorePost }) => {
  const others = authorOtherPosts(post)
  const popular = popularFeed(post)

  return (
    <article className="flex flex-col gap-12">
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
          <div className="flex shrink-0 items-center gap-2">
            <ExploreLikeButton count={post.likeCount} />
            <ExplorePreview allowRemix={post.allowRemix} />
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

      <div className="flex flex-col gap-6">
        <p className="leading-relaxed whitespace-pre-line">{DUMMY_POST_TEXT}</p>
        <img
          src={DUMMY_POST_IMAGE}
          alt=""
          className="bg-muted w-full rounded-xl border object-cover"
        />
      </div>

      <ExploreComments />

      {others.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            작성자의 다른 페이지
          </h2>
          <ExploreCardCarousel posts={others} />
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight">인기 페이지</h2>
        <ExplorePopularFeed posts={popular} />
      </section>
    </article>
  )
}

export default ExploreDetail
