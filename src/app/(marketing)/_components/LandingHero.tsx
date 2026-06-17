import Image from 'next/image'
import Link from 'next/link'

import FadeIn from '@/components/common/FadeIn'
import { buttonVariants } from '@/components/ui/button'

const LandingHero = () => {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-32 text-center">
      <FadeIn>
        <span className="text-muted-foreground mb-6 inline-block rounded-full border px-4 py-1.5 text-sm">
          코딩 없이 만드는 내 홈페이지
        </span>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h1 className="font-heading max-w-3xl text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl md:text-7xl">
          클릭만으로,
          <br />
          5분이면 충분해요
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="text-muted-foreground mt-8 max-w-xl text-lg leading-8 sm:text-xl">
          포트폴리오, 매장 소개, 청첩장까지. 코딩을 몰라도 클릭만으로 만들고 바로 공개하세요. 무료로
          시작할 수 있어요.
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className={buttonVariants({ size: 'lg', className: 'h-12 px-8 text-base' })}
          >
            무료로 시작하기
          </Link>
          <Link
            href="/login"
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className: 'h-12 px-8 text-base',
            })}
          >
            로그인
          </Link>
        </div>
      </FadeIn>
      <FadeIn delay={0.4} className="w-full">
        <div className="relative mt-20 aspect-[4/3] w-full overflow-hidden rounded-lg border">
          <Image
            src="/hero.jpg"
            alt="Blanoir 에디터 미리보기"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 976px"
            className="object-cover"
          />
        </div>
      </FadeIn>
    </section>
  )
}

export default LandingHero
