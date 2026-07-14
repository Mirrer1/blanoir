import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import LandingBrowseButton from './LandingBrowseButton'
import FadeIn from '@/components/common/FadeIn'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CATEGORIES, type ExploreCategory, type ExplorePost } from '@/types/explore'
import { optimizedImageUrl } from '@/utils/cloudinaryOptimize'

// 카테고리 값 태그로 노출
const FALLBACK = ['portfolio', 'store', 'wedding', 'resume']

// 한글 카테고리 라벨
const KO_LABEL = new Map(CATEGORIES.map((c) => [c.key, c.label]))
const altFor = (label: string) =>
  `${KO_LABEL.get(label as ExploreCategory) ?? label} 템플릿으로 만든 페이지`

interface ShowcaseCard {
  href: string
  label: string
  thumbnail: string
}

const toCards = (posts: ExplorePost[]): ShowcaseCard[] => {
  if (posts.length === 0) {
    return FALLBACK.map((label) => ({ href: '/explore', label, thumbnail: '/live.webp' }))
  }
  return posts.map((post) => ({
    href: `/explore/${post.pageId}`,
    label: post.category ?? 'template',
    thumbnail: post.thumbnail || '/live.webp',
  }))
}

const LandingShowcase = ({ posts }: { posts: ExplorePost[] }) => {
  const cards = toCards(posts)

  return (
    <section className="border-t">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <FadeIn>
            <div className="flex items-start gap-3">
              <span className="font-heading text-5xl leading-none font-extrabold tracking-tight sm:text-6xl">
                03
              </span>
              <span className="text-muted-foreground pt-1.5 text-xs font-medium tracking-widest uppercase">
                Templates
              </span>
            </div>
          </FadeIn>
          <div className="sm:max-w-md sm:text-right">
            <FadeIn>
              <h2 className="font-heading text-2xl leading-snug font-extrabold tracking-tight text-balance break-keep sm:text-4xl">
                이렇게 만든 페이지들, 구경해 보세요.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-muted-foreground mt-4 leading-7 text-balance break-keep">
                실제로 만들어진 페이지를 둘러보고, 마음에 들면 그대로 가져다 쓸 수 있어요.
              </p>
              <LandingBrowseButton
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-foreground/25 mt-6 h-11 bg-transparent px-6',
                )}
              >
                구경하러 가기
              </LandingBrowseButton>
            </FadeIn>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:mt-20 sm:grid-cols-2">
          {cards.map((card, index) => (
            <FadeIn
              key={card.href + index}
              delay={index * 0.08}
              className={index % 2 === 1 ? 'sm:mt-16' : ''}
            >
              <Link href={card.href} className="group block">
                <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden rounded-lg border">
                  <img
                    src={optimizedImageUrl(card.thumbnail, 640)}
                    alt={altFor(card.label)}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] dark:brightness-[0.85]"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="font-heading text-sm font-bold tracking-widest uppercase">
                    {card.label}
                  </span>
                  <span className="text-muted-foreground group-hover:text-foreground flex shrink-0 items-center gap-1 text-sm transition-colors">
                    보러 가기
                    <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingShowcase
