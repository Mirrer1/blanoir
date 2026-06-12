import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

const LandingHero = () => {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-32 text-center">
      <span className="text-muted-foreground mb-6 rounded-full border px-4 py-1.5 text-sm">
        코딩 없이 만드는 내 홈페이지
      </span>
      <h1 className="font-heading max-w-3xl text-5xl leading-tight font-extrabold tracking-tight sm:text-6xl md:text-7xl">
        한글 클릭만으로,
        <br />
        5분이면 충분해요
      </h1>
      <p className="text-muted-foreground mt-8 max-w-xl text-lg leading-8 sm:text-xl">
        포트폴리오, 매장 소개, 청첩장까지. 코딩을 몰라도 클릭만으로 만들고 바로 공개하세요. 무료로
        시작할 수 있어요.
      </p>
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
      <div className="bg-muted/40 mt-20 aspect-video w-full max-w-4xl rounded-lg border" />
    </section>
  )
}

export default LandingHero
