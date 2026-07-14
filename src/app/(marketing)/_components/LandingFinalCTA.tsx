import Image from 'next/image'
import Link from 'next/link'

import FadeIn from '@/components/common/FadeIn'

const LandingFinalCTA = () => {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/cta.webp"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 object-cover dark:brightness-[0.45]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/70" />

      <div className="relative mx-auto max-w-xl px-6 py-24 sm:py-36">
        <FadeIn>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-10 text-center text-white backdrop-blur-md sm:p-14">
            <h2 className="font-heading text-3xl leading-tight font-extrabold tracking-tight text-balance break-keep sm:text-4xl">
              지금 바로, 당신의 페이지를 시작하세요
            </h2>
            <p className="mt-5 text-pretty break-keep text-white/80">
              무료로 시작하고, 5분 만에 완성하세요.
            </p>
            <Link
              href="/login"
              className="mt-9 inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-medium text-black transition-colors hover:bg-white/90"
            >
              무료로 시작하기
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export default LandingFinalCTA
