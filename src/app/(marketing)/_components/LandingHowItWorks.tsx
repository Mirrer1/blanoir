import FadeIn from '@/components/common/FadeIn'

const STEPS = [
  {
    num: '01',
    title: '회원가입',
    description: '소셜 로그인으로 10초면 시작할 수 있어요.',
  },
  {
    num: '02',
    title: '섹션 추가',
    description: '제목·이미지·버튼을 클릭으로 쌓아 페이지를 채워요.',
  },
  {
    num: '03',
    title: '공개하기',
    description: '토글 하나로 전 세계에 페이지를 공개해요.',
  },
]

const LandingHowItWorks = () => {
  return (
    <section className="border-t">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 py-24 sm:grid-cols-2 sm:gap-16 sm:py-32">
        <div className="flex flex-col sm:order-2 sm:items-end sm:justify-center sm:text-right">
          <FadeIn>
            <div className="flex items-start gap-3">
              <span className="text-muted-foreground pt-1.5 text-xs font-medium tracking-widest uppercase">
                Steps
              </span>
              <span className="font-heading text-5xl leading-none font-extrabold tracking-tight sm:text-6xl">
                04
              </span>
            </div>
          </FadeIn>
          <FadeIn>
            <h2 className="font-heading mt-10 text-3xl leading-tight font-extrabold tracking-tight text-balance break-keep sm:text-5xl">
              생각보다, 훨씬 간단해요.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-muted-foreground mt-6 leading-7 text-pretty break-keep">
              회원가입부터 공개까지 딱 세 단계. 지금 바로 시작할 수 있어요.
            </p>
          </FadeIn>
        </div>

        <div className="flex flex-col sm:order-1">
          {STEPS.map(({ num, title, description }, index) => (
            <FadeIn key={num} delay={index * 0.1}>
              {index > 0 && <div className="border-border my-8 border-t" />}
              <div className="flex gap-5">
                <span className="font-heading text-muted-foreground/50 text-xl leading-7 font-extrabold">
                  {num}
                </span>
                <div>
                  <h3 className="font-heading text-lg leading-7 font-bold">{title}</h3>
                  <p className="text-muted-foreground mt-2 leading-7 text-pretty break-keep">
                    {description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingHowItWorks
