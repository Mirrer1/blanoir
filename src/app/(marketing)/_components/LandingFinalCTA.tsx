import LandingBrowseButton from './LandingBrowseButton'
import FadeIn from '@/components/common/FadeIn'
import { buttonVariants } from '@/components/ui/button'

const LandingFinalCTA = () => {
  return (
    <section className="bg-muted/30 border-t">
      <FadeIn className="mx-auto flex max-w-5xl flex-col items-center px-6 py-32 text-center">
        <h2 className="font-heading max-w-2xl text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
          지금 바로,
          <br />
          당신의 페이지를 시작하세요
        </h2>
        <p className="text-muted-foreground mt-6 text-lg">무료로 시작하고, 5분 만에 완성하세요.</p>
        <LandingBrowseButton
          className={buttonVariants({ size: 'lg', className: 'mt-10 h-12 px-8 text-base' })}
        >
          구경하러 가기
        </LandingBrowseButton>
      </FadeIn>
    </section>
  )
}

export default LandingFinalCTA
