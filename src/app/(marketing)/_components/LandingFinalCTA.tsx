import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

const LandingFinalCTA = () => {
  return (
    <section className="bg-muted/30 border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-32 text-center">
        <h2 className="font-heading max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          지금 바로,
          <br />
          당신의 페이지를 시작하세요
        </h2>
        <p className="text-muted-foreground mt-6 text-lg">무료로 시작하고, 5분 안에 공개하세요.</p>
        <Link
          href="/signup"
          className={buttonVariants({ size: 'lg', className: 'mt-10 h-12 px-8 text-base' })}
        >
          무료로 시작하기
        </Link>
      </div>
    </section>
  )
}

export default LandingFinalCTA
