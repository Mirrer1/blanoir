import Image from 'next/image'

import FadeIn from '@/components/common/FadeIn'

const FEATURES = [
  {
    title: '에디터에서 만들기',
    description: '완성될 모습 그대로 보면서 편집해요.',
  },
  {
    title: '미리보기로 확인하기',
    description: '공개 전에 PC·모바일 모습을 확인해요.',
  },
  {
    title: '바로 공개하기',
    description: '준비되면 내 주소로 올려 링크로 공유해요.',
  },
]

const LandingFeatures = () => {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <div className="flex flex-col gap-8 sm:flex-row-reverse sm:items-start sm:justify-between">
          <FadeIn>
            <div className="flex items-start gap-3">
              <span className="text-muted-foreground pt-1.5 text-xs font-medium tracking-widest uppercase">
                Features
              </span>
              <span className="font-heading text-5xl leading-none font-extrabold tracking-tight sm:text-6xl">
                02
              </span>
            </div>
          </FadeIn>
          <FadeIn>
            <h2 className="font-heading max-w-md text-2xl leading-snug font-extrabold tracking-tight text-balance break-keep sm:text-4xl">
              직접 보면서 만들고 확인하고
              <br />
              공개해요.
            </h2>
          </FadeIn>
        </div>

        <div className="mt-16 grid gap-10 border-t pt-12 sm:mt-20 sm:grid-cols-3">
          {FEATURES.map(({ title, description }, index) => (
            <FadeIn key={title} delay={index * 0.1}>
              <div className="flex flex-col gap-3">
                <h3 className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {title}
                </h3>
                <p className="text-muted-foreground leading-7 text-pretty break-keep">
                  {description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-16 sm:mt-24">
          <div className="bg-muted relative aspect-[16/9] w-full overflow-hidden rounded-lg border">
            <Image
              src="/preview.webp"
              alt="Blanoir 미리보기 화면"
              fill
              sizes="(max-width: 1024px) 100vw, 976px"
              className="object-cover dark:brightness-[0.85]"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export default LandingFeatures
