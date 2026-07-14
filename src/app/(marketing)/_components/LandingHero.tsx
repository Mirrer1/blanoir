import Image from 'next/image'
import Link from 'next/link'

import LandingBrowseButton from './LandingBrowseButton'
import FadeIn from '@/components/common/FadeIn'

const LandingHero = () => {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden px-6 pt-24 pb-10 text-white">
      <Image
        src="/hero.webp"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 object-cover dark:brightness-[0.45]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
        <FadeIn>
          <span className="font-heading block text-6xl leading-none font-extrabold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
            Blanoir
          </span>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="flex max-w-xl flex-col gap-6 md:items-end md:text-right">
            <p className="text-sm leading-7 break-keep text-white/85 sm:text-base">
              클릭만으로, 5분이면 충분해요. 포트폴리오, 매장 소개, 청첩장까지
              <br />
              코딩을 몰라도 클릭만으로 만들고 바로 공개하세요.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Link
                href="/login"
                className="inline-flex h-11 min-w-32 items-center justify-center rounded-lg border border-white/50 bg-white/20 px-6 text-sm font-medium shadow-sm backdrop-blur-md transition-colors hover:bg-white/30"
              >
                로그인
              </Link>
              <LandingBrowseButton className="inline-flex h-11 min-w-32 items-center justify-center rounded-lg border border-white/25 bg-white/0 px-6 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/10">
                구경하러 가기
              </LandingBrowseButton>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export default LandingHero
